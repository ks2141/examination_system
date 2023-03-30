const {
  listGivenExamByStudent,
  listAllAvailableExams,
  findAvailableExamById,
  createInitialResult,
  createFinishResultAndSave,
  findRankOfStudentAndMerge,
  setResultSendTime,
  findScheduledTime,
  findByIdAndUpdate,
  findOneResult,
} = require("../services/student.service");
const {response} = require("../helpers/responseService");
const scheduleResult = require("../helpers/scheduleResult");

exports.listGivenExam = async (req, res) => {
  try {
    const exams = await listGivenExamByStudent(req.user.id);
    if (!exams.length) {
      return response(res, 404, "No exam found for given id!");
    }
    return response(
      res,
      200,
      "Given exams of student retrieved successfully",
      exams
    );
  } catch (error) {
    return response(res, 500, error.message);
  }
};
exports.listAllExams = async (req, res) => {
  try {
    const exams = await listAllAvailableExams();

    if (!exams.length) {
      return response(res, 404, "No exam found");
    }
    return response(
      res,
      200,
      "Exam list retrieved successfully.",
      exams
    );
  } catch (error) {
    return response(res, 500, error.message);
  }
};
exports.startExam = async (req, res) => {
  try {
    if (
      await findOneResult({
        examId: req.params.id,
        studentId: req.user.id,
        status: "ongoing",
      })
    ) {
      return response(
        res,
        400,
        "You have already started exam."
      );
    }
    if (
      await findOneResult({
        examId: req.params.id,
        studentId: req.user.id,
        status: "completed",
      })
    ) {
      return response(
        res,
        400,
        "You have already given the exam."
      );
    }

    const exam = await findAvailableExamById(req.params.id);

    if (!exam) {
      return response(res, 404, "No exam found with given id!");
    }
    const result = await createInitialResult(req.params.id, req.user.id, exam);
    // await result.save();

    // await setResultSendTime(result._id, "minute", 2);
    return response(res, 200, "Exam started successfully.", {
      resultId: result._id,
      exam: exam,
    });
  } catch (error) {
    return response(res, 500, error.message);
  }
};
exports.finishExam = async (req, res) => {
  try {
    const result = await findOneResult({ _id: req.params.resultId });
    if (!result) {
      return response(
        res,
        404,
        "No result found with given resultId"
      );
    }
    if (result.status === "completed") {
      return response(res, 400, "Exam already submitted!");
    }
    await setResultSendTime(req.params.resultId, "minute", 2);
    await createFinishResultAndSave(result, req.body.answers);

    await findRankOfStudentAndMerge();
    // get sendEmailAt from start exam and calculate time
    const { time } = await findScheduledTime(req.params.resultId);
    console.log('time :>> ', time);

    await scheduleResult(req.user.id, req.params.resultId, time);
    


    return response(res, 200, "Exam submitted successfully.");
  } catch (error) {
    return response(res, 500, error.message);
  }
};
exports.editProfile = async (req, res) => {
  try {
    await findByIdAndUpdate(req.user.id, { name: req.body.name });
    return response(res, 200, "Profile edited successfully.");
  } catch (error) {
    return response(res, 500, error.message);
  }
};


