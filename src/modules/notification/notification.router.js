import { Router } from "express";
import { auth } from "../../middleware/Auth.js";
import validation from '../../middleware/Validation.js';
import * as validators from './notification.validation.js';
import * as scheduleController from './controller/notification.js';

const router = Router()

// add offer or notification
router.post("/", validation(validators.addNotification), auth(), scheduleController.addNotification)

// get all notification
router.get('/', validation(validators.getAllNotification), auth(),  scheduleController.getAllNotification)

// update notification data by ID
router.patch('/:id', validation(validators.updateNotificationById), auth(), scheduleController.updateNotificationById)

// delete notification By ID
router.delete('/:id', validation(validators.deleteNotificationById), auth(), scheduleController.deleteNotificationById)







export default router