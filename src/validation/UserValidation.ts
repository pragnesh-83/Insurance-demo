import { Request, Response, NextFunction } from "express";
import Joi, { number } from 'joi';

export const validateUser = (req: Request, res:  Response, next:NextFunction) => {

  const schema = Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).json(error);
  } else {
    next();
  }

}