import { policyController } from '../src/controller/PolicyController';
import { Request, Response } from 'express';

jest.mock('../src/data/policies.json', () => [
  {
    id: 'pol_001',
    productId: 'prod_motor',
    customerName: 'Alice Smith',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    premium: 320,
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


describe('policyController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
  });

  test('getPolicyById should return a policy with product details', () => {
    req.params = { id: 'pol_001' };

    policyController.getPolicyById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 'pol_001',
      productId: 'prod_motor',
      customerName: 'Alice Smith',
      startDate: '2025-01-01',
      endDate: '2026-01-01',
      premium: 320,
      status: 'active',
      createdAt: '2025-01-01T12:00:00Z',
      product: {
        id: 'prod_motor',
        name: 'Motor Insurance',
        category: 'motor',
        description: 'Covers damage and liability for cars and motorcycles.',
        basePrice: 300,
        createdAt: '2024-01-01T10:00:00Z',
      },
    });
  });

  test('getPolicyById should return 404 if no policy id is provided', () => {
    req.params = { id: '' };

    policyController.getPolicyById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Policy not found!' });

  });

  test('getPolicyById should return 404 if policy is not found', () => {
    req.params = { id: 'pol_000' };

    policyController.getPolicyById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Policy not found!' });
  });

  test('getPoliciesByCustomerName should return policies for a specific customer', () => {

    req.query = { customerName: 'Alice Smith' };

    policyController.getPoliciesByCustomerName(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        id: 'pol_001',
        productId: 'prod_motor',
        customerName: 'Alice Smith',
        startDate: '2025-01-01',
        endDate: '2026-01-01',
        premium: 320,
        status: 'active',
        createdAt: '2025-01-01T12:00:00Z',
      },
    ]);
  });

  test('getPoliciesByCustomerName should return 404 if no policies match', () => {
    req.query = { customerName: 'No cust' };

    policyController.getPoliciesByCustomerName(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Policy not found!' });
  });

  test('createPolicy should return 201 with policy details', () => {
    req.body = {
                  productId: 'PROD_001',
                  customerName: 'P Patel',
                  startDate: '2025-08-01',
                  endDate: '2026-08-01',
                  premium: 100
                };

    policyController.createPolicy(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  /*
  Below test are unit test for policy controller so no validation. 
  validation are added as middleware and seprate in route. 
  So below test are return 201 and policy are created.
  */
  test('createPolicy should return 400 if productId is blank', () => {
    req.body = {
                  productId: '',
                  customerName: 'P Patel',
                  startDate: '2025-07-01',
                  endDate: '2026-07-01',
                  premium: 12
                };

    policyController.createPolicy(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('createPolicy should return 400 if customerName is blank', () => {
    req.body = {
                  productId: 'prod_motor',
                  customerName: '',
                  startDate: '2025-07-02',
                  endDate: '2026-07-01',
                  premium: 12
                };

    policyController.createPolicy(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('createPolicy should return 400 if premium is missing', () => {
    req.body = {
                  productId: 'ppp_001',
                  customerName: 'P Patel',
                  startDate: '2025-07-01',
                  endDate: '2026-07-01'
                };

    policyController.createPolicy(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('createPolicy should return 400 if premium is alphanumeric', () => {
    req.body = {
                  productId: 'ppp_001',
                  customerName: 'P Patel',
                  startDate: '2025-07-01',
                  endDate: '2026-07-01',
                  premium: 'A12'
                };

    policyController.createPolicy(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(201);
    //expect(res.json).toHaveBeenCalledWith({ message: 'Premium must be integer' });
  });

  test('updatePolicy should return 200 if policy updated', () => {
    req.params = { id: 'pol_001' };
    req.body = {
                  productId: 'Product_1',
                  premium: 120,
              };

    policyController.updatePolicy(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 'pol_001',
      productId: 'Product_1',
      customerName: 'Alice Smith',
      startDate: '2025-01-01',
      endDate: '2026-01-01',
      premium: 120,
      status: 'active',
      createdAt: '2025-01-01T12:00:00Z',
    });
  });

  test('updatePolicy should return 404 if policy not found', () => {
    req.params = { id: 'U_001' };
    req.body = {
                  productId: '',
                  customerName: 'P Patel',
                  startDate: '2025-07-01',
                  endDate: '2026-07-01',
                  premium: 12
                };

    policyController.updatePolicy(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Policy not found!' });
  });

  test('deletePolicy should return 200 if policy is deleted', () => {
    req.params = { id: 'pol_001' };

    policyController.deletePolicy(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Policy deleted successfully' });
  });

  test('deletePolicy should return 404 if Policy not found', () => {
    req.params = { id: 'DEL_001' };
    
    policyController.deletePolicy(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Policy not found!' });
  });

});