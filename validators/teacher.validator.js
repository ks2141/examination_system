const Joi = require("joi");

exports.createExamSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    notes: Joi.string().required(),
    questions: Joi.array()
      .items(
        Joi.object({
          question: Joi.string(),
          options: Joi.array().length(4).items(Joi.string()),
          answerIndex: Joi.number().valid(1, 2, 3, 4),
        })
      )
      .required(),
  });

