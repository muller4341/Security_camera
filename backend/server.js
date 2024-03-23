import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import dotenv from 'dotenv';


dotenv.config();

//routes imports 
import camera from './routes/camera.js'


const app = express();
const CONNECTION_URL = process.env.CONNECTION_URL
 const PORT = process.env.PORT;


app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST',"PUT"],
  credentials: true
}));


app.get('/',(req,res) => {
    console.log(req)
    return res.status(200).send('well')
});
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