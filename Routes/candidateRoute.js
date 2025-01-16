const express = require("express");
const router = express.Router();
const Candidate = require("../Models/CandidateModel");
const { jwttokenmiddleware, generatetoken } = require("../jwt");
const { route } = require("./userRoute");
const User = require("../Models/UserModel");
const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (user.role === "admin") {
      return true;
    }
  } catch (err) {
    return false;
  }
};

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

// POST route to add a candidate
router.post("/createcandiate", jwttokenmiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user does not have admin role" });

    const data = req.body; // Assuming the request body contains the candidate data

    // Create a new User document using the Mongoose model
    const newCandidate = new Candidate(data);

    // Save the new user to the database
    const response = await newCandidate.save();
    console.log("data saved");
    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/updatecandidate/:id", jwttokenmiddleware, async (req, res) => {
  try {
    // Check if the user has an admin role
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const candidateId = req.params.id; // Get the candidate ID from the URL parameters
    const dataToUpdate = req.body; // Get the new data for the candidate from the request body

    // Find the candidate by ID and update the data
    const updatedCandidate = await Candidate.findByIdAndUpdate(
      candidateId,
      dataToUpdate,
      { new: true }
    );

    if (!updatedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Send a response with the updated candidate data
    res
      .status(200)
      .json({ message: "Candidate updated successfully", updatedCandidate });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deletecandidate/:id", jwttokenmiddleware, async (req, res) => {
  try {
    // Check if the user has an admin role
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const candidateId = req.params.id; // Get the candidate ID from the URL parameters

    // Find the candidate by ID and delete the data
    const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);

    if (!deletedCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Send a response indicating the candidate was deleted
    res
      .status(200)
      .json({ message: "Candidate deleted successfully", deletedCandidate });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/vote/:candidateID", jwttokenmiddleware, async (req, res) => {
  // no admin can vote
  // user can only vote once

  candidateID = req.params.candidateID;
  userId = req.user.id;

  try {
    // Find the Candidate document with the specified candidateID
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.role == "admin") {
      return res.status(403).json({ message: "admin is not allowed" });
    }
    if (user.isvoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Update the Candidate document to record the vote
    candidate.votes.push({ user: userId, voteAt: new Date() }); // Add voteAt timestamp to each vote
    candidate.voteCount++; // Increment vote count properly
    await candidate.save();

    // update the user document
    user.isvoted = true;
    await user.save();

    return res.status(200).json({ message: "Vote recorded successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    // Check if the user has an admin role
    // Fetch all candidates from the database
    const candidates = await Candidate.find().sort({ voteCount: "desc" }); // Get all candidates

    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ message: "No candidates found" });
    }

    const voteRecord = candidates.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return res.status(200).json(voteRecord);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
