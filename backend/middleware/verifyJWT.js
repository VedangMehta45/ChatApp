import jwt from "jsonwebtoken";


export const verifyJWT = (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = { _id: decoded.userId };
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
