import { Schema, model } from 'mongoose';

const UserModel = new Schema({
  name: {
    type: String,
  },
});

const user = model('user', UserModel);
export default user;

