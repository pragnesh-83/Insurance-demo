import express from 'express';
import { userController } from '../controller/UserController';
import { validateUser } from '../validation/UserValidation';

const router = express.Router();

/**
 * @swagger
 * tags:
 *      name: User
 *      description: User registration and token generation
 * 
 */

router.get('/token', validateUser, userController.getToken);
/**
 * @swagger
 * /register:
 *  post:
 *      summary: Register new uses
 *      responses:
 *          201:
 *              description: User registered successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              userName:
 *                                  type: string
 *                                  example: user1
 *                              password:
 *                                  type: string
 *                                  example: pass1234
 *  
 */
router.post('/register', validateUser, userController.postRegister);

export default router;