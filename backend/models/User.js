import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  score: { type: Number, default: 0 },
  quizParticipated: { type: Number, default: 0 },
  level: { type: Number, default: 10 },
  isStudent: { type: Boolean, default: true },
  streak: { type: Number, default: 0 }, // Current streak
  lastActiveDate: { type: Date }, // Last login date
  streakHistory: [
    {
      streak: Number,
      startDate: Date,
      endDate: Date,
    },
  ],

  topics: [{ type: String }],

  // Stores past streaks
});

export default mongoose.model("Student", StudentSchema);
