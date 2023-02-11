import { Router } from "express";
import validation from '../../middleware/Validation.js';
import * as validators from './auth.validation.js';
import * as registerController from './controller/registration.js';

const router = Router()
// signup
router.post("/signup", validation(validators.signup), registerController.signup)
// reconfirm Email
router.get("/requestEmailToken/:token", validation(validators.reConfirmEmail), registerController.reConfirmEmail)
// confirm Email
router.get("/confirmEmail/:token", validation(validators.confirmEmail), registerController.confirmEmail)
// signin
router.post("/signin", validation(validators.signin), registerController.signin)

export default router