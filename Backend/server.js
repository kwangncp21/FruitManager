const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//Load env vars
dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // frontend port
  credentials: true
}));

//Body parser
app.use(express.json());

app.use(cookieParser());

const auth = require('./routes/auth');
const csvRoute = require('./routes/csv');

//Routing
app.use('/api/v1/auth',auth);
app.use('/api/v1/csv', csvRoute);



const PORT=process.env.PORT || 3000;
app.listen(PORT, console.log('server running in',process.env.NODE_ENV,'mode on port',PORT));