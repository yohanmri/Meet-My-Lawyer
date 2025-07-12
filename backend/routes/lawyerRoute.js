import express from "express";
import { lawyerList, loginLawyer } from "../controllers/lawyerController.js";

const lawyerRouter = express.Router();

lawyerRouter.get('/list', lawyerList);
lawyerRouter.post('/login', loginLawyer)

export default lawyerRouter;
