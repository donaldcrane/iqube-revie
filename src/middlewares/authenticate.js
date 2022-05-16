import jwt from "jsonwebtoken";
import models from "../models";
import { successResponse, errorResponse } from "../utils/responses";

class Authentication {
  /**
   * @param {object} req - The res body object
   * @param {object} res - The res body object
   * @param {object} next -  The function to call next
   * @returns {Function} errorResponse | next
   */
  static async verifyToken(req, res, next) {
    try {
      let decoded;
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            const token = credentials;
            decoded = await jwt.verify(token, process.env.JWT_KEY);
            req.user = await models.User.findById({ _id: decoded._id }).select("-password");
            if (!req.user) { return errorResponse(res, 409, "Invalid user"); }
            return next();
          }
        } else {
          return errorResponse(res, 401, "Invalid authorization format");
        }
      } else {
        return errorResponse(res, 401, "Authorization not found");
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return errorResponse(res, 401, "Session expired, you have to login.");
      }

      if (error.name === "CastError") {
        return errorResponse(res, 401, "Token invalid.");
      }

      if (error.name === "JsonWebTokenError") {
        return errorResponse(res, 401, "Invalid Authorization token");
      } throw error;
    }
  }
}

export default Authentication;
