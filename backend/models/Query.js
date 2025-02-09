import mongoose from "mongoose";

const { Schema } = mongoose;

const QuerSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  topic: {
    type: String,
  },
  answers: [
    {
      username: {
        type: String,
        required: true,
      },
      isStudent: {
        type: Boolean,
        default: false,
      },
      answer: {
        type: String,
        required: true,
      },
      replaydate: {
        type: Date,
        default: () =>
          new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      },
    },
  ],
  createdAt: {
    type: Date,
    default: () =>
      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  },
});

export default mongoose.model("QuerSchema", QuerSchema);
