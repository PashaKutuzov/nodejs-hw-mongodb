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
router.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

router.get('/contacts', ctrlWrapper(getContactsControllers));

router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactsByIdController)
);

router.post(
  '/contacts',
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(createContactsController)
);
export default router;

router.patch(
  '/contacts/:contactId',
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactsController)
);

router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactsByIdController)
);
