# Insurance Application Overview
This project is an Insurance application which provide CURD opration on policy and built with Express JS and TypeScript. It provides a scalable and maintainable structure for developing RESTful APIs.

# Project tree
```
insurance-rest-api
├── src
│   ├── controller                        # Application controllers
│   ├── data                              # static policy and product data for test
│   ├── models                            # Data models
│   ├── routes                            # Application routes
│   └── validation                        # Middleware as validation
│   ├── index.ts                          # Main application setup and server startup
├── tests                                 # Unit test and Integration test
├── coverage                              # Test coverage report
├── Insurance.postman_collection.json     # Postman collection to import
├── jest.config.js                        # Jest configuration
├── package.json                          # Project metadata and dependencies management
├── README.md                             # Project documenttation
└── tsconfig.json                         # TypeScript configuration

```

# Getting Started

# Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

# Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd insurance-rest-api
   ```
3. Install the dependencies:
   ```
   npm install
   ```

# Running the Application
To start the server, run:
```
npm start
```
Import the postman collection and call the examples in the request api

# API Endpoints

# Public Endpoints
1. **GET `/api/policies/:id`**
   - Retrieves a single policy by its policy Id which also include the full product object.
   - Return below response status code and message
 
      |  Status code |  Message   | Description |
      |  -------------  |  -------------  |  -------------  |
      |  200 |   |  Retrun policy object along with product object   |
      |  400   |  Policy not found! |  if policy not found for procvided policy id  |

   - Sample return policy object
   ``` json
   {
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
    }
   ```

2. **GET `/api/policies?customerName=<name>`**
   - Retrieves all policies belonging to the specified customer name.
   - Return below response status code and message
   
      |  Status code |  Message  |  Description |
      | ------------- | ------------- | ------------- |
      | 200   |   | Retrun policy object as per below sample object  |
      | 404  | Policy not found!  | if policy not found for provided customer name  |

   - Sample return policy object
   ``` json
   {
      id: 'pol_001',
      productId: 'prod_motor',
      customerName: 'Alice Smith',
      startDate: '2025-01-01',
      endDate: '2026-01-01',
      premium: 320,
      status: 'active',
      createdAt: '2025-01-01T12:00:00Z',
    }
   ```
# Authenticated Endpoints (Requires API Key)
1. **POST `/api/policies`**
   - Creates a new policy.
   - Requires the authorization token (Need to generate with user/token api).
   - Return below response status code and message

      | Status code  | Message | Description |
      | ------------- | ------------- | ------------- |
      | 201   |  Policy Object | provided as sample object below |
      | 400  | Product ID is required  | if productId is missing or blank   |
      | 400  | Customer name is required  | if custmerName is missing or blank   |
      | 400  | Premium is required  | if premium is missing or blank   |
      | 400  | Premium must be integer  | if premium is not provided as integer value   |

   - Sample input policy object
   ``` json
      {
      "productId": "ppp_001",
      "customerName": "p patel2",
      "startDate": "2025-06-06",
      "endDate": "2026-06-05",
      "premium": 12
      }
   ```
   - Sample return policy object
   ``` json
      {
         id: 'pol_001',
         productId: 'prod_motor',
         customerName: 'Alice Smith',
         startDate: '2025-01-01',
         endDate: '2026-01-01',
         premium: 320,
         status: 'active',
         createdAt: '2025-01-01T12:00:00Z',
      }
   ```

2. **PUT `/api/policies/:id`**
   - Updates an existing policy by ID.
   - Requires the authorization token (Need to generate with user/token api).
   - Return below response status code and message

      | Status code  | Message | Description |
      | ------------- | ------------- | ------------- |
      | 200   |  Updated Policy Object | provided as sample object below |
      | 404  | Policy not found!  | if policy not found for provided policy ID  |

   - Sample input policy object and one or more then one paramer which need to update
   ``` json
      {
      "productId": "ppp_001",
      "customerName": "p patel2",
      "startDate": "2025-06-06",
      "endDate": "2026-06-05",
      "premium": 12
      }
   ```
   - Sample return policy object
   ``` json
      {
         id: 'pol_001',
         productId: 'prod_motor',
         customerName: 'Alice Smith',
         startDate: '2025-01-01',
         endDate: '2026-01-01',
         premium: 320,
         status: 'active',
         createdAt: '2025-01-01T12:00:00Z',
      }
   ```
3. **DELETE `/api/policies/:id`**
   - Deletes a policy by ID.
   - Requires the authorization token (Need to generate with user/token api).
   - Return below response status code and message
      
      | Status code  | Message | Description |
      | ------------- | ------------- | ------------- |
      | 200   |  Policy deleted successfully |  |
      | 404  | Policy not found!  | if policy not found for provided policy ID  |

# User Endpoints to support to register new user and generate authorization token which need to pass with POST, PUT, DELETE policies end point.
1. **POST `/user/register`**
   - Creates a new user in momery to generate dynamic token.
   - Return below response status code and message

      | Status code  | Message | Description |
      | ------------- | ------------- | ------------- |
      | 201   |  User registered successfully | |
      | 400  | User already registered  |  |
      | 400  | User name is required  | if userName is missing or blank   |
      | 400  | Password is required  | if password is missing or blank   |

   - Sample return policy object
   ``` json
   {
      "userName": "Sammple User",
      "password": "SamplePassword"
   }
   ```

2. **GET `user/token`**
   - Retrieves a authorization token for give user details. This token need to copy and paste into authorization header for create, update and delete policy.
   - Return below response status code and message

      | Status code  | Message | Description |
      | ------------- | ------------- | ------------- |
      | 200   | token as object  |   |
      | 401  | Invalid credentials  | if provided password is not match with given user  |
      | 404  | User not found  | if given userName is not found  |
   - Sample input return policy object
   ``` json
   {
      "userName": "Sammple User",
      "password": "SamplePassword"
   }
   ```
   - Sample return token object
   ``` json
   {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMSIsInVzZXJuYW1lIjoidGFuYXkiLCJpYXQiOjE3NTE4NTA4MjIsImV4cCI6MTc1MTg1MTQyMn0.zqu_1Q7o6WSCrwkes6ReoF59MTeAS-jxTxhOPlPeDp0"
   }
   ```   

# Authentication
For authenticated endpoints, include the following header in your requests:
```
authorization : bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJfMSIsInVzZXJuYW1lIjoidGFuYXkiLCJpYXQiOjE3NTE3NzE2ODIsImV4cCI6MTc1MTc3MTgwMn0.OHM98ATUkh-LfJB-9MndygAxE7ceFANgS2Pw97XXR6g
```

# Testing
To run tests, use:
```
npm test
```

# Testing coverage report as per below
```
   PASS  tests/PolicyRoute.test.ts
   ● Console

      console.log
         Server running at http://localhost:3000

         at Server.<anonymous> (src/index.ts:24:11)

   PASS  tests/PolicyController.test.ts
   PASS  tests/UserController.test.ts
   PASS  tests/PolicyValidation.test.ts
   PASS  tests/UserValidation.test.ts
   ----------------------|---------|----------|---------|---------|-------------------
   File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
   ----------------------|---------|----------|---------|---------|-------------------
   All files             |   98.16 |       90 |     100 |   98.01 |                   
   controller           |   98.52 |    90.24 |     100 |   98.38 |                   
   PolicyController.ts |   97.43 |    85.71 |     100 |   97.14 | 39                
   UserController.ts   |     100 |      100 |     100 |     100 |                   
   routes               |     100 |      100 |     100 |     100 |                   
   PolicyRoute.ts      |     100 |      100 |     100 |     100 |                   
   UserRoute.ts        |     100 |      100 |     100 |     100 |                   
   validation           |   95.65 |    88.88 |     100 |   95.23 |                   
   PolicyValidation.ts |     100 |      100 |     100 |     100 |                   
   UserValidation.ts   |    87.5 |       50 |     100 |   85.71 | 16                
   ----------------------|---------|----------|---------|---------|-------------------

   Test Suites: 5 passed, 5 total
   Tests:       44 passed, 44 total
   Snapshots:   0 total
   Time:        5.446 s
   Ran all test suites.
```

# Architecture 
- This is build on ExpressJS + TypeScript REST API project.
- Implemented project are clean, modular, scalable and tastable architecture and easily extendable base on requirement.
- Request flow  
```
   client -> Route -> middleware - authenticate ( for secure end point ) -> middleware - validation  -> Controller -> Service (Which not include as static data) -> response
```
- Define all HTTP methods and end points in Route Layer.
- Middleware layer handle authentication and validation before sending request to actual controller to serve. Below two middleware layer are currently implemented. This layer can extend to hanlde other functionality like Logging, Error handling etc.

   1. authenticate which call UserController.authenticate()
   2. validateCreatePolicy which call PolicyValidation.validateCreatePolicy()
   
- Implemented common error as middleware in index.ts which throws 500 status code if internal server error throws by any end points.
```
   app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
   console.error(err.stack);
   res.status(500).send('Something went wrong. Please contact administrator.');
   });
```
- Implemented unit test and integration test (for each route) using jest and supertest framework. Also make sure as each module or layer are independently unit tested.
