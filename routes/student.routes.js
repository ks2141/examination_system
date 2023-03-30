require("dotenv").config();
const { Router } = require("express");
const router = Router();
const { listAllExams, startExam, finishExam, editProfile, listGivenExam } = require("../controllers/student.controller");
const { verifyToken, isRole,} = require("../middleware/authJwt");
const { resetPassword } = require("../controllers/auth.controller");
const {validator, idSchema, finishExamSchema, resetpasswordSchema, submitExamSchema } = require("../validators/index.validator");


router.use(verifyToken)
// router.use(isRole(process.env.STUDENT))

router.get("/given-exams",listGivenExam)
router.get("/exams", listAllExams);
router.post("/exams/:id/start-exam",validator(idSchema),startExam)
router.post("/exams/:examId/finish-exam/:resultId",validator(finishExamSchema),validator(submitExamSchema),finishExam)
router.put("/profile/edit",editProfile)
// router.post("/profile/reset-password",validator(resetpasswordSchema),resetPassword);

module.exports = router;
