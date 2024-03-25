
// models/Image.js
import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

const conn = mongoose.connection;
Grid.mongo = mongoose.mongo;
let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db);
});

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

imageSchema.statics.upload = function (file, cb) {
  const writestream = gfs.createWriteStream({
    filename: file.originalname,
    mode: 'w',
    content_type: file.mimetype,
  });
  writestream.on('close', (uploadedFile) => {
    this.create({ filename: uploadedFile.filename }, cb);
  });
  writestream.write(file.buffer);
  writestream.end();
};

const Image = mongoose.model('Image', imageSchema);

export default Image;