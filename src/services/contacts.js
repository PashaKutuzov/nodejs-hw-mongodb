import { contactModel } from '../models/models.js';

export async function getContacts({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = contactModel.find();
  if (filter.type) {
    contactQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const [totalItems, data] = await Promise.all([
    contactModel.countDocuments(contactQuery.getQuery()),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
    filter,
  };
}
export function getContactsById(contactId) {
  return contactModel.findById(contactId);
}
export function deleteContactsById(contactId) {
  return contactModel.findByIdAndDelete(contactId);
}
export function createContacts(payload) {
  return contactModel.create(payload);
}

export function patchContacts(contactId, payload) {
  return contactModel.findByIdAndUpdate(contactId, payload, { new: true });
}
