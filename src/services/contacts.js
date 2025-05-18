import { contactModel } from '../models/models.js';

export function getContacts() {
  return contactModel.find();
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
