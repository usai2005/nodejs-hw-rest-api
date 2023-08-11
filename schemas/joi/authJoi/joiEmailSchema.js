const Joi = require("joi");
const emailRegexp = require("../../../services");

const joiEmailSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .error(new Error("Помилка від Joi або іншої бібліотеки валідації")),
});

module.exports = joiEmailSchema;
