const express = require('express');
const multer = require('multer');
const csv = require('csvtojson');
const router= express.Router();

const {uploadFruitCSV,getFruitData,deleteAllFruits,addRecord,updateRecord,delRecord,getRecord,getAllRecord} = require('../controllers/csv');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadFruitCSV);
router.get('/', getFruitData);
router.delete('/delAll', deleteAllFruits);
router.post('/addRecord', addRecord);
router.put('/updateRecord/:id', updateRecord);
router.delete('/delRecord/:id', delRecord);
router.get('/getRecord/:id', getRecord);
router.get('/getAllRecord', getAllRecord);

module.exports = router;