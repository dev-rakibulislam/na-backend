import { Router } from "express";
import { authenticationController } from "./authentication.controller";

const router = Router();

router.post("/", authenticationController.createUserController);

export const authenticationRouter = router;
