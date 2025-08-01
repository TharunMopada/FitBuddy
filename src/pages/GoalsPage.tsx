import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Navbar from '../components/Navbar';
import { 
  Plus, 
  Target, 
  TrendingDown,
  TrendingUp,
  Calendar,
  Award,
  Edit,
  Check
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

const GoalsPage: React.FC = () => {
  const { user } = useAuth();
  const { goals, addGoal, updateGoal } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'weight_loss',
    target: '',
    current: '',
    deadline: ''
  });

  const goalTypes = [
    { value: 'weight_loss', label: 'Weight Loss', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-100' },
    { value: 'weight_gain', label: 'Weight Gain', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'muscle_gain', label: 'Muscle Gain', icon: Award, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { value: 'strength_goal', label: 'Strength Goal', icon: Target, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { value: 'endurance_goal', label: 'Endurance Goal', icon: Target, color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addGoal({
      type: formData.type,
      target: parseFloat(formData.target),
      current: parseFloat(formData.current),
      deadline: formData.deadline
    });

    setFormData({
      type: 'weight_loss',
      target: '',
      current: '',
      deadline: ''
    });
    setShowAddForm(false);
  };

  const handleUpdateProgress = (goalId: string, newCurrent: number) => {
    updateGoal(goalId, { current: newCurrent });
    setEditingGoal(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getProgressPercentage = (goal: any) => {
    if (goal.type === 'weight_loss') {
      const initialWeight = user?.weight || goal.current;
      const totalToLose = initialWeight - goal.target;
      const currentlyLost = initialWeight - goal.current;
      return Math.min((currentlyLost / totalToLose) * 100, 100);
    } else {
      return Math.min((goal.current / goal.target) * 100, 100);
    }
  };

  const getDaysRemaining = (deadline: string) => {
    return differenceInDays(new Date(deadline), new Date());
  };

  const getGoalTypeInfo = (type: string) => {
    return goalTypes.find(gt => gt.value === type) || goalTypes[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fitness Goals</h1>
            <p className="text-gray-600">Set and track your fitness objectives</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 sm:mt-0 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Set New Goal</span>
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No goals set yet</h3>
              <p className="text-gray-600 mb-6">
                Start by setting your first fitness goal to track your progress!
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Set Your First Goal
              </button>
            </div>
          ) : (
            goals.map((goal) => {
              const goalInfo = getGoalTypeInfo(goal.type);
              const IconComponent = goalInfo.icon;
              const progress = getProgressPercentage(goal);
              const daysRemaining = getDaysRemaining(goal.deadline);
              const isOverdue = daysRemaining < 0;
              
              return (
                <div key={goal.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${goalInfo.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${goalInfo.color}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {goalInfo.label}
                        </h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center space-x-4">
                            <span>
                              <span className="font-medium">Current:</span> {goal.current}
                              {goal.type.includes('weight') ? ' kg' : ''}
                            </span>
                            <span>
                              <span className="font-medium">Target:</span> {goal.target}
                              {goal.type.includes('weight') ? ' kg' : ''}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Deadline: {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                            </span>
                            <span className={`ml-2 ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                              ({isOverdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setEditingGoal(goal.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          progress >= 100 ? 'bg-green-600' : 
                          progress >= 75 ? 'bg-blue-600' :
                          progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Update Progress */}
                  {editingGoal === goal.id ? (
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Update current value:</span>
                      <input
                        type="number"
                        defaultValue={goal.current}
                        step="0.1"
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-24"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement;
                            handleUpdateProgress(goal.id, parseFloat(target.value));
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          handleUpdateProgress(goal.id, parseFloat(input.value));
                        }}
                        className="p-2 text-green-600 hover:text-green-700 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">
                        {goal.type === 'weight_loss' 
                          ? `${(goal.current - goal.target).toFixed(1)} kg to go`
                          : `${(goal.target - goal.current).toFixed(1)} ${goal.type.includes('weight') ? 'kg' : 'units'} to go`
                        }
                      </span>
                      {progress >= 100 && (
                        <span className="flex items-center space-x-1 text-green-600 font-medium">
                          <Award className="h-4 w-4" />
                          <span>Goal Achieved!</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Set New Goal</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Type *
                  </label>
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {goalTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Value *
                    </label>
                    <input
                      type="number"
                      name="current"
                      required
                      step="0.1"
                      value={formData.current}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Value *
                    </label>
                    <input
                      type="number"
                      name="target"
                      required
                      step="0.1"
                      value={formData.target}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="75"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline *
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    min={format(new Date(), 'yyyy-MM-dd')}
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
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Set Goal
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

export default GoalsPage;