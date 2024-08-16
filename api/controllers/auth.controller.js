import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      next(errorHandler(400, "All fields are required"));
    }

    const hashPasword = bcryptjs.hashSync(password, 10);
    await User.create({
      username,
      email,
      password: hashPasword,
    });

    res.status(200).send("Signup Success");
  } catch (error) {
    next(error);
  }
};
