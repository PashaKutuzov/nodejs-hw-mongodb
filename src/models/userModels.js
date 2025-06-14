import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.methods.toJSON = function () {
  const object = this.toObject();
  delete object.password;
  return object;
};

export const userModel = mongoose.model('User', userSchema);
