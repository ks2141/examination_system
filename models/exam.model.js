const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const examSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
      },
      options: [String],
      answerIndex: { type: Number, enum: [1, 2, 3, 4] },
    },
  ],

  notes: String,
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = model("exam", examSchema);
