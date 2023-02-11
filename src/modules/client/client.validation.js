import joi from "joi";

//add Clients validation
export const addClients = {
  body: joi
    .object()
    .required()
    .keys({
      Code: joi.string(),
      Email: joi.string().email().messages({
        "any.required": "please enter your email",
        "string.empty": "email can not be empty",
        "string.base": "please enter valid string email",
      }),
      Name: joi.string(),
      Address: joi.string(),
      City: joi.string(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

//get All Clients validation
export const getAllClients = {
  query: joi.object().required().keys({
    page: joi.number().min(1),
    size: joi.number().min(1),
    sortedField: joi.string().valid("id", "Code", "Email","Name","Address","City", "createdAt", "updatedAt").insensitive(),
    orderedBy: joi.string().valid("ASC", "DESC").insensitive()
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

//search for Clients validation
export const searchClients = {
  query: joi.object().required().keys({
    page: joi.number().min(1),
    size: joi.number().min(1),
    field: joi.string().valid("id","Code","Email","Name","Address","City").insensitive().required(),
    key: joi.string().required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

//update Client By Id validation
export const updateClientById = {
  params: joi.object().required().keys({
    id: joi.number().required(),
  }),
  body: joi.object().required().keys({
    Code: joi.string().required(),
    Email: joi.string().email().messages({
      "any.required": "please enter your email",
      "string.empty": "email can not be empty",
      "string.base": "please enter valid string email",
      }).required(),
    Name: joi.string().required(),
    Address: joi.string().required(),
    City: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

//delete Client By Id validation
export const deleteClientById = {
  params: joi.object().required().keys({
    id: joi.number().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};




