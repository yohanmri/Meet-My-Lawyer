import express from "express";
import { lawyerList } from "../controllers/lawyerController.js";

const lawyerRouter = express.Router();

lawyerRouter.get("/list", lawyerList);

export default lawyerRouter;
