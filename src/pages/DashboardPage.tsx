import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Navbar from '../components/Navbar';
import { 
  Activity, 
  Target, 
  Calendar, 
  TrendingUp,
  Flame,
  Clock,
  Award,
  ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { workouts, meals, goals } = useData();

  // Calculate stats
  const currentWeight = user?.weight || 70;
  const goalWeight = goals.find(g => g.type === 'weight_loss')?.target || currentWeight;
  const totalWorkouts = workouts.length;
  const thisWeekWorkouts = workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    return workoutDate >= weekStart && workoutDate <= weekEnd;
  }).length;

  const totalCaloriesBurned = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
  const avgWorkoutDuration = workouts.length > 0 ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length) : 0;

  // Chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayWorkouts = workouts.filter(w => w.date === format(date, 'yyyy-MM-dd'));
    const calories = dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
    
    return {
      day: format(date, 'EEE'),
      calories,
      workouts: dayWorkouts.length
    };
  });

  const workoutCategories = workouts.reduce((acc, workout) => {
    acc[workout.category] = (acc[workout.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(workoutCategories).map(([name, value]) => ({ name, value }));
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const progressPercentage = goals.length > 0 
    ? Math.round(((currentWeight - goalWeight) / (user?.weight || 70 - goalWeight)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Here's your fitness journey overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                <p className="text-3xl font-bold text-gray-900">{totalWorkouts}</p>
                <p className="text-sm text-green-600 mt-1">
                  {thisWeekWorkouts} this week
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calories Burned</p>
                <p className="text-3xl font-bold text-gray-900">{totalCaloriesBurned.toLocaleString()}</p>
                <p className="text-sm text-orange-600 mt-1">
                  Total burned
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Flame className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                <p className="text-3xl font-bold text-gray-900">{avgWorkoutDuration}m</p>
                <p className="text-sm text-purple-600 mt-1">
                  Per workout
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Goal Progress</p>
                <p className="text-3xl font-bold text-gray-900">{Math.abs(progressPercentage)}%</p>
                <p className="text-sm text-green-600 mt-1">
                  On track
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="calories" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]}
                    name="Calories Burned"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workout Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Workout Distribution</h3>
              <Award className="h-5 w-5 text-gray-400" />
            </div>
            <div className="h-64">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No workout data yet</p>
                </div>
              )}
            </div>
            {pieData.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/workouts" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Log Workout</h3>
                <p className="text-sm text-gray-600">Track your exercise session</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </Link>

          <Link to="/nutrition" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Track Nutrition</h3>
                <p className="text-sm text-gray-600">Log your meals and calories</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
          </Link>

          <Link to="/goals" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Set Goals</h3>
                <p className="text-sm text-gray-600">Define your fitness targets</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </Link>

          <Link to="/ai-assistant" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Assistant</h3>
                <p className="text-sm text-gray-600">Get personalized suggestions</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;