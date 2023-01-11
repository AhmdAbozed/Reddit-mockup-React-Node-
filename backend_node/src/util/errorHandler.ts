import { Request, Response, NextFunction } from 'express'

//Extending Error so that baseError also has stack logging
export class BaseError extends Error{
    statusCode:number;
    constructor(code:number = 500, desc:string = "unspecified error"){
        //super here sets Error parent's message to desc, as parent's constructor takes 1 string argument for message
        super(desc);
        this.statusCode = code;
        
    }
}

export const sendError = (err: BaseError,req: Request,res: Response,next:NextFunction)=>{
    console.log("\nCAUGHT ERROR: \n"+err.stack + "\n END OF CAUGHT ERROR\n\n");
    res.status(err.statusCode).send(err.message)
}