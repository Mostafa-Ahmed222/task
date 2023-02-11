import joi from "joi";

// add offer or notification
export const addNotification = {
  body: joi
    .object()
    .required()
    .keys({
      notification: joi.string().required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

// get all notification
export const getAllNotification = {
  query: joi.object().required().keys({
    sortedField: joi.string().valid("id", "notification", "createdAt", "updatedAt").insensitive(),
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

// update notification data by ID
export const updateNotificationById = {
  params: joi.object().required().keys({
    id: joi.number().required(),
  }),
  body: joi.object().required().keys({
    notification: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

// delete notification By ID
export const deleteNotificationById = {
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
