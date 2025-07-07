import { json } from 'body-parser';
import { userController } from '../src/controller/UserController';
import { Request, Response, NextFunction } from 'express';
import { string } from 'joi';

describe('userController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next ={};

    });

    test('postRegister should return 201 with user registered successfully', () => {
        req.body = {
                    "userName": "PPatel",
                    "password": "Cognizant"
                };

        userController.postRegister(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
    });

    test('postRegister should return 400 with user already registered', () => {
        req.body = {
                    "userName": "Cognizant",
                    "password": "password1"
                };

        userController.postRegister(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);

        req.body = {
                    "userName": "Cognizant",
                    "password": "password1"
                };

        userController.postRegister(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'User already registered' });
    });

    test('getToken should return 200 and token with valid user and password', () => {
        req.body = {
                    "userName": "user1",
                    "password": "password1"
                };

        userController.postRegister(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);

        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next ={};

        req.body = {
                    "userName": "user1",
                    "password": "password1"
                };

        userController.getToken(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    test('getToken should return 401 with invalid user', () => {
        req.body = {
                    "userName": "user2",
                    "password": "password1"
                };

        userController.postRegister(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        
        req.body = {
                    "userName": "wrong_user",
                    "password": "password1"
                };

        userController.getToken(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    test('getToken should return 401 with invalid password', () => {
        req.body = {
                    "userName": "user3",
                    "password": "password1"
                };

        userController.postRegister(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(201);
        
        req.body = {
                    "userName": "user3",
                    "password": "wrong_password1"
                };

        userController.getToken(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
    });

    test('authenticate should return next middleware with valid user and password', () => {
        
        req.body = {
                    "userName": "user1",
                    "password": "password1"
                };

        userController.getToken(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(200);
        let token = 'bearer ' + res.json;
        req.headers = { Authorization: token };
        
        userController.authenticate(req as Request, res as Response, next as NextFunction);
    });

    test('authenticate should return 403 with Invalid token', () => {
        req.headers= { authorization: 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX' };
        
        userController.authenticate(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Token' });
    });

    test('authenticate should return 401 with access denied if no authorization token', () => {
        req.headers = { authorization: '' };
        
        userController.authenticate(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
    });

     test('authenticate should return 401 with access denied if only bearer in authorization token', () => {
        req.headers = { authorization: 'bearer' };
        
        userController.authenticate(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied. No token provided.' });
    });
});