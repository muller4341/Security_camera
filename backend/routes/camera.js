import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import screenshotController from '../controllers/camera.js';
import { MongoClient } from 'mongodb';

const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
MongoClient.connect('mongodb+srv://muller:1234@cluster0.ve461b6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', (err, client) => {
    if (err) return console.log(err);
  let db = client.db('Security');
  router.post('/upload', upload.single('screenshot'), (req, res) => {
    let img = req.file.buffer;
    let encode_image = img.toString('base64');
    let finalImg = {
        contentType: req.file.mimetype,
        image:  new Buffer.from(encode_image, 'base64')
    };
    db.collection('images').insertOne(finalImg, (err, result) => {
      console.log(result)
  
      if (err) return console.log(err)
    });
  });
    }
);6


export default router;