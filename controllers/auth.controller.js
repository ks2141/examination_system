
const bcrypt = require("bcrypt");
const { sendMail, renderTemplate, MailTemplates } = require("../helpers/mail");

const { createUser, findOneUser } = require("../services/auth.service");
const { makeJwtToken, verifyJwtToken } = require("../helpers/jwt");
const { response } = require("../helpers/responseService");

exports.signUp = async (req, res) => {
  try {
    if (await findOneUser({ email: req.body.email })) {
      return response(res, 400, "Email already in use");
    }
    const user = await createUser(req.body);
    const token = await makeJwtToken({ id: user._id }, "5 min");
    const emailBody = await renderTemplate(MailTemplates.CONFIRM, user, {
      token: token,
      action: "signUp/verify",
    });

    await sendMail(user, "Verify Your Account", emailBody);
    const newUser = await findOneUser(
      { _id: user._id },
      { name: 1, email: 1, role: 1 }
    );
    return response(
      res,
      201,
      "User created Successfully, Please check your email.",
      newUser
    );
  } catch (error) {
    return response(res, 500, error.message);
  }
};

exports.verify = async (req, res) => {
  try {
    const decoded = await verifyJwtToken(req.query.token);
    const user = await findOneUser({ _id: decoded.id });
    if (!user) {
      return response(res, 401, "Verification failed!");
    }
    if (user.isVerified) {
      return response(res, 400, "User already verified");
    }
    user.isVerified = true;
    await user.save();
    return response(res, 200, "User verified successfully.");
  } catch (error) {
    return response(res, 500, error.message);
  }
};

exports.requestVerification = async (req, res) => {
  const user = await findOneUser({ email: req.body.email });
  if (!user) {
    return response(res, 400, "User not found for given email!");
  }
  if (user.isVerified) {
    return response(res, 400, "User already verified");
  }
  const token = await makeJwtToken({ id: user._id }, "5 min");
  const emailBody = await renderTemplate(MailTemplates.CONFIRM, user, {
    token: token,
    action: "signUp/verify",
  });

  await sendMail(user, "Verify Your Account", emailBody);
  return response(
    res,
    200,
    "Verification mail sent successfully, Please check your email."
  );
};

exports.signIn = async (req, res) => {
  try {
    const user = await findOneUser({ email: req.body.email });
    if (!user) {
      return response(res, 400, "User not found for given email!");
    }
    if (!user.isVerified) {
      return response(res, 401, "User not verified");
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return response(res, 400, "Invalid password!");
    }
    const token = await makeJwtToken(
      { id: user._id, role: user.role },
      "1 day"
    );

    return response(res, 200, "Login Successful.", {
      user: user,
      accessToken: token,
    });
  } catch (error) {
    return response(res, 500, error.message);
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    const user = await findOneUser({ email: req.body.email });
    if (!user) {
      response(res, 400, "No user found for given email!");
    }
    if (!user.isVerified) {
      return response(res, 401, "User not verified");
    }
    const resetToken = await makeJwtToken({ id: user._id }, "5 min");

    const emailBody = await renderTemplate(MailTemplates.CONFIRM, user, {
      token: resetToken,
      action: "update-password",
    });

    await sendMail(user, "Update Password", emailBody);
    return response(
      res,
      200,
      "Password reset link generated, Check your email!"
    );
  } catch (error) {
    return response(res, 500, error.message);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const decoded = await verifyJwtToken(req.query.token);
    const user = await findOneUser({ _id: decoded.id });
    if (!user) {
      // return res
      //   .status(401)
      //   .json({ success: false, message: "User not found for given token!" });
      return response(res, 401, "User not found for given token!");
    }
    user.password = req.body.password;
    await user.save();
    return response(res, 200, "Password changed successfully.");
  } catch (error) {
    return response(res, 500, error.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = await findOneUser({ _id: req.user.id }); // i can just get user id by verifyToken auth
    if (!user) {
      return response(res, 404, "User not found for given token");
    }
    if (!bcrypt.compareSync(req.body.oldPassword, user.password)) {
      return response(res, 400, "Old password doesn't match");
    }
    user.password = req.body.newPassword;
    await user.save();

    return response(res, 200, "Password updated successfully.");
  } catch (error) {
    return response(res, 500, error.message);
  }
};
