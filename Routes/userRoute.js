const express = require("express");
const router = express.Router();
const user = require("../Models/UserModel");
const Candidate = require("../Models/CandidateModel");
const { jwttokenmiddleware, generatetoken } = require("../jwt");

//signup route
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new user(data);
    const responce = await newUser.save();
    console.log("data saved");
    const payload = {
      id: responce.id,
    };
    const token = generatetoken(payload);
    res.status(200).json({ responce, token: token });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "internal error" });
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    const { votecardnumber, password } = req.body;
    const userdata = await user.findOne({ votecardnumber: votecardnumber });
    const pass = userdata.password === password ? true : false;
    if (!userdata || !pass) {
      return res.status(404).json({ error: "incorrect password and username" });
    }
    const payload = {
      id: userdata.id,
    };
    const token = generatetoken(payload);
    res.json({ meassage: "successfully login", token: token });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "internal error" });
  }
});

router.put("/profile/password", jwttokenmiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const userdata = await user.findById(userId);
    if (!userdata) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordCorrect = userdata.password === currentPassword; // Use bcrypt in production
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    // Update the password
    userdata.password = newPassword; // Hash the password before saving
    await userdata.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Internal server error" });
  }
});

router.get("/getallcandidates", jwttokenmiddleware, async (req, res) => {
  try {
    // Check if the user has an admin role
    // Fetch all candidates from the database
    const candidates = await Candidate.find(); // Get all candidates

    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ message: "No candidates found" });
    }

    // Return the list of all candidates
    res
      .status(200)
      .json({ message: "Candidates retrieved successfully", candidates });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getallusers", async (req, res) => {
  try {
    // Check if the user has an admin role (optional if required)
    // Fetch all users from the database
    const users = await user.find(); // Get all users

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the list of all users
    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
