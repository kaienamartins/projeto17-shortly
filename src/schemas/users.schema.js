import joi from "joi";

export const userSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  confirmPassword: joi.string().valid(joi.ref("password")).required(),
  visitCount: joi.number().default(0),
});

export const userLoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().trim().required(),
});
