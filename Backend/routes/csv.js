const express = require('express');
const multer = require('multer');
const csv = require('csvtojson');
// const upload = multer({ dest: 'uploads/' });
const router= express.Router();

const {uploadFruitCSV,getFruitData,deleteAllFruits} = require('../controllers/csv');
// const {getFruitData} = require('../controllers/csv');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadFruitCSV);
router.get('/', getFruitData);
router.delete('/all', deleteAllFruits);

module.exports = router;
