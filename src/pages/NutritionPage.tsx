import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Navbar from '../components/Navbar';
import { 
  Plus, 
  Calendar, 
  TrendingUp,
  Apple,
  Coffee,
  Sun,
  Moon,
  PieChart
} from 'lucide-react';
import { format } from 'date-fns';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const NutritionPage: React.FC = () => {
  const { meals, addMeal } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const [formData, setFormData] = useState({
    name: '',
    time: 'breakfast',
    date: format(new Date(), 'yyyy-MM-dd'),
    calories: '',
    carbs: '',
    protein: '',
    fat: ''
  });

  const mealTimes = [
    { value: 'breakfast', label: 'Breakfast', icon: Sun },
    { value: 'lunch', label: 'Lunch', icon: Apple },
    { value: 'dinner', label: 'Dinner', icon: Moon },
    { value: 'snack', label: 'Snack', icon: Coffee }
  ];

  const todaysMeals = meals.filter(meal => meal.date === selectedDate);
  
  const dailyTotals = todaysMeals.reduce((totals, meal) => ({
    calories: totals.calories + meal.calories,
    carbs: totals.carbs + meal.carbs,
    protein: totals.protein + meal.protein,
    fat: totals.fat + meal.fat
  }), { calories: 0, carbs: 0, protein: 0, fat: 0 });

  const macroData = [
    { name: 'Carbs', value: dailyTotals.carbs, color: '#3B82F6' },
    { name: 'Protein', value: dailyTotals.protein, color: '#10B981' },
    { name: 'Fat', value: dailyTotals.fat, color: '#F59E0B' }
  ];

  const calorieGoal = 2000; // This could come from user settings
  const progressPercentage = Math.min((dailyTotals.calories / calorieGoal) * 100, 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addMeal({
      name: formData.name,
      time: formData.time,
      date: formData.date,
      calories: parseInt(formData.calories),
      carbs: parseFloat(formData.carbs),
      protein: parseFloat(formData.protein),
      fat: parseFloat(formData.fat)
    });

    setFormData({
      name: '',
      time: 'breakfast',
      date: format(new Date(), 'yyyy-MM-dd'),
      calories: '',
      carbs: '',
      protein: '',
      fat: ''
    });
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getMealsByTime = (timeSlot: string) => {
    return todaysMeals.filter(meal => meal.time === timeSlot);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition</h1>
            <p className="text-gray-600">Track your daily nutrition and calories</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Log Meal</span>
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="text-gray-600">
              {format(new Date(selectedDate), 'EEEE, MMMM dd, yyyy')}
            </span>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Calories Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Daily Calories</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="mb-4">
              <div className="flex items-end space-x-2 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {dailyTotals.calories}
                </span>
                <span className="text-gray-600">/ {calorieGoal} kcal</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                {calorieGoal - dailyTotals.calories > 0 
                  ? `${calorieGoal - dailyTotals.calories} calories remaining`
                  : `${dailyTotals.calories - calorieGoal} calories over goal`
                }
              </p>
            </div>
          </div>

          {/* Macros Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Macronutrients</h3>
              <PieChart className="h-5 w-5 text-gray-400" />
            </div>
            
            {macroData.some(item => item.value > 0) ? (
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={macroData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {macroData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}g`, '']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-gray-500">
                <p>No nutrition data for this day</p>
              </div>
            )}
            
            <div className="flex justify-center space-x-6 mt-4">
              {macroData.map((macro) => (
                <div key={macro.name} className="text-center">
                  <div className="flex items-center space-x-1 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: macro.color }}
                    />
                    <span className="text-sm text-gray-600">{macro.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{macro.value}g</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meals by Time */}
        <div className="space-y-6">
          {mealTimes.map((timeSlot) => {
            const mealsForTime = getMealsByTime(timeSlot.value);
            const Icon = timeSlot.icon;
            
            return (
              <div key={timeSlot.value} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">{timeSlot.label}</h3>
                    <span className="text-sm text-gray-500">
                      ({mealsForTime.reduce((sum, meal) => sum + meal.calories, 0)} kcal)
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  {mealsForTime.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No meals logged for {timeSlot.label.toLowerCase()}</p>
                  ) : (
                    <div className="space-y-4">
                      {mealsForTime.map((meal) => (
                        <div key={meal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{meal.name}</h4>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span>{meal.calories} kcal</span>
                              <span>C: {meal.carbs}g</span>
                              <span>P: {meal.protein}g</span>
                              <span>F: {meal.fat}g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Meal Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Log New Meal</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meal Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Grilled Chicken Salad"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meal Time *
                    </label>
                    <select
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {mealTimes.map(time => (
                        <option key={time.value} value={time.value}>{time.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories *
                  </label>
                  <input
                    type="number"
                    name="calories"
                    required
                    min="1"
                    value={formData.calories}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="350"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carbs (g) *
                    </label>
                    <input
                      type="number"
                      name="carbs"
                      required
                      min="0"
                      step="0.1"
                      value={formData.carbs}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protein (g) *
                    </label>
                    <input
                      type="number"
                      name="protein"
                      required
                      min="0"
                      step="0.1"
                      value={formData.protein}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fat (g) *
                    </label>
                    <input
                      type="number"
                      name="fat"
                      required
                      min="0"
                      step="0.1"
                      value={formData.fat}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="12"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save Meal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NutritionPage;