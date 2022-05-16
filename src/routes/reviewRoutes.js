import { Router } from "express";
import ReviewController from "../controllers/review";
import Authentication from "../middlewares/authenticate";
import parser from "../middlewares/upload";
import validator from "../middlewares/validator";
import {
  createReview, validateId, editReview
} from "../validations/reviewValidation";

const router = Router();
const { verifyToken } = Authentication;
const {
  addReview, addReviewFile, addHelpfulReview, getReviewById, getReviews, deleteReview, updateReview
} = ReviewController;

router.get("/", verifyToken, getReviews);
router.get("/:reviewId", verifyToken, validator(validateId), getReviewById);

router.post("/", verifyToken, validator(createReview), addReview);
router.post("/:reviewId/helpful-review", verifyToken, validator(validateId), addHelpfulReview);

router.patch("/files/:reviewId", verifyToken, validator(validateId), parser.fields([
  { name: "image", maxCount: 1 }, { name: "video", maxCount: 1 },
]), addReviewFile);
router.patch("/:reviewId", verifyToken, validator(editReview), updateReview);
router.delete("/:reviewId", verifyToken, validator(validateId), deleteReview);

export default router;
