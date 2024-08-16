import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All field are required" });
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
