import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Navbar from '../components/Navbar';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Flame, 
  Filter,
  Search,
  Dumbbell,
  Heart,
  Zap,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

const WorkoutsPage: React.FC = () => {
  const { workouts, addWorkout } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: '',
    caloriesBurned: '',
    muscleGroup: '',
    category: 'Strength'
  });

  const categories = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Sports', 'Other'];
  const categoryIcons = {
    Strength: Dumbbell,
    Cardio: Heart,
    HIIT: Zap,
    Yoga: Target,
    Sports: Target,
    Other: Target
  };

  const filteredWorkouts = workouts.filter(workout => {
    const matchesFilter = filter === 'all' || workout.category === filter;
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addWorkout({
      name: formData.name,
      date: formData.date,
      duration: parseInt(formData.duration),
      caloriesBurned: parseInt(formData.caloriesBurned),
      muscleGroup: formData.muscleGroup,
      category: formData.category
    });

    setFormData({
      name: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      duration: '',
      caloriesBurned: '',
      muscleGroup: '',
      category: 'Strength'
    });
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h1>
            <p className="text-gray-600">Track and manage your exercise sessions</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Log Workout</span>
          </button>
        </div>

        {/* Add Workout Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Log New Workout</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workout Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Morning Run, Chest & Triceps"
                  />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (min) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      required
                      min="1"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="45"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calories Burned *
                    </label>
                    <input
                      type="number"
                      name="caloriesBurned"
                      required
                      min="1"
                      value={formData.caloriesBurned}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Muscle Groups
                  </label>
                  <input
                    type="text"
                    name="muscleGroup"
                    value={formData.muscleGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Chest, Triceps, Cardio"
                  />
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
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Workout
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search workouts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Workouts List */}
        <div className="space-y-4">
          {filteredWorkouts.length === 0 ? (
            <div className="text-center py-12">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by logging your first workout!'
                }
              </p>
              {!searchTerm && filter === 'all' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Log Your First Workout
                </button>
              )}
            </div>
          ) : (
            filteredWorkouts.map((workout) => {
              const IconComponent = categoryIcons[workout.category as keyof typeof categoryIcons] || Target;
              
              return (
                <div key={workout.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={clsx(
                        'p-3 rounded-lg',
                        workout.category === 'Strength' && 'bg-blue-100',
                        workout.category === 'Cardio' && 'bg-red-100',
                        workout.category === 'HIIT' && 'bg-orange-100',
                        workout.category === 'Yoga' && 'bg-purple-100',
                        (workout.category === 'Sports' || workout.category === 'Other') && 'bg-green-100'
                      )}>
                        <IconComponent className={clsx(
                          'h-6 w-6',
                          workout.category === 'Strength' && 'text-blue-600',
                          workout.category === 'Cardio' && 'text-red-600',
                          workout.category === 'HIIT' && 'text-orange-600',
                          workout.category === 'Yoga' && 'text-purple-600',
                          (workout.category === 'Sports' || workout.category === 'Other') && 'text-green-600'
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {workout.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(workout.date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{workout.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Flame className="h-4 w-4" />
                            <span>{workout.caloriesBurned} cal</span>
                          </div>
                        </div>
                        {workout.muscleGroup && (
                          <p className="text-sm text-gray-500 mt-2">
                            <span className="font-medium">Muscle Groups:</span> {workout.muscleGroup}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <span className={clsx(
                      'px-3 py-1 rounded-full text-xs font-medium',
                      workout.category === 'Strength' && 'bg-blue-100 text-blue-800',
                      workout.category === 'Cardio' && 'bg-red-100 text-red-800',
                      workout.category === 'HIIT' && 'bg-orange-100 text-orange-800',
                      workout.category === 'Yoga' && 'bg-purple-100 text-purple-800',
                      (workout.category === 'Sports' || workout.category === 'Other') && 'bg-green-100 text-green-800'
                    )}>
                      {workout.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkoutsPage;