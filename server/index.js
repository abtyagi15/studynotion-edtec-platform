const express = require('express');
const app = express();

const userRoutes = require('./routes/User');
const profileRoutes = require('./routes/Profile');
const courseRoutes = require('./routes/Course');
const paymentRoutes = require('./routes/Payment');

const database = require("./config/database");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');