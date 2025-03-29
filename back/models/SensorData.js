const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema({
    value: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SensorData", SensorDataSchema);
