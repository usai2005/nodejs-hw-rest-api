const { HttpError, transport } = require("../../helpers");
const { User } = require("../../models");

const { BASE_URL } = process.env;

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(400, "missing required field email");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    from: "nm4120bi@meta.ua",
    to: email,
    subject: "Is it everything ok with your hw-06?",
    html: `<div style="width: 100%;">
    <div style="position: relative; left: 50%; top: 50px; transform: translateX(-50%); width:400px; height:50px; background-color:#0000FF; text-align: center;">
    <a style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color:#FFFFFF;" target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Please click here to verify your email</a></div></div>`,
  };

  transport
    .sendMail(verifyEmail)
    .then(() => res.status(201).json({ message: "Verification email sent" }))
    .catch((error) => console.log(error.message));
};

module.exports = resendVerifyEmail;
