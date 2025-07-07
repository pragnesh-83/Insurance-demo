import { NextFunction, Request, Response } from "express";
import { User } from '../models/User';
import Jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'dl_jwt_secret';

let users: User[] = [];

export const userController = {

    getToken: (req: Request, res: Response) => {
        
      const { userName, password } = req.body;
      const user = users.find((u) => u.userName === userName);

      if (!user) {
        res.status(404).json({ message: 'User not found'});
      }
      if (user && password === user.password) {
        const token = Jwt.sign({ id: user.id, username: user.userName }, SECRET_KEY, { expiresIn: '10m' });
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    
    },

    postRegister: (req: Request, res: Response) => {
      
      const { userName, password } = req.body;
      
      const user = users.find((u) => u.userName === userName);

      if (user) {
        res.status(400).json({ message: 'User already registered'});
      }
      else {
        const newUser: User = {
          id: `user_${users.length + 1}`,
          userName: userName,
          password: password,
        };

        users.push(newUser);
        res.status(201).json({message: 'User registered successfully' });
      }
      
    },

    authenticate: (req: Request, res: Response, next: NextFunction) => {

      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1] as string;

      if (!token) {
        res.status(401).json({ message: 'Access denied. No token provided.' });
      } else {
        try {
          const decode = Jwt.verify(token, SECRET_KEY);
          next();
        } catch (error) {
          res.status(403).json({ message: 'Invalid Token' });
        }
      }
    }
};