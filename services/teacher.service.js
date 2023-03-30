const userModel = require("../models/user.model");
const examModel = require("../models/exam.model");
const resultModel = require("../models/result.model");
const { default: mongoose } = require("mongoose");

exports.listGivenExamsGroupByStudents = async (teacherId) => {
  return await resultModel
    .aggregate()
    .match({ status: "completed", isDeleted: false })
    .project({
      examId: 1,
      examName: 1,
      studentId: 1,
      startTime: 1,
      endTime: 1,
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
    })
    .match({ createdBy: mongoose.Types.ObjectId(teacherId) })

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
          createdBY: "$createdBy",
          startTime: "$startTime",
          endTime: "$endTime",
        },
      },
    });
};
exports.createOneExam = async (body, teacherId) => {
  return await examModel.create({
    name: body.name,
    questions: body.questions,
    notes: body.notes,
    createdBy: teacherId,
  });
};
exports.findExam = async (match, select) => {
  return await examModel.find(match, select);
};

exports.findExamAndDelete = async (examId, userId) => {
  return await examModel.findOneAndUpdate(
    {
      _id: examId,
      isDeleted: false,
      createdBy: userId,
    },
    { isDeleted: true }
  );
};
exports.findAllResultAndDelete = async (id) => {
  return await resultModel.updateMany({ examId: id }, { isDeleted: true });
};
exports.findOneStudent = async (id) => {
  return await userModel
    .findById(id)
    .where({ role: "student", isVerified: true })
    .select("name email");
};
exports.findStudents = async () => {
  return await userModel
    .find({ role: "student", isVerified: true })
    .select("name email");
};

exports.findOneExam = async (match, select) => {
  return await examModel.findOne(match).select(select);
};
exports.findExams = async (teacherId, select) => {
  return await examModel.find({ createdBy: teacherId }, select);
};
