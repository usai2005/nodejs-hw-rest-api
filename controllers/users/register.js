const bcrypt = require("bcrypt");
const { User } = require("../../models");
const { HttpError, transport } = require("../../helpers");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const { BASE_URL } = process.env;

const register = async (req, res) => {
  // checking if user with such email is already registered
  // if yes show err code 409 and notification
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  // hashing password
  const hashPassword = await bcrypt.hash(password, 10);
  // creating of temporary user avatar
  const avatarURL = gravatar.url(email);
  // create an verificationToken for verification of user via email
  const verificationToken = nanoid();

  // adding a new user if he's registering with unique email
  // with hashed password and verificationToken
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  // creating the email that'll be send to user's email for verification. Because of using verificationToken the URL is unique
  const verifyEmail = {
    from: "nm4120bi@meta.ua",
    to: email,
    subject: "Is it everything ok with your hw-06?",
    html: `<div style="width: 100%;">
    <div style="position: relative; left: 50%; top: 50px; transform: translateX(-50%); width:400px; height:50px; background-color:#0000FF; text-align: center;">
    <a style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color:#FFFFFF;" target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">
    Please click here to verify your email
    </a>
    </div>
    </div>`,
  };

  transport
    .sendMail(verifyEmail)
    .then(() => console.log("WOW! Success!!!"))
    .catch((error) => console.log(error.message));

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

module.exports = register;
