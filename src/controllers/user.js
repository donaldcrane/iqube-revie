import bcrypt from "bcrypt";
import models from "../models";
import { successResponse, errorResponse } from "../utils/responses";
import jwtHelper from "../utils/jwt";

const { generateToken } = jwtHelper;

/**
 * @class UserController
 * @description create, verify and log in user
 * @exports UserController
 */
export default class UserController {
  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async registerUser(req, res) {
    try {
      const {
        email, username, password, firstName, lastName, phone
      } = req.body;
      const first = firstName.split(" ");
      for (let i = 0; i < first.length; i++) {
        first[i] = first[i].charAt(0).toUpperCase() + first[i].slice(1);
      }

      const last = lastName.split(" ");
      for (let i = 0; i < last.length; i++) {
        last[i] = last[i].charAt(0).toUpperCase() + last[i].slice(1);
      }

      const first_Name = first.join(" ");
      const last_Name = last.join(" ");
      const EmailExist = await models.User.findOne({ email });
      if (EmailExist) return errorResponse(res, 409, "Email already used by another user.");
      const UsernameExist = await models.User.findOne({ username });
      if (UsernameExist) return errorResponse(res, 409, `Sorry, ${username} is not available. Please pick another username`);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email,
        username,
        phone,
        password: hashedPassword,
        firstName: first_Name,
        lastName: last_Name,
      };
      await models.User.create(newUser);
      return successResponse(res, 201, "User created Successfuly, Kindly log in!");
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await models.User.findOne({ email });
      console.log(user);
      if (!user) return errorResponse(res, 409, "Email does not exist.");
      const validpass = await bcrypt.compare(password, user.password);
      if (!validpass) return errorResponse(res, 409, "Password is not correct!.");
      const {
        _id, firstName, lastName, photo, username
      } = user;
      const token = await generateToken({
        _id, email, firstName, lastName, photo, username
      });
      return successResponse(res, 200, "User Logged in Successfully.", token);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async updateUserProfile(req, res) {
    try {
      const { _id } = req.user;
      const { firstName, lastName, username } = req.body;
      const first = firstName.split(" ");
      for (let i = 0; i < first.length; i++) {
        first[i] = first[i].charAt(0).toUpperCase() + first[i].slice(1);
      }

      const last = lastName.split(" ");
      for (let i = 0; i < last.length; i++) {
        last[i] = last[i].charAt(0).toUpperCase() + last[i].slice(1);
      }

      const first_Name = first.join(" ");
      const last_Name = last.join(" ");
      const UsernameExist = await models.User.findOne({ username });
      if (UsernameExist) return errorResponse(res, 409, `Sorry, ${username} is not available. Please pick another username`);
      const userDetails = {
        firstName: first_Name, lastName: last_Name, username
      };
      const user = await models.User.findByIdAndUpdate(
        { _id },
        userDetails,
        { new: true }
      ).select("-password");
      return successResponse(res, 200, "Profile updated Successfully.", user);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The user request object
   * @param {object} res - The user response object
   * @returns {object} Success message
   */
  static async uploadPhoto(req, res) {
    try {
      const { _id } = req.user;
      const userExist = await models.User.findById({ _id });
      if (!userExist) { return errorResponse(res, 409, "User Does Not Exist."); }

      if (!req.file) { return errorResponse(res, 409, "you have to upload an image"); }
      const user = await models.User.findByIdAndUpdate(
        { _id },
        { photo: req.file.path },
        { new: true }
      ).select("-password");
      return successResponse(res, 200, "Profile picture Updated Successfully", user);
    } catch (error) {
      return errorResponse(res, 500, "Server error.");
    }
  }
}
