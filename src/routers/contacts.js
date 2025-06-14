import express from 'express';
import {
  createContactsController,
  deleteContactsByIdController,
  getContactsByIdController,
  getContactsControllers,
  patchContactsController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema, updateContactSchema } from '../validation/contact.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsControllers));

router.get('/:contactId', isValidId, ctrlWrapper(getContactsByIdController));

router.post(
  '/',
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(createContactsController)
);

router.patch(
  '/:contactId',
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactsController)
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactsByIdController)
);
export default router;
