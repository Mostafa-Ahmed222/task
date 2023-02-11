import joi from "joi";

//signup validation
export const signup = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().required(),
      storeName: joi.string().required(),
      email: joi.string().email().required().messages({
        "any.required": "please enter your email",
        "string.empty": "email can not be empty",
        "string.base": "please enter valid string email",
      }),
      phone: joi.number().required(),
      // password must be contains number, symbol, capital letter, small letter and consists of 8 letters or more
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .messages({
          "string.pattern.base":
            "Password must be contain number, symbol, capital letter, small letter and consists of 8 letters or more",
        })
        .required(),
        // confirm password
      cPassword: joi
        .string()
        .valid(joi.ref("password"))
        .messages({
          "any.only": "cPassword not match with password",
        })
        .required(),
    }),
};

//confirmEmail validation

export const confirmEmail = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};

//reConfirmEmail validation
export const reConfirmEmail = {
  params: joi.object().required().keys({
    token: joi.string().required(),
  }),
};

//signin validation
export const signin = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "please enter your email",
        "string.empty": "email can not be empty",
        "string.base": "please enter valid string email",
      }),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
          )
        )
        .messages({
          "string.pattern.base":
            "Password must be contain number, symbol, capital letter, small letter and consists of 8 letters or more",
        })
        .required(),
    }),
};
