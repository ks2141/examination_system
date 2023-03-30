const Joi = require("joi");
const {response} = require("../helpers/responseService");
const {
  userSignInSchema,
  userSignUpSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
  resetpasswordSchema,
} = require("./auth.validator");
const { createExamSchema } = require("./teacher.validator");
const {submitExamSchema,finishExamSchema} =require("./student.validator");

const idSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

const tokenSchema = Joi.object({
  token: Joi.string()
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/)
    .required(),
});

const validator = (schema) => {
  return async (req, res, next) => {
    try {
      const { error } = await schema.validate(
        { ...req.body, ...req.params, ...req.query },
        { allowUnknown: true }
      );
      if (error) return response(res, 400, error.message);
      next();
    } catch (error) {
      return response(res, 500, error.message);
    }
  };
};

module.exports = {
  validator,
  idSchema,
  tokenSchema,
  createExamSchema,
  finishExamSchema,
  submitExamSchema,
  userSignInSchema,
  userSignUpSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
  resetpasswordSchema,
};
