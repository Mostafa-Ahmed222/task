import joi from "joi"

// add products
export const addProduct = {
    body: joi.object().required().keys({
      Code: joi.string(),
      Name: joi.string(),
      Quantity: joi.number(),
      Description: joi.string(),
      Category: joi.string(),
      Trademark: joi.string(),
    }),
    headers: joi.object().required().keys({
      authorization: joi.string().required()
    }).options({allowUnknown : true})
  };

// get all products
export const getAllProducts = {
  query: joi.object().required().keys({
    page: joi.number().min(1),
    size: joi.number().min(1),
    sortedField: joi.string().valid("id", "Code","Name","Quantity","Description","Category", "Trademark", "createdAt", "updatedAt").insensitive(),
    orderedBy: joi.string().valid("ASC", "DESC").insensitive()
  }),
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
};

//search for products
export const searchProducts = {
  query: joi.object().required().keys({
    page: joi.number().min(1),
    size: joi.number().min(1),
    field: joi.string().valid("id", "Code", "Name", "Quantity", "Description", "Category", "Trademark").insensitive().required(),
    key: joi.string().required(),
  }),
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
};

// update product
export const updateProductById = {
  params: joi.object().required().keys({
    id: joi.number().required(),
  }),
  body: joi.object().required().keys({
    Code: joi.string().required(),
    Name: joi.string().required(),
    Quantity: joi.number().required(),
    Description: joi.string().required(),
    Category: joi.string().required(),
    Trademark: joi.string().required(),
  }),
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
}

// update Quantities from excel sheet
export const updateQuantities = {
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
};

// delete product
export const deleteProductByID = {
  params: joi.object().required().keys({
    id: joi.number().required(),
  }),
  headers: joi.object().required().keys({
    authorization: joi.string().required()
  }).options({allowUnknown : true})
};