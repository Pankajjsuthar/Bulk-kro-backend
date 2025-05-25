// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require("./config/db");
require('dotenv').config();
const { MealPlan} = require("./models/MealPlan.jsx");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/meal-plans', async (req, res) => {
  try {
    const mealPlans = await MealPlan.find()
      .sort({ date: -1 }) // Sort by date descending
      .exec();
    
    res.json({
      success: true,
      data: mealPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching meal plans',
      error: error.message
    });
  }
});

// 2. POST - Create new meal plan
app.post('/api/meal-plans', async (req, res) => {
  try {
    const {
      date,
      weight,
      workout,
      creatine,
      whey,
      breakfast,
      morningSnack,
      lunch,
      preWorkout,
      postWorkout,
      dinner,
      bedtimeSnack,
      calories,
      protein,
      notes
    } = req.body;

    // Check if meal plan for this date already exists
    const existingPlan = await MealPlan.findOne({ date });
    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: 'Meal plan for this date already exists. Use PUT to update.'
      });
    }

    const newMealPlan = new MealPlan({
      date,
      weight,
      workout: workout || false,
      creatine: creatine || false,
      whey: whey || false,
      meals: {
        breakfast: breakfast || '',
        morningSnack: morningSnack || '',
        lunch: lunch || '',
        preWorkout: preWorkout || '',
        postWorkout: postWorkout || '',
        dinner: dinner || '',
        bedtimeSnack: bedtimeSnack || ''
      },
      nutrition: {
        calories: calories || '',
        protein: protein || ''
      },
      notes: notes || ''
    });

    const savedMealPlan = await newMealPlan.save();
    
    res.status(201).json({
      success: true,
      message: 'Meal plan created successfully',
      data: savedMealPlan
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: 'Meal plan for this date already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error creating meal plan',
        error: error.message
      });
    }
  }
});

// 3. PUT - Update existing meal plan
app.put('/api/meal-plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      date,
      weight,
      workout,
      creatine,
      whey,
      breakfast,
      morningSnack,
      lunch,
      preWorkout,
      postWorkout,
      dinner,
      bedtimeSnack,
      calories,
      protein,
      notes
    } = req.body;

    const updatedMealPlan = await MealPlan.findByIdAndUpdate(
      id,
      {
        date,
        weight,
        workout: workout || false,
        creatine: creatine || false,
        whey: whey || false,
        meals: {
          breakfast: breakfast || '',
          morningSnack: morningSnack || '',
          lunch: lunch || '',
          preWorkout: preWorkout || '',
          postWorkout: postWorkout || '',
          dinner: dinner || '',
          bedtimeSnack: bedtimeSnack || ''
        },
        nutrition: {
          calories: calories || '',
          protein: protein || ''
        },
        notes: notes || ''
      },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    );

    if (!updatedMealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal plan updated successfully',
      data: updatedMealPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating meal plan',
      error: error.message
    });
  }
});

// 4. GET single meal plan by ID
app.get('/api/meal-plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mealPlan = await MealPlan.findById(id);

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching meal plan',
      error: error.message
    });
  }
});

// 5. DELETE meal plan
app.delete('/api/meal-plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMealPlan = await MealPlan.findByIdAndDelete(id);

    if (!deletedMealPlan) {
      return res.status(404).json({
        success: false,
        message: 'Meal plan not found'
      });
    }

    res.json({
      success: true,
      message: 'Meal plan deleted successfully',
      data: deletedMealPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting meal plan',
      error: error.message
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Meal Planner API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
};

startServer();