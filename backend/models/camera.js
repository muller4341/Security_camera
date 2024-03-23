import mongoose from 'mongoose';

const cameraSchema = new mongoose.Schema({
  videoBlob: { type: Buffer },
  screenshotDataUrl: { type: Buffer },
  createdAt: { type: Date, default: Date.now },
});

const Camera = mongoose.model('Camera', cameraSchema);

export default Camera;