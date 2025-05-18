import createHttpError from 'http-errors';
import {
  getContacts,
  getContactsById,
  deleteContactsById,
  createContacts,
  patchContacts,
} from '../services/contacts.js';

async function getContactsControllers(req, res) {
  const contacts = await getContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

async function getContactsByIdController(req, res) {
  const { contactId } = req.params;
  const contact = await getContactsById(contactId);
  const allContacts = await getContacts();
  console.log('All contacts in DB:', allContacts);

  if (!contact) {
    throw createHttpError(404, 'Not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}
async function createContactsController(req, res) {
  const contact = await createContacts(req.body);
  console.log(contact);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

async function patchContactsController(req, res) {
  const { contactId } = req.params;
  const result = await patchContacts(contactId, req.body);
  console.log(result);
  if (result === null) {
    throw createHttpError(404, 'Not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
}

async function deleteContactsByIdController(req, res) {
  const { contactId } = req.params;
  const result = await deleteContactsById(contactId);
  console.log(result);
  if (result === null) {
    throw createHttpError(404, 'Not found');
  }
  res.status(204).end();
}

export {
  getContactsByIdController,
  getContactsControllers,
  deleteContactsByIdController,
  createContactsController,
  patchContactsController,
};
