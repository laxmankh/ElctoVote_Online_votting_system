const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 25, // Assuming a minimum age requirement for candidates
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      voteAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
});

const candidate = mongoose.model("candidate", CandidateSchema);
module.exports = candidate;
