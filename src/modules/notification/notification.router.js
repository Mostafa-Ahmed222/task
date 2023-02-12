import { Router } from "express";
import { auth } from "../../middleware/Auth.js";
import validation from '../../middleware/Validation.js';
import * as validators from './notification.validation.js';
import * as scheduleController from './controller/notification.js';
import caching from "../../middleware/Caching.js";

const router = Router()

// add offer or notification
router.post("/", validation(validators.addNotification), auth(), scheduleController.addNotification)

// get all notification
router.get('/', validation(validators.getAllNotification), auth(), caching("notifications"),  scheduleController.getAllNotification)

// update notification data by ID
router.patch('/:id', validation(validators.updateNotificationById), auth(), scheduleController.updateNotificationById)

// delete notification By ID
router.delete('/:id', validation(validators.deleteNotificationById), auth(), scheduleController.deleteNotificationById)







export default router