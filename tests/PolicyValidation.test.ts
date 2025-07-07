import { validateCreatePolicy } from '../src/validation/PolicyValidation';
import { Request, Response, NextFunction } from 'express';

describe('policyValidation', () => {
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

    test('Validate policy should return 400 with product id is blank', () => {
        req.body = {
                    productId: '',
                    customerName: 'P Patel',
                    startDate: '2025-07-01',
                    endDate: '2026-07-01',
                    premium: 12
                };
        
        validateCreatePolicy(req as Request, res as Response, next as NextFunction);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith([{ message: 'Product ID is required' }]);
    });

    test('Validate policy should return 400 with customer name is blank', () => {
        req.body = {
                    productId: 'POD_001',
                    customerName: '',
                    startDate: '2025-07-01',
                    endDate: '2026-07-01',
                    premium: 12
                };
        
        validateCreatePolicy(req as Request, res as Response, next as NextFunction);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith([{ message: 'Customer name is required' }]);
    });

    test('Validate policy should return 400 with premium is blank', () => {
        req.body = {
                    productId: 'POD_001',
                    customerName: 'P Patel',
                    startDate: '2025-07-01',
                    endDate: '2026-07-01',
                    premium: ''
                };
        
        validateCreatePolicy(req as Request, res as Response, next as NextFunction);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith([{ message: 'Premium is required' }]);
    });

    test('Validate policy should return 400 with premium is alphanumeric', () => {
        req.body = {
                    productId: 'POD_001',
                    customerName: 'P Patel',
                    startDate: '2025-07-01',
                    endDate: '2026-07-01',
                    premium: 'A12'
                };
        
        validateCreatePolicy(req as Request, res as Response, next as NextFunction);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith([{ message: 'Premium must be integer' }]);
    });

    test('Validate policy should return 400 with product Id and customer name are blank', () => {
        req.body = {
                    productId: '',
                    customerName: '',
                    startDate: '2025-07-01',
                    endDate: '2026-07-01',
                    premium: 12
                };
        
        validateCreatePolicy(req as Request, res as Response, next as NextFunction);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith([{ message: 'Product ID is required' }, 
                { 'message': 'Customer name is required'}
        ]);
    });

});