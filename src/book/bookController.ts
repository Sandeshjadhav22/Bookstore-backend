import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import bookModel from "./bookModel";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    const {title,genre} = req.body
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);

    const fileName = files.coverImage[0].filename;

    const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
    );

   

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            filename_override: fileName,
            folder: "book-covers",
            format: coverImageMimeType,
        });
    
        const bookFileName = files.file[0].filename;
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads",
            bookFileName
        );
    
        const bookFileUploadResult = await cloudinary.uploader.upload(
            bookFilePath,
            {
                resource_type: "raw",
                filename_override: bookFileName,
                folder: "book-Pdfs",
                formate: "pdf",
            }
        );
        console.log("uploadResult", uploadResult);
        console.log("uploadResults",uploadResult);

         const newBook = await bookModel.create({
            title,
            genre,
            author: "661b91cb30f57abe7001874f",
            coverImage: uploadResult.secure_url,
            file: bookFileUploadResult.secure_url,
         })
        
    } catch (error) {
        console.log(error);
        return next(createHttpError(500,'Error while uploading files'))
        
    }


    res.json({});
};

export { createBook };
