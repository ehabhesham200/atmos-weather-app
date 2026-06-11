import mongoose from 'mongoose';

const dailyTemperatureSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    tempMax: Number,
    tempMin: Number,
    tempMean: Number,
  },
  { _id: false }
);

const recordSchema = new mongoose.Schema(
  {
    rawLocationInput: { type: String, required: true, trim: true },
    resolvedName: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    country: String,
    timezone: String,
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    temperatureUnit: { type: String, default: '°C' },
    temperatures: [dailyTemperatureSchema],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Record = mongoose.model('Record', recordSchema);
