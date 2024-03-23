import express from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv';


import path from 'path';
dotenv.config();

//routes imports 
import camera from './routes/camera.js'


const app = express();
const CONNECTION_URL = process.env.CONNECTION_URL
 const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST',"PUT"],
  credentials: true
}));
app.use(express.static(path.join('./', 'public')));


// db connection
async function main() {
  try {
    await mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}
main()
//mongoose.set('useFindAndModify', false)
   
// routes

app.use('/camera', camera);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});