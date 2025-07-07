import express from 'express';
import { policyController } from '../controller/PolicyController';
import { userController } from '../controller/UserController';
import { validateCreatePolicy } from '../validation/PolicyValidation';

const router = express.Router();

router.get('/:id', policyController.getPolicyById);
router.get('/', policyController.getPoliciesByCustomerName);

router.post('/', userController.authenticate, validateCreatePolicy, policyController.createPolicy);

router.put('/:id', userController.authenticate, policyController.updatePolicy);
router.delete('/:id',  userController.authenticate, policyController.deletePolicy);

export default router;