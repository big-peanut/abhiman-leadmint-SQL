const pool = require("../utils/database");

exports.buyPrime = async (req, res, next) => {
  try {
    // Update the user's isPrime status to true
    const buyPrimeQuery = `
      UPDATE users
      SET isPrime = true
      WHERE userId = ?
    `;
    await pool.query(buyPrimeQuery, [req.user.userId]);

    res.json({ message: "Prime membership purchased successfully" });
  } catch (err) {
    console.log(err);
  }
};

exports.deductCoins = async (req, res, next) => {
  try {
    // Extract the amount of coins to be deducted from the request body
    const amount = req.body.coins;

    // Find the user in the database
    const getUserQuery = "SELECT * FROM users WHERE id = ?";
    const [user] = await pool.query(getUserQuery, [req.user.id]);

    // Check if the user has sufficient coins
    if (user[0].coins < amount) {
      return res
        .status(400)
        .json({ success: false, msg: "Insufficient coins" });
    }

    // Deduct the specified amount of coins from the user's account
    const deductCoinsQuery = `
      UPDATE users
      SET coins = coins - ?
      WHERE id = ?
    `;
    await pool.query(deductCoinsQuery, [amount, req.user.id]);

    // Return success message in the response
    return res
      .status(200)
      .json({ success: true, msg: "Coins deducted successfully" });
  } catch (err) {
    console.log(err);
  }
};
