const mongoose = require('mongoose');

const travellerSchema = new mongoose.Schema({
  firstName: String,
  lastName:  String,
  age:       Number,
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  packageId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  bookingRef:   { type: String, unique: true },
  customerName: { type: String, required: true },
  email:        { type: String, required: true },
  phone:        { type: String, required: true },
  travelDate:   { type: String, required: true },
  travellers:   [travellerSchema],
  selectedTier: { type: String },
  specialReqs:  { type: String },
  status:       { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'confirmed' },
}, { timestamps: true });

// Auto-generate booking reference before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingRef) {
    this.bookingRef = 'HB' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
