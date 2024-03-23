
import express from "express";

import Camera from "../models/camera.js";

const router = express.Router()



// POST footer form
router.post('/', async(req, res) => {
 
  upload(req, res, async (err) => {
    if (err) {
      // Handle upload error
      res.status(500).json({ error: 'An error occurred while uploading' });
    } else{
       const { videoBlob, screenshotDataUrl,  } = req.body; 
      
      const serverUrl = 'http://localhost:3000'; // Replace this with your server URL
      
      try {
          const newCamera =  new Camera({
            videoBlob,
            screenshotDataUrl,
            createdAt: new Date(), 
      });
       const savedCamera = await newCamera.save();
        res.json({savedCamera});
        
      } catch (error) {
       
        console.error('An error occurred while saving to the database:', error);         
        res.status(500).json({ error: 'An error occurred while saving to the database' });
      }
    }});
  });


  
  


  

export  default router;