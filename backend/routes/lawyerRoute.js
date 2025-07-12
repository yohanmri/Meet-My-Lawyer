import express from "express";
import { appointmentsLawyer, lawyerList, loginLawyer } from "../controllers/lawyerController.js";
import authLawyer from "../middlewares/authLawyer.js";

const lawyerRouter = express.Router();

lawyerRouter.get('/list', lawyerList);
lawyerRouter.post('/login', loginLawyer);
lawyerRouter.get('/appointments', authLawyer, appointmentsLawyer)

export default lawyerRouter;
