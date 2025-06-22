import express from 'express';
import multer from 'multer';
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
import { upload } from '../middlewares/upload.js';

const router = express.Router();
const jsonParser = express.json();
const load = multer({ dest: 'tmp/' });
router.get('/', ctrlWrapper(getContactsControllers));

router.get('/:contactId', isValidId, ctrlWrapper(getContactsByIdController));

router.post(
  '/',
  upload.single('photo'),
  jsonParser,
  validateBody(contactSchema),
  ctrlWrapper(createContactsController)
);

router.patch(
  '/:contactId',
  isValidId,
  load.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactsController)
);

router.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactsByIdController)
);
export default router;
