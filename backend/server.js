
import express from 'express'
import mongoose from 'mongoose'
import screenshotRouter from './routes/camera.js'
const app = express();
// Connect to MongoDB
mongoose.connect('mongodb+srv://muller:1234@cluster0.ve461b6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

);

app.use('/camera', screenshotRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

