const mongoose = require('mongoose');

const tierSchema = new mongoose.Schema({
  label:      { type: String, required: true },
  price:      { type: Number, required: true },
  badgeClass: { type: String },
  checked:    { type: Boolean, default: false },
}, { _id: false });

const packageSchema = new mongoose.Schema({
  destination:     { type: String, required: true },
  type:            { type: String, enum: ['indian', 'international'], required: true },
  stars:           { type: Number, min: 1, max: 5 },
  withFlights:     { type: Boolean, default: true },
  airline:         { type: String },
  flightNo:        { type: String },
  depTime:         { type: String },
  arrTime:         { type: String },
  duration:        { type: String },
  overnight:       { type: Boolean, default: false },
  depCode:         { type: String },
  arrCode:         { type: String },
  stops:           { type: String },
  seatsLeft:       { type: String },
  tiers:           [tierSchema],
  price:           { type: Number },
  totalPrice:      { type: Number },
  roundTrip:       { type: Number },
  refundable:      { type: Boolean, default: true },
  handBaggage:     { type: String, default: '7 Kg' },
  checkInBaggage:  { type: Boolean, default: true },
  hasMeal:         { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
