import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { 
  User, 
  Mail, 
  Calendar,
  Scale,
  Ruler,
  Target,
  Edit,
  Save,
  X,
  Camera
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: user?.age?.toString() || '',
    weight: user?.weight?.toString() || '',
    height: user?.height?.toString() || '',
    goal: user?.goal || 'lose_weight',
    gender: user?.gender || 'male'
  });

  const goalOptions = [
    { value: 'lose_weight', label: 'Lose Weight' },
    { value: 'gain_weight', label: 'Gain Weight' },
    { value: 'build_muscle', label: 'Build Muscle' },
    { value: 'maintain_weight', label: 'Maintain Weight' },
    { value: 'improve_endurance', label: 'Improve Endurance' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      name: formData.name,
      age: parseInt(formData.age) || undefined,
      weight: parseFloat(formData.weight) || undefined,
      height: parseFloat(formData.height) || undefined,
      goal: formData.goal,
      gender: formData.gender
    });
    
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateBMI = () => {
    if (user?.weight && user?.height) {
      const heightInM = user.height / 100;
      return (user.weight / (heightInM * heightInM)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your personal information and fitness preferences</p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{user?.name}</h2>
                <p className="text-gray-600 flex items-center justify-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            {!isEditing && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                
                <div className="space-y-4">
                  {user?.age && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Age</span>
                      </div>
                      <span className="font-medium">{user.age} years</span>
                    </div>
                  )}
                  
                  {user?.weight && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Scale className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Weight</span>
                      </div>
                      <span className="font-medium">{user.weight} kg</span>
                    </div>
                  )}
                  
                  {user?.height && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Ruler className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Height</span>
                      </div>
                      <span className="font-medium">{user.height} cm</span>
                    </div>
                  )}
                  
                  {bmi && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">BMI</span>
                      <div className="text-right">
                        <span className="font-medium">{bmi}</span>
                        {bmiInfo && (
                          <p className={`text-xs ${bmiInfo.color}`}>{bmiInfo.category}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {user?.name || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="age"
                        min="13"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {user?.age ? `${user.age} years` : 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="weight"
                        min="30"
                        max="300"
                        step="0.1"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {user?.weight ? `${user.weight} kg` : 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="height"
                        min="100"
                        max="250"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {user?.height ? `${user.height} cm` : 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 capitalize">
                        {user?.gender || 'Not provided'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>Fitness Goal</span>
                      </div>
                    </label>
                    {isEditing ? (
                      <select
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {goalOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        {goalOptions.find(g => g.value === user?.goal)?.label || 'Not set'}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
              
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Change Password</div>
                  <div className="text-sm text-gray-600">Update your account password</div>
                </button>
                
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="font-medium text-gray-900">Privacy Settings</div>
                  <div className="text-sm text-gray-600">Manage your data and privacy preferences</div>
                </button>
                
                <button className="w-full text-left px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  <div className="font-medium">Delete Account</div>
                  <div className="text-sm text-red-500">Permanently remove your account and data</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;