const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Load env vars
dotenv.config({path:'./config/config.env'});

connectDB();

const app = express();

// const reservationController = require('./controllers/reservation');
// reservationController.scheduleReservationCancellations();

// app.use(cors({
//   origin: 'http://localhost:5500', // เปลี่ยนตาม frontend ที่ใช้
//   credentials: true
// }));
app.use(cors({
  origin: 'http://localhost:3001', // เปลี่ยนตาม frontend ที่ใช้
  credentials: true
}));

//Body parser
app.use(express.json());

app.use(cookieParser());

const auth = require('./routes/auth');
// const workSpace = require('./routes/workSpace');
// const reservations = require('./routes/reservation');

//Routing
app.use(`/api/v1/auth`,auth);
// app.use(`/api/v1/workspace`,workSpace);
// app.use(`/api/v1/reservation`,reservations);


const PORT=process.env.PORT || 3000;
app.listen(PORT, console.log('server running in',process.env.NODE_ENV,'mode on port',PORT));