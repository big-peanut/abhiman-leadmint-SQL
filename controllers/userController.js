const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const pool = require("../utils/database");

dotenv.config();

exports.signup = async (req, res, next) => {
  try {
    const { name, userId, deviceId, phone, password, coins } = req.body;

    // Check if the user already exists
    const existingUserQuery = "SELECT * FROM users WHERE userId = ?";
    const [existingUser] = await pool.query(existingUserQuery, [userId]);

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ error: "Email already registered. Please login" });
    }

    // Hash the password before storing it in the database
    const saltRounds = 5;
    const hash = await bcrypt.hash(password, saltRounds);

    // Create a new user in the database
    const createUserQuery = `
      INSERT INTO users (name, userId, deviceId, phone, password, coins)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [userData] = await pool.query(createUserQuery, [
      name,
      userId,
      deviceId,
      phone,
      hash,
      coins,
    ]);

    // Return the user data in the response
    res.json({ userData });
  } catch (err) {
    // Handle errors during signup
    res.status(500).json({ error: "Failed to sign up" });
  }
};

function generateAccessToken(name, userId) {
  return jwt.sign({ name: name, userId: userId }, process.env.JWT_SECRET_KEY);
}

exports.login = async (req, res, next) => {
  try {
    const { name, userId, password } = req.body;

    // Check if the user exists in the database
    const existingUserQuery =
      "SELECT * FROM users WHERE userId = ? AND name = ?";
    const [existingUser] = await pool.query(existingUserQuery, [userId, name]);

    if (existingUser.length === 0) {
      return res
        .status(404)
        .json({ error: "User not registered. Please sign up" });
    }

    // Compare the provided password with the hashed password in the database
    const result = await bcrypt.compare(password, existingUser[0].password);

    if (result) {
      // If the password is correct, generate and return a JWT token
      const token = generateAccessToken(
        existingUser[0].name,
        existingUser[0].userId
      );
      return res
        .status(200)
        .json({ message: "User login successful", token: token });
    } else {
      return res.status(400).json({ error: "Incorrect password" });
    }
  } catch (err) {
    // Handle errors during login
    res.status(500).json({ error: "Failed to login" });
    console.log(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const getUserQuery = "SELECT * FROM users WHERE userId = ?";
    const [user] = await pool.query(getUserQuery, [req.user.userId]);

    if (user.length > 0) {
      res.json({ user: user[0] });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const getAllUsersQuery = "SELECT * FROM users";
    const [allUsers] = await pool.query(getAllUsersQuery);

    res.json({ allUsers });
  } catch (err) {
    console.log(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const id = req.params.userId;
    const getProfileQuery = "SELECT * FROM users WHERE id = ?";
    const [userProfile] = await pool.query(getProfileQuery, [id]);

    if (userProfile.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.json({ userProfile: userProfile[0] });
  } catch (err) {
    console.log(err);
  }
};

exports.addFriend = async (req, res, next) => {
  try {
    const receiverId = req.body.receiverId;
    const senderId = req.user.id;

    // Check if users are already friends
    const areAlreadyFriendsQuery =
      "SELECT * FROM friendrequests WHERE senderId = ? AND receiverId = ? AND areFriends = true";
    const [areAlreadyFriends] = await pool.query(areAlreadyFriendsQuery, [
      senderId,
      receiverId,
    ]);

    if (areAlreadyFriends.length > 0) {
      return res.json({
        success: false,
        msg: "Users are already friends.",
      });
    }

    // Create a new friend request in the database
    const addFriendQuery = `
      INSERT INTO friendrequests (senderId, receiverId, areFriends)
      VALUES (?, ?, true)
    `;
    await pool.query(addFriendQuery, [senderId, receiverId]);

    res.json({ success: true, msg: "Users are now friends." });
  } catch (err) {
    console.log(err);
  }
};

exports.getFriends = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const getFriendsQuery = `
      SELECT u.id, u.name
      FROM users u
      INNER JOIN friendrequests f ON (u.id = f.senderId OR u.id = f.receiverId)
      WHERE (f.senderId = ? OR f.receiverId = ?) AND f.areFriends = true
        AND u.id <> ?
    `;
    const [friends] = await pool.query(getFriendsQuery, [
      userId,
      userId,
      userId,
    ]);
    console.log("friends====", friends);
    res.json({ friends });
  } catch (err) {
    console.log(err);
  }
};
