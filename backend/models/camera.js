import express from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import screenshotController from '../controllers/camera.js';

const router = express.Router();
const storage = new GridFsStorage({
  url: 'mongodb+srv://muller:1234@cluster0.ve461b6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
          
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });

router.post('/upload', upload.single('screenshot'), screenshotController.uploadScreenshot);

export default router;
