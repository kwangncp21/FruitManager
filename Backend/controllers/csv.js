const csv = require('csvtojson');
const fs = require('fs');
const Fruit = require('../models/Fruit');

exports.uploadFruitCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const jsonArray = await csv().fromFile(req.file.path);

    const fruits = jsonArray.map(item => ({
      name: item.name,
      amount: Number(item.amount),
      unit: Number(item.unit),
      total: Number(item.amount) * Number(item.unit),
    }));

    const result = await Fruit.insertMany(fruits);
    fs.unlinkSync(req.file.path);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getFruitData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const allowedFruits = [
      'Banana','Cherry','Apple','Orange','Watermelon',
      'Mango','Grapes','Strawberry','Peach','Pineapple'
    ];

    const fruits = await Fruit.find({ name: { $in: allowedFruits } })
      .skip(skip)
      .limit(limit);

    const total = await Fruit.countDocuments({ name: { $in: allowedFruits } });

    res.status(200).json({
      success: true,
      data: fruits,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch fruits' });
  }
};

exports.deleteAllFruits = async (req, res) => {
  try {
    await Fruit.deleteMany({});
    res.status(200).json({ success: true, message: 'All fruits deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete fruits' });
  }
};

exports.addRecord = async (req, res) => {
  try {
    const data = req.body; // ← array ของ object

    const fruits = data.map(item => ({
      name: item.name,
      amount: Number(item.amount),
      unit: Number(item.unit),
      total: Number(item.total)
    }));

    const result = await Fruit.insertMany(fruits);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.updateRecord = async (req, res) => {
 try {
    const { amount, unit } = req.body;
    req.body.total = Number(amount) * Number(unit);

    const fruit = await Fruit.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.status(200).json({ success: true, data: fruit });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.delRecord = async (req, res) => {
  try {
    await Fruit.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getRecord = async (req, res, next) => {
    try {
        const fruit = await Fruit.findById(req.params.id);
        if (!Fruit) {
            return res.status(404).json({
                success: false,
                msg: "Sorry, no available workspace!"
            });
        }
        res.status(200).json({
            success: true,
            data: fruit
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getAllRecord = async (req, res, next) => {
    try {
        const users = await Fruit.find({});  // Retrieve all users from the database

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve users'
        });
    }
};
