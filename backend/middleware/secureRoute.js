import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
// import React from "react";

const secureRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; //cookies.jwt => will get jwt token
    if (!token) {
      return res.status(401).json({ message: "not authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password"); //current loggedIn user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = { _id: user._id, name: user.name, email: user.email };
    next();
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "Internal server error" });
  }
};

export default secureRoute;
