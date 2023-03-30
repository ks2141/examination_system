const userModel = require("../models/user.model");
const examModel = require("../models/exam.model");
const resultModel = require("../models/result.model");
const { default: mongoose } = require("mongoose");

exports.listGivenExamByStudent = async (userId) => {
  return await resultModel
    .aggregate()
    .match({
      status: "completed",
      studentId: mongoose.Types.ObjectId(userId),
      isDeleted: false,
    })
    .lookup({
      from: "users",
      localField: "studentId",
      foreignField: "_id",
      as: "student",
    })
    .lookup({
      from: "exams",
      localField: "examId",
      foreignField: "_id",
      as: "exams",
    })
    .project({
      examId: 1,
      examName: "$examName",
      createdBy: { $first: "$exams.createdBy" },
      studentId: 1,
      studentName: {
        $first: "$student.name",
      },
      studentEmail: {
        $first: "$student.email",
      },
      startTime: 1,
      endTime: 1,
      rank: 1,
      totalQuestions: {
        $size: "$answers",
      },
      score: 1,
      correctAnswers: "$score",
      wrongAnswers: {
        $subtract: [
          {
            $size: "$answers",
          },
          "$score",
        ],
      },
    })
    .group({
      _id: {
        name: "$studentName",
        email: "$studentEmail",
        studentId: "$studentId",
      },
      givenExams: {
        $push: {
          examId: "$examId",
          examName: "$examName",
          createdBy: "$createdBy",
          startTime: "$startTime",
          endTime: "$endTime",
          rank: "$rank",
          totalQuestions: "$totalQuestions",
          score: "$score",
          correctAnswers: "$correctAnswers",
          wrongAnswers: "$wrongAnswers",
        },
      },
    });
};
exports.listAllAvailableExams = async () => {
  return await examModel
    .find({ isDeleted: false }, { name: 1, createdBy: 1 })
    .populate("createdBy", { name: 1 });
};
exports.findAvailableExamById = async (id) => {
  return await examModel.findById(id).where({ isDeleted: false }).select({
    name: 1,
    "questions._id": 1,
    "questions.question": 1,
    "questions.options": 1,
    notes: 1,
  });
};
exports.createInitialResult = async (examId, userId, exam) => {
  return await resultModel.create({
    examId: mongoose.Types.ObjectId(examId),
    examName: exam.name,
    studentId: mongoose.Types.ObjectId(userId),
    startTime: Date.now(),
    status: "ongoing",
  });
};
exports.setResultSendTime = async (id, unit, increment) => {
  return await resultModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        sendResultAt: {
          $dateAdd: { startDate: "$startTime", unit: unit, amount: increment },
        },
      },
    },
    {
      $merge: "results",
    },
  ]);
};
exports.createFinishResultAndSave = async (result, answers) => {
  result.endTime = Date.now();
  result.status = "completed";
  result.answers = answers;
  result.updatedAt = Date.now();
  return await result.save();
};
exports.findRankOfStudentAndMerge = async () => {
  return await resultModel.aggregate([
    {
      $lookup: {
        from: "exams",
        localField: "examId",
        foreignField: "_id",
        as: "lookup",
      },
    },
    {
      $unwind: {
        path: "$lookup",
      },
    },
    {
      $project: {
        lookup: "$lookup.questions",
        answers: 1,
        examId: 1,
      },
    },
    {
      $addFields: {
        score: {
          $map: {
            input: "$answers",
            as: "answer",
            in: {
              $cond: {
                if: {
                  $eq: [
                    "$$answer.givenAnswerIndex",
                    {
                      $getField: {
                        field: "answerIndex",
                        input: {
                          $first: {
                            $filter: {
                              input: "$lookup",
                              as: "question",
                              cond: {
                                $eq: ["$$question._id", "$$answer.questionId"],
                              },
                            },
                          },
                        },
                      },
                    },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
    },
    {
      $project: {
        score: {
          $sum: "$score",
        },
        _id: 1,
        examId: 1,
      },
    },
    {
      $setWindowFields: {
        partitionBy: "$examId",
        sortBy: {
          score: -1,
        },
        output: {
          rank: {
            $rank: {},
          },
        },
      },
    },
    {
      $merge: {
        into: "results",
      },
    },
  ]);
};
exports.findScheduledTime = async (id) => {
  const scheduledTime = await resultModel.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        time: {
          $dateToParts: { date: "$sendResultAt", timezone: "Asia/Kolkata" },
        },
      },
    },
  ]);
  return scheduledTime[0];
};
exports.findByIdAndUpdate = async (id, update) => {
  return await userModel.findOneAndUpdate({ _id: id }, update);
};
exports.findOneResult = async (match) => {
  return await resultModel.findOne(match);
};
