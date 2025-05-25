const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true // Ensure one record per date
  },
  weight: {
    type: String,
    required: true
  },
  workout: {
    type: Boolean,
    default: false
  },
  creatine: {
    type: Boolean,
    default: false
  },
  whey: {
    type: Boolean,
    default: false
  },
  meals: {
    breakfast: {
      type: String,
      default: ''
    },
    morningSnack: {
      type: String,
      default: ''
    },
    lunch: {
      type: String,
      default: ''
    },
    preWorkout: {
      type: String,
      default: ''
    },
    postWorkout: {
      type: String,
      default: ''
    },
    dinner: {
      type: String,
      default: ''
    },
    bedtimeSnack: {
      type: String,
      default: ''
    }
  },
  nutrition: {
    calories: {
      type: String,
      default: ''
    },
    protein: {
      type: String,
      default: ''
    }
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

module.exports = {MealPlan}