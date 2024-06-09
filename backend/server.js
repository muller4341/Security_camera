import express from 'express';
import mongoose from 'mongoose';
import screenshotRouter from './routes/camera.js';
import cors from 'cors'; // Import the cors middleware
import bodyParser from 'body-parser'; 
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(new URL(import.meta.url));
const __dirname = dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json({ limit: '200mb' })); // Increase payload size limit
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true })); // Increase payload size limit
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Move this line to your main server file

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Serve uploaded videos statically
// app.use('/uploads/videos', express.static(path.join(__dirname, './uploads/videos')));

mongoose.connect('mongodb+srv://muller:1234@cluster0.ve461b6.mongodb.net/Security?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log("Database connected");
    app.use('/camera', screenshotRouter);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  })