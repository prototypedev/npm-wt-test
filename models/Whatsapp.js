const mongoose = require("mongoose");

const WhatsappSchema = new mongoose.Schema({
  imei: {
    type: String,
    required: true,
  },
  uid: String,
  title: String,
  message: String,
  type: String,
  triggerName: {
    type: String,
    required: true,
  },
  recordDate: {
    type: Date,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Whatsapp = mongoose.model("whatsapp", WhatsappSchema);
