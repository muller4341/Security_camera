import express from 'express';
import multer from 'multer'; // for handling multipart/form-data, which is used for file upload
import fs from 'fs'; // for file system operations
import path from 'path'; // for handling file paths
import { ImageModel } from '../models/imageModel.js'; // assuming you have an ImageModel for mongoose

const router = express.Router();

// Set up multer for storing uploaded files to disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname) +'.png'); // Append extension
  },
});
const upload = multer({ storage });
router.post('/upload', upload.single('screenshot'), async (req, res) => {
  console.log("cameraName", req.body.cameraName);
    let lastProduct = await ImageModel.findOne({}).sort('-id');
        let id;
        if (lastProduct) {
            id = lastProduct.id + 1;
        } else {
            id = 1;
        }
  try {
    const filePath = 'http://localhost:3000/uploads/' + req.file.filename;
    const newImage = new ImageModel({
      url: filePath,
      id: id,
      cameraName: req.body.cameraName,
      // add any other fields you need
    });
    const savedImage = await newImage.save();
    console.log(savedImage)

    res.json({ url: filePath });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading image' });
  }
});

//creating API for getting all products
router.get('/allImages', async (req, res) => {
  let images= await ImageModel.find({});
  console.log('all images are fetched');
  res.json( images);
}
);

export default router;