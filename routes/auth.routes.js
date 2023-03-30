const { Router } = require("express");

const router = Router();

const {
  signUp,
  verify,
  signIn,
  forgotPassword,
  updatePassword,
  requestVerification,
} = require("../controllers/auth.controller");
const { validator, tokenSchema, userSignInSchema, userSignUpSchema, forgotPasswordSchema, updatePasswordSchema } = require("../validators/index.validator");


router.post("/signup", validator(userSignUpSchema), signUp);
router.get("/signup/verify",validator(tokenSchema), verify);
router.post('/request-verify',validator(forgotPasswordSchema), requestVerification)
router.post("/signin",validator(userSignInSchema), signIn);
router.post("/forgot-password",validator(forgotPasswordSchema), forgotPassword);
router.post("/update-password",validator(updatePasswordSchema), updatePassword);

module.exports = router;

