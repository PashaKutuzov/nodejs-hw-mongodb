import express from 'express';
import {
  createContactsController,
  deleteContactsByIdController,
  getContactsByIdController,
  getContactsControllers,
  patchContactsController,
} from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();
const jsonParser = express.json();
router.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

router.get('/contacts', ctrlWrapper(getContactsControllers));

router.get('/contacts/:contactId', ctrlWrapper(getContactsByIdController));

router.post('/contacts', jsonParser, ctrlWrapper(createContactsController));
export default router;

router.patch(
  '/contacts/:contactId',
  jsonParser,
  ctrlWrapper(patchContactsController)
);

router.delete(
  '/contacts/:contactId',
  ctrlWrapper(deleteContactsByIdController)
);
