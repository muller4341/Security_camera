import express from "express";
import Camera from "../models/camera.js";

const router = express.Router();

// POST route for storing screenshot images and video
router.post("/", async (req, res) => {
  try {
    const { videoBlob, screenshotDataUrl } = req.body;

    // Ensure both videoBlob and screenshotDataUrl are present
    if (!videoBlob || !screenshotDataUrl) {
      return res.status(400).json({ error: "Missing required data" });
    }

    const newCamera = new Camera({
      videoBlob,
      screenshotDataUrl,
      createdAt: new Date(),
    });

    const savedCamera = await newCamera.save();
    res.json({ savedCamera });
  } catch (error) {
    console.error("An error occurred while saving to the database:", error);
    res.status(500).json({ error: "An error occurred while saving to the database" });
  }
});

export default router;