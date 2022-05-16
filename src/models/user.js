import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      maxlength: 60,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      maxlength: 50,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    phone: {
      type: String,
      unique: true,
    },
    photo: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = {
  userSchema,
  User: model("user", userSchema),
};
