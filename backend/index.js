const express = require('express')
const env = require('dotenv')

env.config()

const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path=require('path')
const authRoutes = require('./routes/auth.route')
const doctorRoutes = require('./routes/doctor.route')
const appointmentRoutes = require('./routes/appointment.route')
const paymentRoutes = require('./routes/payment.route')   

const app = express()

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'https://happyhealthclinic.onrender.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
authRoutes(app);
doctorRoutes(app);
appointmentRoutes(app);
paymentRoutes(app);  

app.listen(process.env.PORT, async () => {
  (`Example app listening on port ${process.env.PORT}`)

  try {
        await mongoose.connect(process.env.DB_URL);
        console.log('successfully connected to mongo db')
    } catch (error) {
        console.log('not able to connect to mongodb',error)
    }
})