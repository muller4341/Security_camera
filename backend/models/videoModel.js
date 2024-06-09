import mongoose from 'mongoose';
//import AutoIncrementFactory from 'mongoose-sequence';

//const AutoIncrement = AutoIncrementFactory(mongoose);

const videoSchema = new mongoose.Schema({
  id:{
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  cameraName: { 
    type: String,
    required: true,
  }
},

{
  timestamps: true
});

//imageSchema.plugin(AutoIncrement, {inc_field: 'id'});

export const VideoModel = mongoose.model('Video', videoSchema);