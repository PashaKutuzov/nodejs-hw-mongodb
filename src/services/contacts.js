import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    isFavourite: {
        type: Boolean,
        required: false,
        default: false,
    },
    contactType: {
        type: String,
        enum: ['work', 'home', 'personal'],
        required: false,
        default: 'personal'   
    },
   
},
    {
        timestamps: true
    }

);

export const contactModel = mongoose.model('Contact', contactSchema);