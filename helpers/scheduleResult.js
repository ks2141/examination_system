const cron = require("node-cron");
const { renderTemplate, sendMail, MailTemplates } = require("../helpers/mail");
const { findOneUser } = require("../services/auth.service");
const { findOneResult } = require("../services/student.service");
// scheduleResult.js
module.exports = async (studentId, resultId, time) => {
  return cron.schedule(
    `${time.minute} ${time.hour} ${time.day} ${time.month} *`,
    async () => {
      const user = await findOneUser({ _id: studentId });
      const generatedResult = await findOneResult({ _id: resultId });

      const emailBody = await renderTemplate(
        MailTemplates.RESULT,
        user,
        generatedResult
      );
      await sendMail(user, "Student Result", emailBody);

      generatedResult.isSent = true;
      await generatedResult.save();
      console.log("Result sent in email DB updated.....");
    }
  );
};
