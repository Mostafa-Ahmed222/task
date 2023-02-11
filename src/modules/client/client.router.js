import { Router } from "express";
import { auth } from "../../middleware/Auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import validation from './../../middleware/Validation.js';
import * as validators from './client.validation.js';
import * as clientController from './controller/client.js';
import { caching } from './../../middleware/Caching.js';

const router = Router()
// add clients
router.post("/", myMulter(fileValidation.excel).single("excel"), validation(validators.addClients), auth(), clientController.addClients)

// get all clients
router.get('/', validation(validators.getAllClients), auth(), caching("clients"), clientController.getAllClients)

//search for clients
router.get('/search', validation(validators.searchClients), auth(), clientController.searchClients)

// update client
router.put('/:id', validation(validators.updateClientById), auth(), clientController.updateClientById)

// delete client
router.delete('/:id', validation(validators.deleteClientById), auth(), clientController.deleteClientById)

export default router