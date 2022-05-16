import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    name: { type: String, required: true, },
    image: { type: String },
    video: { type: String },
    amenitiesQuality: { type: String, required: true, },
    lanlordReview: { type: String, required: true, },
    enviromentReview: { type: String , required: true,},
    apartmentLocation: { type: String, required: true,},
    isHelpful: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({
  name: "text"
});


module.exports = {
  reviewSchema,
  Review: model("review", reviewSchema),
};

