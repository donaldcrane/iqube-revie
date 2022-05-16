import Joi from "joi";

const registerValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().min(5),
    username: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
  }).required(),
};

const loginValidation = {
  body: Joi.object({
    email: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  }).required(),
};
const profileValidation = {
  body: Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    username: Joi.string().min(5),
  }).required(),
};

export {
  registerValidation,
  loginValidation,
  profileValidation
};
