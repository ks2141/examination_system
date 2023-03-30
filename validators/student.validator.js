const Joi = require("joi");

exports.submitExamSchema = Joi.object({
    answers: Joi.array()
      .items(
        Joi.object({
          question: Joi.string(),
          questionId: Joi.string().hex().length(24),
          givenAnswerIndex: Joi.number().valid(1, 2, 3, 4),
        })
      )
      .required(),
  });
  exports.finishExamSchema = Joi.object({
    examId: Joi.string().hex().length(24).required(),
    resultId: Joi.string().hex().length(24).required(),
  });
  

