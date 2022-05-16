import models from "../models";
import { successResponse, errorResponse } from "../utils/responses";

/**
 * @class ReviewController
 * @description create Review, get all Reviews, get a Review, delete a Review, update a Review
 * @exports ReviewController
 */
export default class ReviewController {
  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async addReview(req, res) {
    try {
      const { _id } = req.user;
      const {
        name, lanlordReview, enviromentReview, apartmentLocation, amenitiesQuality
      } = req.body;
      const reviewName = name[0].toUpperCase() + name.slice(1).toLowerCase();
      const newReview = {
        name: reviewName,
        user: _id,
        lanlordReview,
        enviromentReview,
        apartmentLocation,
        amenitiesQuality
      };
      const createdReview = await models.Review.create(newReview);
      return res.status(201).json({ status: 201, message: "A Review has been added.", data: createdReview, });
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async addReviewFile(req, res) {
    try {
      const { reviewId } = req.params;
      const { image, video } = req.files;
      const review = await models.Review.findById(reviewId);
      if (!review) return errorResponse(res, 404, "Review not found");

      if (!req.files) { return errorResponse(res, 409, "you have to upload an image"); }
      const updated_review = await models.Review.findByIdAndUpdate(
        { _id: reviewId },
        {
          ...image && { image: req.files.image[0].path },
          ...video && { video: req.files.video[0].path },
        },
        { new: true }
      ).select("-password");
      return successResponse(res, 200, "File added to review Successfully", updated_review);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getReviews(req, res) {
    try {
      const { orderBy } = req.query;
      const reviews = await models.Review.find().sort({ [orderBy]: -1 });
      return successResponse(res, 200, "Successfully retrived all Reviews.", reviews,);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async getReviewById(req, res) {
    try {
      const { reviewId } = req.params;
      const review = await models.Review.findById(reviewId);
      if (!review) return errorResponse(res, 404, "Review not found");
      return successResponse(res, 200, "Successfully retrived Review.", review);
    } catch (error) {
      return errorResponse(res, 500, "Resource not found.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async deleteReview(req, res) {
    try {
      const { reviewId } = req.params;
      const review = await models.Review.findByIdAndRemove({ _id: reviewId });
      if (!review) return errorResponse(res, 404, "Review not found.");

      return successResponse(res, 200, "Successfully Deleted Review.");
    } catch (error) {
      return errorResponse(res, 500, "Resource not found.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async addHelpfulReview(req, res) {
    try {
      const { reviewId } = req.params;
      const review = await models.Review.findById(reviewId);
      if (!review) return errorResponse(res, 404, "Review not found.");
      const helpfulReview = await models.Review.findByIdAndUpdate(
        { _id: reviewId },
        { $inc: { isHelpful: 1 } }
      );
      return successResponse(res, 200, "Successfully added count to Review.", helpfulReview);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async updateReview(req, res) {
    try {
      const { reviewId } = req.params;
      const { name } = req.body;
      const review = await models.Review.findById(reviewId);
      if (!review) return errorResponse(res, 404, "Review not found.");
      let newname;
      if (name) {
        newname = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        req.body.name = newname;
      }
      const updatedReview = await models.Review.findByIdAndUpdate(
        { _id: reviewId },
        req.body,
        { new: true }
      );
      return successResponse(res, 200, "Successfully updated Review.", updatedReview);
    } catch (error) {
      return errorResponse(res, 500, "Resource not found.");
    }
  }
}
