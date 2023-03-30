// const { Router } = require("express");
// const router = Router()
const router = require('express').Router()
const authRoutes = require('./auth.routes')
const teacherRoutes = require('./teacher.routes')
const studentRoutes = require('./student.routes')
const { verifyToken, isRole,} = require("../middleware/authJwt");
const { resetPassword } = require("../controllers/auth.controller");
const {resetpasswordSchema, validator} = require("../validators/index.validator");


router.use("/auth",authRoutes)
router.use("/dashboard/teacher",verifyToken,isRole(process.env.TEACHER),teacherRoutes)
router.use("/dashboard/student",verifyToken,isRole(process.env.STUDENT),studentRoutes)
router.post("/dashboard/resetPassword",verifyToken,validator(resetpasswordSchema),resetPassword)

module.exports = router;