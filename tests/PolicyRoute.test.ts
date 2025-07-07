import request from 'supertest';
import Jwt from 'jsonwebtoken';
import app from '../src/index';
import { Request, Response, NextFunction } from 'express';
import { log } from 'console';
import { json } from 'body-parser';

jest.mock('../src/data/policies.json', () => [
  {
    id: 'POLICY_001',
    productId: 'prod_motor',
    customerName: 'Alice Smith',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    premium: 320,
    status: 'active',
    createdAt: '2025-01-01T12:00:00Z',
  },
  {
    id: 'POLICY_002',
    productId: 'pet_motor',
    customerName: 'ABC',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    premium: 12,
    status: 'active',
    createdAt: '2025-01-01T12:00:00Z',
  },
]);

jest.mock('../src/data/products.json', () => [
  {
    id: 'prod_motor',
    name: 'Motor Insurance',
    category: 'motor',
    description: 'Covers damage and liability for cars and motorcycles.',
    basePrice: 300,
    createdAt: '2024-01-01T10:00:00Z',
  },
]);

describe(' Policy API', () => {

    const SECRET_KEY = process.env.JWT_SECRET || 'dl_jwt_secret';;
    const mockUser = { userName: 'mockuser'};
    const token = 'Bearer '+Jwt.sign({ id: "U001", username: "mockuser" }, SECRET_KEY, { expiresIn: '10m' });
    /*let req: Partial<Request>;
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
    */

    afterAll(done => {
        done()
    })

    
    test('should get policy by Id return 200', async() => {
        
      const expectedValue = '{\"id\":\"POLICY_001\",\"productId\":\"prod_motor\",\"customerName\":\"Alice Smith\",' 
        + '\"startDate\":\"2025-01-01\",\"endDate\":\"2026-01-01\",\"premium\":320,\"status\":\"active\",' 
        + '\"createdAt\":\"2025-01-01T12:00:00Z\",\"product\":{\"id\":\"prod_motor\",\"name\":\"Motor Insurance\",'
        + '\"category\":\"motor\",\"description\":\"Covers damage and liability for cars and motorcycles.\",\"basePrice\":300,'
        + '\"createdAt\":\"2024-01-01T10:00:00Z\"}}'
      const res = await request(app)
            .get('/policies/POLICY_001');
      
      expect(res.statusCode).toBe(200);
      expect(JSON.stringify(res.body)).toBe(expectedValue);

    });

    test('should get policy by Id return 404 and policy id not found', async() => {
        
      const res = await request(app)
            .get('/policies/NO_001');
      
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Policy not found!');

    });

    test('getPoliciesByCustomerName should return 200 and array of policy', async() => {
        
      const expectedValue = '[{\"id\":\"POLICY_001\",\"productId\":\"prod_motor\",\"customerName\":\"Alice Smith\",' 
      + '\"startDate\":\"2025-01-01\",\"endDate\":\"2026-01-01\",\"premium\":320,\"status\":\"active\",\"createdAt\":\"2025-01-01T12:00:00Z\"}]'
      const res = await request(app)
            .get('/policies/')
            .query('customerName=Alice Smith');
      
      expect(res.statusCode).toBe(200);
      expect(JSON.stringify(res.body)).toBe(expectedValue);

    });

    test('getPoliciesByCustomerName should return 200 and empty array if no policies found', async() => {
        
      const expectedValue = '[]'
      const res = await request(app)
            .get('/policies/')
            .query('customerName=No Cust');
      
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Policy not found!');

    });

    test('createPolicy should return 201 with policy details', async() => {
      
      const expectedValue = '{\"id\":\"pol_3\",\"customerName\":\"p patel2\",\"productId\":\"prod_motor\",\"premium\":12,'
        + '\"startDate\":\"2025-06-06\",\"endDate\":\"2026-06-05\",\"status\":\"active\",\"createdAt\":\"2025-07-06T21:54:49.342Z\"}'

      const policy = {
            "productId": "ppp_001",
            "customerName": "p patel2",
            "startDate": "2025-06-06",
            "endDate": "2026-06-05",
            "premium": 12
          };
                  
      const res = await request(app)
        .post('/policies')
        .send(policy)
        .set('authorization', token);
  
      expect(res.statusCode).toBe(201);
      expect(res.body.id).toBe('pol_3');
      expect(res.body.customerName).toBe('p patel2');
      expect(res.body.productId).toBe('ppp_001');
      expect(res.body.premium).toBe(12);
    });

  test('createPolicy should return 400 if productId is blank', async() => {
      
      const policy = {
            "productId": "",
            "customerName": "p patel2",
            "startDate": "2025-06-06",
            "endDate": "2026-06-05",
            "premium": 12
          };
                  
      const res = await request(app)
        .post('/policies')
        .send(policy)
        .set('authorization', token);
  
      expect(res.statusCode).toBe(400);
      expect(res.body[0].message).toBe('Product ID is required');
    });

    test('createPolicy should return 400 if customerName is blank', async() => {
      
      const policy = {
            "productId": "PROD_001",
            "customerName": "",
            "startDate": "2025-06-06",
            "endDate": "2026-06-05",
            "premium": 12
          };
                  
      const res = await request(app)
        .post('/policies')
        .send(policy)
        .set('authorization', token);
  
      expect(res.statusCode).toBe(400);
      expect(res.body[0].message).toBe('Customer name is required');
    });

    test('createPolicy should return 400 if Premium is required', async() => {
      
      const policy = {
            "productId": "POD_001",
            "customerName": "p patel2",
            "startDate": "2025-06-06",
            "endDate": "2026-06-05"
          };
                  
      const res = await request(app)
        .post('/policies')
        .send(policy)
        .set('authorization', token);
  
      expect(res.statusCode).toBe(400);
      expect(res.body[0].message).toBe('Premium is required');
    });

    test('createPolicy should return 400 if Premium must be integer', async() => {
      
      const policy = {
            "productId": "POD_001",
            "customerName": "p patel2",
            "startDate": "2025-06-06",
            "endDate": "2026-06-05",
            "premium": 'A12'
          };
                  
      const res = await request(app)
        .post('/policies')
        .send(policy)
        .set('authorization', token);
  
      expect(res.statusCode).toBe(400);
      expect(res.body[0].message).toBe('Premium must be integer');
    });


    test('deletePolicy should return 200 if policy found', async() => {

      const res = await request(app)
          .delete('/policies/POLICY_001')
          .set('authorization', token);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Policy deleted successfully');
    });

    test('deletePolicy should return 404 if policy id not found', async() => {

      const res = await request(app)
          .delete('/policies/POLICY_001')
          .set('authorization', token);
      
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Policy not found!');
    });

    test('updatePolicy should return 200 if policy found', async() => {
      
      const expectedValue = '{\"id\":\"POLICY_002\",\"productId\":\"pet_motor\",\"customerName\":\"P Patel\",'
      + '\"startDate\":\"2025-07-01\",\"endDate\":\"2026-07-01\",\"premium\":12,\"status\":\"active\",\"createdAt\":\"2025-01-01T12:00:00Z\"}'

      const policy = {
            customerName: 'P Patel',
            startDate: '2025-07-01',
            endDate: '2026-07-01',
            premium: 12
          };
                  
      const res = await request(app)
        .put('/policies/POLICY_002')
        .send(policy)
        .set('authorization', token);
  
      expect(res.statusCode).toBe(200);
      expect(JSON.stringify(res.body)).toBe(expectedValue);
    });
  
    test('updatePolicy should return 404 if policy not found', async() => {
      
      const policy = {
                    productId: 'POL_001',
                    customerName: 'P Patel',
                    startDate: '2025-07-01',
                    endDate: '2026-07-01',
                    premium: 12
                  };
                  
      const res = await request(app)
        .put('/policies/POLICY_001')
        .send(policy)
        .set('authorization', token);
    
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Policy not found!');
    });

});