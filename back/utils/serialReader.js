// const SerialPort = require("serialport");
// const Readline = require("@serialport/parser-readline");
// const SensorData = require("../models/SensorData");

// // Replace "COM3" with your Arduino's port (Check in Arduino IDE -> Tools -> Port)
// const port = new SerialPort("COM3", { baudRate: 9600 });

// const parser = port.pipe(new Readline({ delimiter: "\r\n" }));

// parser.on("data", async (data) => {
//     console.log(`📡 Received from Arduino: ${data}`);

//     const sensorValue = parseInt(data, 10);
//     if (!isNaN(sensorValue)) {
//         const newEntry = new SensorData({ value: sensorValue });
//         await newEntry.save();
//         console.log(`✅ Saved to MongoDB: ${sensorValue}`);
//     }
// });

// port.on("error", (err) => console.error("❌ Serial Port Error:", err));
