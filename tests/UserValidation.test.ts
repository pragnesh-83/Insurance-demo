import { error, log } from 'console';
import { validateUser } from '../src/validation/UserValidation';
import { Request, Response, NextFunction } from 'express';

describe('userValidation', () => {
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
  
    test('Validate user should return 400 with user name is blank', () => {
        req.body = {
                    userName: '',
                    password: 'password'
                };
        
        validateUser(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Validate user should return 400 with password is blank', () => {
        req.body = {
                    userName: 'userName',
                    password: ''
                };
        
        validateUser(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('Validate user should return 400 with username and password are blank', () => {
        req.body = {
                    userName: '',
                    password: ''
                };
        validateUser(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
    });

});