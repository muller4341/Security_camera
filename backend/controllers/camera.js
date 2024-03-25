
import Image from '../models/camera.js';

export const uploadImage = (req, res) => {
  Image.upload(req.file, (err, image) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(image);
  });
};