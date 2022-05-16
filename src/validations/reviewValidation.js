import Joi from "joi";
import objectId from "./common";

const createReview = {
  body: Joi.object({
    name: Joi.string().min(1).required(),
    lanlordReview: Joi.string().min(1).required(),
    enviromentReview: Joi.string().min(1).required(),
    apartmentLocation: Joi.string().min(1).required(),
    amenitiesQuality: Joi.string().min(1).required(),
  }).required(),
};

const editReview = {
  body: Joi.object({
    name: Joi.string().min(1),
    lanlordReview: Joi.string().min(1),
    enviromentReview: Joi.string().min(1),
    apartmentLocation: Joi.string().min(1),
    amenitiesQuality: Joi.string().min(1),
  }).required(),
  params: Joi.object({
    reviewId: objectId.required(),
  }).required(),
};

const validateId = {
  params: Joi.object({
    reviewId: objectId.required(),
  }).required(),
};

export {
  createReview, validateId, editReview
};
