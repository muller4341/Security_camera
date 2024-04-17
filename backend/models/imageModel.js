import mongoose from 'mongoose';
//import AutoIncrementFactory from 'mongoose-sequence';

//const AutoIncrement = AutoIncrementFactory(mongoose);

const imageSchema = new mongoose.Schema({
  id:{
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
},
{
  timestamps: true
});

//imageSchema.plugin(AutoIncrement, {inc_field: 'id'});

export const ImageModel = mongoose.model('Image', imageSchema);