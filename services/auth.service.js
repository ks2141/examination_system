const userModel = require("../models/user.model");

exports.createUser = async (body) => {
  return await userModel.create({
    name: body.name,
    email: body.email,
    password: body.password,
    role: body.role,
  });
};

exports.findOneUser = async (match, select) => {
  return await userModel.findOne(match, select);
};
