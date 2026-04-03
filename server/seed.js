/**
 * seed.js — Populates MongoDB with the 10 holiday packages from the original packages.js
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Package  = require('./models/Package');

const packages = [
  // ── Air India Express ──
  {
    type: 'indian', withFlights: true, destination: 'Goa', stars: 3,
    airline: 'Air India Express', flightNo: 'IX 2879 TC',
    depTime: '12:05', arrTime: '13:30', duration: '01h 25m', overnight: false,
    depCode: 'HYD', arrCode: 'GOI', stops: 'Nearby Airport', seatsLeft: '9 seat(s) left',
    tiers: [
      { label: 'Publish',   price: 13300, badgeClass: 'pc-tier-label--publish',  checked: true  },
      { label: 'Flex',      price: 13300, badgeClass: 'pc-tier-label--flex',     checked: false },
      { label: 'XpressBiz', price: 29144, badgeClass: 'pc-tier-label--xpress',  checked: false },
    ],
    price: 13300, totalPrice: 105300, roundTrip: 210600,
    refundable: true, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: false,
  },
  {
    type: 'indian', withFlights: true, destination: 'Goa', stars: 3,
    airline: 'Air India Express', flightNo: 'IX 2879 TC',
    depTime: '12:05', arrTime: '13:30', duration: '01h 25m', overnight: false,
    depCode: 'HYD', arrCode: 'GOI', stops: 'Nearby Airport', seatsLeft: '9 seat(s) left',
    tiers: [
      { label: 'Publish',   price: 13300, badgeClass: 'pc-tier-label--publish',  checked: true  },
      { label: 'Flex',      price: 13300, badgeClass: 'pc-tier-label--flex',     checked: false },
      { label: 'XpressBiz', price: 29144, badgeClass: 'pc-tier-label--xpress',  checked: false },
    ],
    price: 13300, totalPrice: 105300, roundTrip: 210600,
    refundable: true, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: false,
  },
  // ── Air India ──
  {
    type: 'indian', withFlights: true, destination: 'Goa', stars: 4,
    airline: 'Air India', flightNo: 'IX 2879 TC',
    depTime: '11:30', arrTime: '18:55', duration: '04h 30m', overnight: false,
    depCode: 'HYD', arrCode: 'GOX', stops: '1 Stop(s) via BOM - 4 seat(s) left', seatsLeft: null,
    tiers: [
      { label: 'SME',     price: 13300,  badgeClass: 'pc-tier-label--sme',     checked: true  },
      { label: 'Publish', price: 105300, badgeClass: 'pc-tier-label--publish', checked: false },
    ],
    price: 13300, totalPrice: 105300, roundTrip: 210600,
    refundable: true, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: true,
  },
  {
    type: 'indian', withFlights: true, destination: 'Goa', stars: 4,
    airline: 'Air India', flightNo: 'IX 2879 TC',
    depTime: '13:15', arrTime: '06:15', duration: '04h 30m', overnight: true,
    depCode: 'HYD', arrCode: 'GOX', stops: '2 Stop(s) via BOM - 6 seat(s) left', seatsLeft: null,
    tiers: [
      { label: 'SME',     price: 13300,  badgeClass: 'pc-tier-label--sme',     checked: true  },
      { label: 'Publish', price: 105300, badgeClass: 'pc-tier-label--publish', checked: false },
    ],
    price: 13300, totalPrice: 105300, roundTrip: 210600,
    refundable: true, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: true,
  },
  // ── Indigo ──
  {
    type: 'indian', withFlights: true, destination: 'Goa', stars: 3,
    airline: 'Indigo', flightNo: '6E 426 SM | 6E 6944 SM',
    depTime: '20:50', arrTime: '06:20', duration: '09h 30m', overnight: true,
    depCode: 'HYD', arrCode: 'GOI', stops: '1 Stop(s) via PNQ - 9 seat(s) left', seatsLeft: null,
    tiers: [
      { label: 'SME',     price: 13300, badgeClass: 'pc-tier-label--sme',     checked: true  },
      { label: 'Publish', price: 13300, badgeClass: 'pc-tier-label--publish', checked: false },
    ],
    price: 13300, totalPrice: 125000, roundTrip: 248000,
    refundable: true, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: false,
  },
  {
    type: 'indian', withFlights: true, destination: 'Goa', stars: 3,
    airline: 'Indigo', flightNo: '6E 426 SM | 6E 6944 SM',
    depTime: '20:50', arrTime: '06:20', duration: '09h 30m', overnight: true,
    depCode: 'HYD', arrCode: 'GOI', stops: '1 Stop(s) via PNQ - 9 seat(s) left', seatsLeft: null,
    tiers: [
      { label: 'SME',     price: 13300, badgeClass: 'pc-tier-label--sme',     checked: true  },
      { label: 'Publish', price: 13300, badgeClass: 'pc-tier-label--publish', checked: false },
    ],
    price: 13300, totalPrice: 125000, roundTrip: 248000,
    refundable: true, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: false,
  },
  // ── Star Air ──
  {
    type: 'indian', withFlights: true, destination: 'Kerala', stars: 4,
    airline: 'Star Air', flightNo: 'SS 212 TQ2 | SS 210 TQ2',
    depTime: '09:50', arrTime: '17:55', duration: '08h 25m', overnight: false,
    depCode: 'HYD', arrCode: 'GOX', stops: '1 Stop(s) via ROY - 5 seat(s) left', seatsLeft: null,
    tiers: [
      { label: 'Regular', price: 13300, badgeClass: 'pc-tier-label--regular', checked: true  },
      { label: 'Flex',    price: 13300, badgeClass: 'pc-tier-label--flex',    checked: false },
      { label: 'Comfort', price: 13300, badgeClass: 'pc-tier-label--comfort', checked: false },
    ],
    price: 13300, totalPrice: 98000, roundTrip: 194000,
    refundable: false, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: false,
  },
  {
    type: 'indian', withFlights: true, destination: 'Kerala', stars: 4,
    airline: 'Star Air', flightNo: 'SS 212 TQ2 | SS 210 TQ2',
    depTime: '09:50', arrTime: '17:55', duration: '08h 25m', overnight: false,
    depCode: 'HYD', arrCode: 'GOX', stops: '1 Stop(s) via ROY - 5 seat(s) left', seatsLeft: null,
    tiers: [
      { label: 'Regular', price: 13300, badgeClass: 'pc-tier-label--regular', checked: true  },
      { label: 'Flex',    price: 13300, badgeClass: 'pc-tier-label--flex',    checked: false },
      { label: 'Comfort', price: 13300, badgeClass: 'pc-tier-label--comfort', checked: false },
    ],
    price: 13300, totalPrice: 98000, roundTrip: 194000,
    refundable: false, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: false,
  },
  // ── International ──
  {
    type: 'international', withFlights: true, destination: 'Dubai', stars: 5,
    airline: 'Air India Express', flightNo: 'IX 524 TC',
    depTime: '23:40', arrTime: '01:20', duration: '03h 40m', overnight: true,
    depCode: 'HYD', arrCode: 'DXB', stops: 'Nearby Airport', seatsLeft: '4 seat(s) left',
    tiers: [
      { label: 'Publish',   price: 28500, badgeClass: 'pc-tier-label--publish',  checked: true  },
      { label: 'Flex',      price: 28500, badgeClass: 'pc-tier-label--flex',     checked: false },
      { label: 'XpressBiz', price: 62415, badgeClass: 'pc-tier-label--xpress',  checked: false },
    ],
    price: 28500, totalPrice: 185000, roundTrip: 368000,
    refundable: true, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: true,
  },
  {
    type: 'international', withFlights: true, destination: 'Bangkok', stars: 4,
    airline: 'Air India', flightNo: 'AI 317 TC',
    depTime: '08:15', arrTime: '14:30', duration: '04h 15m', overnight: false,
    depCode: 'HYD', arrCode: 'BKK', stops: '1 Stop(s) via DEL - 6 seat(s) left', seatsLeft: null,
    tiers: [
      { label: 'SME',     price: 22000, badgeClass: 'pc-tier-label--sme',     checked: true  },
      { label: 'Publish', price: 48400, badgeClass: 'pc-tier-label--publish', checked: false },
    ],
    price: 22000, totalPrice: 145000, roundTrip: 288000,
    refundable: false, handBaggage: '7 Kg', checkInBaggage: true, hasMeal: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Package.deleteMany({});
    console.log('🗑️  Cleared existing packages');

    await Package.insertMany(packages);
    console.log(`🌱 Seeded ${packages.length} packages`);

    await mongoose.disconnect();
    console.log('✅ Done — disconnected');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
