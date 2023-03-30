require("dotenv").config();
const { Router } = require("express");
const router = Router();
const { resetPassword } = require("../controllers/auth.controller");
const { verifyToken, isRole,} = require("../middleware/authJwt");
const { listAllStudents, createExam,listStudentById,listAllExams,listExamById, editExam, deleteExam, allGivenExam, givenExam, } = require("../controllers/teacher.controller");
const { validator, idSchema, createExamSchema, resetpasswordSchema } = require("../validators/index.validator");

router.use(verifyToken)
// router.use(isRole(process.env.TEACHER))

router.get("/show-students", listAllStudents);
router.get("/show-students/:id",validator(idSchema),listStudentById)
router.get("/given-exam",allGivenExam)
router.get("/given-exam/:id",validator(idSchema),givenExam)
router.post('/create-exam',validator(createExamSchema), createExam)
router.get('/show-exams',listAllExams)
router.get('/show-exams/:id',validator(idSchema),listExamById)
router.put('/show-exams/:id/edit',validator(idSchema),validator(createExamSchema),editExam )
router.delete('/show-exams/:id/delete',validator(idSchema),deleteExam)
// router.post("/profile/reset-password",validator(resetpasswordSchema),resetPassword );


module.exports = router;
