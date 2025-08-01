import React, { createContext, useContext, useState, useEffect } from 'react';

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  caloriesBurned: number;
  muscleGroup: string;
  category: string;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  date: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface Goal {
  id: string;
  type: string;
  target: number;
  current: number;
  deadline: string;
}

interface DataContextType {
  workouts: Workout[];
  meals: Meal[];
  goals: Goal[];
  addWorkout: (workout: Omit<Workout, 'id'>) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedWorkouts = localStorage.getItem('fitbuddy_workouts');
    const savedMeals = localStorage.getItem('fitbuddy_meals');
    const savedGoals = localStorage.getItem('fitbuddy_goals');

    if (savedWorkouts) setWorkouts(JSON.parse(savedWorkouts));
    if (savedMeals) setMeals(JSON.parse(savedMeals));
    if (savedGoals) setGoals(JSON.parse(savedGoals));

    // Initialize with sample data if empty
    if (!savedWorkouts) {
      const sampleWorkouts = [
        {
          id: '1',
          name: 'Morning Run',
          date: '2025-01-06',
          duration: 45,
          caloriesBurned: 320,
          muscleGroup: 'Cardio',
          category: 'Cardio'
        },
        {
          id: '2',
          name: 'Chest & Triceps',
          date: '2025-01-05',
          duration: 60,
          caloriesBurned: 280,
          muscleGroup: 'Chest, Triceps',
          category: 'Strength'
        }
      ];
      setWorkouts(sampleWorkouts);
      localStorage.setItem('fitbuddy_workouts', JSON.stringify(sampleWorkouts));
    }

    if (!savedGoals) {
      const sampleGoals = [
        {
          id: '1',
          type: 'weight_loss',
          target: 75,
          current: 80,
          deadline: '2025-06-01'
        }
      ];
      setGoals(sampleGoals);
      localStorage.setItem('fitbuddy_goals', JSON.stringify(sampleGoals));
    }
  }, []);

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout = { ...workout, id: Date.now().toString() };
    const updatedWorkouts = [...workouts, newWorkout];
    setWorkouts(updatedWorkouts);
    localStorage.setItem('fitbuddy_workouts', JSON.stringify(updatedWorkouts));
  };

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal = { ...meal, id: Date.now().toString() };
    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    localStorage.setItem('fitbuddy_meals', JSON.stringify(updatedMeals));
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('fitbuddy_goals', JSON.stringify(updatedGoals));
  };

  const updateGoal = (id: string, data: Partial<Goal>) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, ...data } : goal
    );
    setGoals(updatedGoals);
    localStorage.setItem('fitbuddy_goals', JSON.stringify(updatedGoals));
  };

  return (
    <DataContext.Provider value={{
      workouts,
      meals,
      goals,
      addWorkout,
      addMeal,
      addGoal,
      updateGoal
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};