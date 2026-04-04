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
// Using async pre-save (Mongoose v7+ compatible — no next() callback)
bookingSchema.pre('save', async function () {
  if (!this.bookingRef) {
    const rand = () => Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingRef = 'VC-' + rand() + rand().slice(0, 2); // e.g. VC-AB3CD7
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
