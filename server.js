const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://3.95.253.128/sensor_data', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

// Create a mongoose model for sensor data
const SensorData = mongoose.model('SensorData', {
  value: Number,
  timestamp: { type: Date, default: Date.now },
});

app.use(bodyParser.json());

// Endpoint to receive sensor data
app.post('/sensor', async (req, res) => {
  try {
    const { value } = req.body;
    const sensorData = new SensorData({ value });
    await sensorData.save();
    res.status(201).json(sensorData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
