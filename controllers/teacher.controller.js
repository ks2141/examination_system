const {
  listGivenExamsGroupByStudents,
  createOneExam,
  findExamAndDelete,
  findAllResultAndDelete,
  findOneStudent,
  findStudents,
  findOneExam,
  findExams,
} = require("../services/teacher.service");
const { listGivenExamByStudent } = require("../services/student.service");
const {response} = require("../helpers/responseService");


exports.listAllStudents = async (req, res) => {
  try {
    const allStudents = await findStudents();
    if (!allStudents.length) {
      return response(res,404, "No students found!");
    }
    return response(res,200,"Student list retrieved",allStudents)
  } catch (error) {
    return response(res, 500, error.message);
  }
}

exports.listStudentById =  async (req, res) => {
  try {
    const student = await findOneStudent(req.params.id)

    if (!student) {
      return response(res,404, "Requested student not found!");
    }
    return response(res,200, "Student retrieved successfully",student);
  } catch (error) {
    return response(res,500,error.message);
  }
}

exports.allGivenExam = async (req, res) => {
  try {
    const givenExam = await listGivenExamsGroupByStudents(req.user.id);

    if (!givenExam.length) {
      return response(res,404,"No student has given exam yet!")
    }
    return response(res,200,"List of student who has given exam retrieved successfully.", givenExam)
  } catch (error) {
    return response(res,500,error.message);
  }
}
exports.givenExam = async (req, res) => {
  try {
    const givenExam = await listGivenExamByStudent(req.params.id);

    if (!givenExam.length) {
      return response(res,404,"No given exam found for id!")
    }
    return response(res,200,"Results of student retrieved successfully", givenExam)
  } catch (error) {
    return response(res,500,error.message);
  }
}

exports.createExam = async (req, res) => {
  try {
    if (await findOneExam({name:req.body.name,isDeleted:false})) {
      return response(res,400,"Exam already exists!!")
    }
    await createOneExam(req.body, req.user.id);
    return response(res,201,"Exam created Successfully.")
  } catch (error) {
    return response(res,500,error.message);
  }
}

exports.listAllExams = async (req, res) => {
  try {
    const allExams = await findExams(req.user.id,
      { name: 1, "questions.question": 1,"questions.options":1,"questions.answerIndex":1 }
    );
    if (!allExams.length) {
      return response(res,404,"Requested exam not found")
    }
    return response(res,200,"Exam list retrieved successfully",allExams)
  } catch (error) {
    return response(res,500,error.message);
  }
}

exports.listExamById =  async (req, res) => {
  try {
    const exam = await findOneExam({_id:req.params.id,createdBy:req.user.id,isDeleted:false},{ name: 1, "questions.question": 1,"questions.options":1,"questions.answerIndex":1 })
    if (!exam) {
      return response(res,404,"Requested exam not found")
    }
    return response(res,200,"Exam retrieved successfully",exam);
  } catch (error) {
    return response(res,500,error.message);
  }
}

exports.editExam = async (req, res) => {
  try {
    // const exam = await findExam({
    //   _id: req.params.id,
    //   isDeleted: false,
    //   createdBy: req.user.id,
    // });
    const exam = await findOneExam({_id:req.params.id,createdBy:req.user.id,isDeleted:false})

    if (!exam) {
      return response(res,404,"Requested exam not found")
    }

    exam.name = req.body.name;
    exam.questions = req.body.questions;
    exam.notes = req.body.notes;
    exam.updatedAt = Date.now();

    await exam.save();
    return response(res,200,"Exam edited successfully");

  } catch (error) {
    return response(res,500,error.message);
  }
}

exports.deleteExam = async (req, res) => {
  try {

    const exam = await findExamAndDelete(req.params.id,req.user.id,);
    if (!exam) {
      return response(res,404,"Requested exam not found")
    }
    const result = await findAllResultAndDelete(req.params.id)
      return response(res,200,`Exam and ${result.modifiedCount} results deleted successfully.`)
  } catch (error) {
    return response(res,500,error.message);
  }
}



