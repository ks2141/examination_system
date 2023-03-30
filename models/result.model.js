const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const resultSchema = new Schema({
  examId: { type: Schema.Types.ObjectId, ref: "exam" },
  examName: { type: String },
  isDeleted: { type: Boolean, default: false },
  studentId: { type: Schema.Types.ObjectId, ref: "user" },
  startTime: { type: Date },
  endTime: { type: Date },
  answers: [
    {
      questionId: {
        type: Schema.Types.ObjectId,
        ref: "exam",
      },
      givenAnswerIndex: { type: Number, enum: [1, 2, 3, 4] },
    },
  ],
  status: { type: String, enum: ["ongoing", "completed"] },
  score: { type: Number },
  rank: { type: Number },
  isSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = model("result", resultSchema);
 