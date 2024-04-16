import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: String,
  // add any other fields you need
});

export const ImageModel = mongoose.model('Image', imageSchema);