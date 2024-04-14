import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt"
import userModel from "./userModel";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    //validation
    if (!name || !email || !password) {
        const error = createHttpError(400,"All fileds are require");
        return next(error)
    }
       
    //Database call
    const user = await userModel.findOne({email})
    if(user){
        const error = createHttpError(400,"User Already exits with this email")
        return next(error)
    }

    //password-hash
    const hashedPassword = await bcrypt.hash(password,10)
    

    //proccess
    //response
    res.json({ message: "User registered agian" });
};

export { createUser };