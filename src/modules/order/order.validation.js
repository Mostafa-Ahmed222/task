import joi from "joi"


// creating order
export const createOrder = {
  body: joi
    .object()
    .required()
    .keys({
      clientID: joi.number().required(),
      productID: joi.number().required(),
      Quantity: joi.number().min(1).required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

// get orders
export const getOrders = {
  query: joi.object().required().keys({
    page: joi.number().min(1),
    size: joi.number().min(1),
    sortedField: joi.string().valid("id", "clientCode", "clientID", "productID", "Quantity", "clientEmail", "clientName", "Address", "productCode", "productName", "createdAt", "updatedAt").insensitive(),
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

// search for orders
export const searchOrders = {
  query: joi.object().required().keys({
    page: joi.number().min(1),
    size: joi.number().min(1),
    field: joi.string().valid("clientID", "productID", "clientEmail","Address","City").insensitive().required(),
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

// delete order by id
export const deleteOrderById = {
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
