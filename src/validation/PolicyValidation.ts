import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { log } from "console";

export const validateCreatePolicy = (req: Request, res: Response, next: NextFunction) => {

    const errors: any[] = [];
    if(!req.body.productId) {
        errors.push({ message: 'Product ID is required'});
    }
    if(!req.body.customerName) {
        errors.push({ message: 'Customer name is required' });
    }

    if(!req.body.premium) {
        errors.push({ message: 'Premium is required' });
    } else if(!Number.isInteger(req.body.premium)){
        errors.push({ message: 'Premium must be integer' });
    }

    if( errors.length > 0 ){
        res.status(400).json(errors);
    }

    if(errors.length == 0){
        next();
    }
}