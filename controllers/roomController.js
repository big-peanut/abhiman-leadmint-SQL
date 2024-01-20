const pool = require("../utils/database");

exports.createRoom = async (req, res, next) => {
  try {
    const { roomName, roomId, password } = req.body;

    // Create a new room in the database
    const createRoomQuery = `
      INSERT INTO rooms (name, roomId, password, creatorId)
      VALUES (?, ?, ?, ?)
    `;
    const [createdRoom] = await pool.query(createRoomQuery, [
      roomName,
      roomId,
      password,
      req.user.id,
    ]);

    // Add the room creator to the UserRoom table
    const addUserToRoomQuery = `
      INSERT INTO user_room (userId, roomId)
      VALUES (?, ?)
    `;
    await pool.query(addUserToRoomQuery, [req.user.id, createdRoom.insertId]);

    // Return room information in the response
    res.json({ roomId: createdRoom.insertId, roomName });
  } catch (err) {
    console.log(err);
  }
};

exports.getChatRooms = async (req, res, next) => {
  try {
    // Fetch all rooms from the database
    const getAllRoomsQuery = "SELECT * FROM rooms";
    const [allRooms] = await pool.query(getAllRoomsQuery);

    res.json({ allRooms });
  } catch (err) {
    console.log(err);
  }
};

exports.joinRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { password } = req.body;

    // Find the room to join in the database
    const findRoomQuery = "SELECT * FROM rooms WHERE id = ?";
    const [roomToJoin] = await pool.query(findRoomQuery, [roomId]);
    console.log("roomtojoin=====", roomToJoin);
    if (roomToJoin.length === 0) {
      return res.json({ success: false, msg: "Room not found" });
    }

    // Check if the provided password matches the room password
    if (roomToJoin[0].password !== password) {
      return res.json({ success: false, msg: "Incorrect Room Password" });
    }

    // Check if the user is already in the room
    const isUserInRoomQuery = `
      SELECT * FROM user_room
      WHERE userId = ? AND roomId = ?
    `;
    const [isUserInRoom] = await pool.query(isUserInRoomQuery, [
      req.user.id,
      roomId,
    ]);
    console.log("isUserInRoom====", isUserInRoom);

    // If not the room creator, add the user to the room
    if (req.user.id !== roomToJoin[0].creatorId && isUserInRoom.length === 0) {
      const addUserToRoomQuery = `
        INSERT INTO user_room (userId, roomId)
        VALUES (?, ?)
      `;
      await pool.query(addUserToRoomQuery, [req.user.id, roomId]);
    }

    // If room joining is successful, send success message
    res.json({ success: true, msg: "Room Joined" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, msg: "Error joining room" });
  }
};

exports.checkRoomMembership = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    // Check if the user is a member of the specified room
    const checkRoomMembershipQuery = `
      SELECT * FROM user_room
      WHERE userId = ? AND roomId = ?
    `;
    const response = await pool.query(checkRoomMembershipQuery, [
      userId,
      roomId,
    ]);
    console.log("room membership====", response[0].length);

    if (response[0].length == 0) {
      return res.json({ ismember: false });
    } else {
      return res.json({ ismember: true });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.countRoomMembers = async (req, res, next) => {
  try {
    const maxCount = 6;
    const roomId = req.params.roomId;

    // Count the number of members in the specified room
    const countRoomMembersQuery = `
      SELECT COUNT(*) as count FROM user_room
      WHERE roomId = ?
    `;
    const [count] = await pool.query(countRoomMembersQuery, [roomId]);

    // Check if the room is full based on a maximum count
    const isFull = count[0].count >= maxCount;
    res.json({ isFull: isFull });
  } catch (err) {
    console.log(err);
  }
};

exports.countNonPrimeRoomMember = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Count the number of rooms the user is a member of
    const countNonPrimeRoomMemberQuery = `
      SELECT COUNT(*) as count FROM user_room
      WHERE userId = ?
    `;
    const [count] = await pool.query(countNonPrimeRoomMemberQuery, [userId]);

    res.json({ count: count[0].count });
  } catch (err) {
    console.log(err);
  }
};
