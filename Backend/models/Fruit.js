const mongoose = require('mongoose');

const FruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

// FruitSchema.virtual('total').get(function () {
//   return this.amount * this.unit;
// });

// FruitSchema.set('toJSON', { virtuals: true }); // สำคัญ!


module.exports = mongoose.model('Fruit', FruitSchema);
