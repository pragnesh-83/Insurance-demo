import { NextFunction, Request, Response } from "express";
import { Policy } from '../models/Policy';
import { Product } from '../models/Product';
import policiesData from '../data/policies.json'
import productsData from "../data/products.json";

let policies: Policy[] = policiesData as Policy[];
let products: Product[] = productsData as Product[];

export const policyController = {

    getPolicyById: (req: Request, res: Response) => {
       
        const policy = policies.find((t) => t.id === req.params.id);

        if (policy) {
          const product = products.find((prod) => prod.id === policy.productId);
          res.status(200).json({ ...policy, product });
        } else {
          res.status(404).json({ message: "Policy not found!" });
        }
    },

  getPoliciesByCustomerName: (req: Request, res: Response) => {
    const { customerName } = req.query;
    
    if (typeof customerName === 'string') {
      const filteredPolicies = policies.filter(
        (p) => p.customerName === customerName
      );

      if(!Array.isArray(filteredPolicies) || filteredPolicies.length == 0 ){
        res.status(404).json({ message: "Policy not found!" });
      } else {
        res.status(200).json(filteredPolicies);
      }
    } else {
      res.status(400).json({ message: "Invalid request parameter!" });
    }
  },

  createPolicy: (req: Request , res: Response) => {
    const { customerName, productId, premium, startDate, endDate } = req.body;
   
    const policy: Policy = {
      id: `pol_${policies.length + 1}`,
      customerName,
      productId,
      premium,
      startDate: startDate || new Date().toISOString(),
      endDate: endDate || new Date().toISOString(),
      status: "active",
      createdAt: new Date().toISOString(),
    };

    policies.push(policy);
    res.status(201).json(policy);
  },

  updatePolicy: (req: Request, res: Response) => {

    const { id } = req.params;
    const { customerName, productId, premium, startDate, endDate, status } =
      req.body;

    const policyIndex = policies.findIndex((p) => p.id === req.params.id);

    if (policyIndex !== -1) {
      policies[policyIndex] = {
        ...policies[policyIndex],
        customerName: customerName || policies[policyIndex].customerName,
        productId: productId || policies[policyIndex].productId,
        premium: premium || policies[policyIndex].premium,
        startDate: startDate || policies[policyIndex].startDate,
        endDate: endDate || policies[policyIndex].endDate,
        status: status || policies[policyIndex].status,
      };
      res.status(200).json(policies[policyIndex]);
    } else {
      res.status(404).json({ message: "Policy not found!" });
    }
  },

  deletePolicy: (req: Request, res: Response) => {
    const { id } = req.params;
    const policyIndex = policies.findIndex((p) => p.id === req.params.id);

    if (policyIndex !== -1) {
      policies.splice(policyIndex, 1);
      res.status(200).json({ message: "Policy deleted successfully" });
    } else {
      res.status(404).json({ message: "Policy not found!" });
    }
  }
};
