import jwt from "jsonwebtoken"

const createTokenAndSaveCookie = (userId, res)=>{
    const token = jwt.sign({userId}, process.env.JWT_TOKEN, {
        expiresIn: "5d",
    });
    res.cookie("jwt", token, {
        httpOnly: true, //xss
        secure: true,
        sameSize: "strict", //csrf
    });
};

export default  createTokenAndSaveCookie;