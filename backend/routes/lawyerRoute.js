import express from "express";
import { appointmentCancel, appointmentComplete, appointmentsLawyer, lawyerDashboard, lawyerList, loginLawyer } from "../controllers/lawyerController.js";
import authLawyer from "../middlewares/authLawyer.js";

const lawyerRouter = express.Router();

lawyerRouter.get('/list', lawyerList);
lawyerRouter.post('/login', loginLawyer);
lawyerRouter.get('/appointments', authLawyer, appointmentsLawyer);
lawyerRouter.post('/complete-appointment', authLawyer, appointmentComplete);
lawyerRouter.post('/cancel-appointment', authLawyer, appointmentCancel);
lawyerRouter.get('/dashboard', authLawyer, lawyerDashboard);

export default lawyerRouter;
