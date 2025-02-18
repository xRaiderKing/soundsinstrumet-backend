import jwt from "jsonwebtoken";

const generarJWT = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"2d"});
};

export default generarJWT;