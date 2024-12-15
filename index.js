const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const voterRoutes = require('./routes/voterRoutes');
const officerRoutes = require('./routes/officerRoutes');
const resultRoutes = require('./routes/resultRoutes');
const { setupWebSocketServer } = require('./utils/ws');
const path = require("path");
const http = require('http');
require('dotenv').config();

const app = express();
app.use(express.static(path.join(__dirname, "dist")));
app.use(cors({
    origin: process.env.CLIENT_URI || "http://localhost:5174"
  }));

app.use(express.json());
app.use('/api/voter', voterRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/results', resultRoutes);

const start = async () => {
  try {
    console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL);
    console.log('connected to database');
    
    const server = http.createServer(app); 
    setupWebSocketServer(server);        

    server.listen(process.env.PORT, () => {
      console.log(Server is running on port: ${process.env.PORT});
    });
  } catch (err) {
    throw err;
  }
};

start();
