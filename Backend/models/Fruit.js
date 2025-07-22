const mongoose = require('mongoose');

const FruitSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true
  // },
  // amount: {
  //   type: Number,
  //   required: true
  // },
  // unit: {
  //   type: Number,
  //   required: true
  // },
  // total: {
  //   type: Number,
  //   required: true
  // }
  Date: {
    type: Date,
    required: false  // เปลี่ยนเป็น true ถ้าต้องการบังคับ
  },
  ProductName: {
    type: String,
    required: true
  },
  Color: {
    type: String,
    required: false
  },
  Amount: {
    type: Number,
    required: true
  },
  Unit: {
    type: Number,
    required: true
  },
  Total: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Fruit', FruitSchema);
