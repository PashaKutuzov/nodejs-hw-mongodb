import * as fs from 'node:fs/promises';
import path from 'node:path';
import createHttpError from 'http-errors';
import multer from 'multer';
import {
  getContacts,
  getContactsById,
  deleteContactsById,
  createContacts,
  patchContacts,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

async function getContactsControllers(req, res) {
  console.log(req.user);

  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;
  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

async function getContactsByIdController(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactsById(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Not found');
  }

  if (contact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError.Forbidden('Access denied for contact');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}
async function createContactsController(req, res) {
  let photo = null;

  if (req.file) {
    if (process.env.UPLOAD_TO_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      const targetDir = path.resolve('src', 'uploads', 'photos');
      const targetPath = path.join(targetDir, req.file.filename);
      await fs.rename(req.file.path, targetPath);
      photo = `http://localhost:3000/photos/${req.file.filename}`;
    }
  }

  const contactData = {
    ...req.body,
    userId: req.user._id,
    photo,
  };

  const contact = await createContacts(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

async function patchContactsController(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;
  const result = await patchContacts(contactId, req.body, userId);
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
  const userId = req.user._id;
  const result = await deleteContactsById(contactId, userId);
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
