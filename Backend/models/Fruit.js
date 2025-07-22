const mongoose = require('mongoose');

const FruitSchema = new mongoose.Schema({

  date: {
    type: Date,
    required: false
  },
  productName: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: false
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: Number,
    required: true
  }
  // total: {
  //   type: Number,
  //   required: true
  // }
});

module.exports = mongoose.model('Fruit', FruitSchema);
