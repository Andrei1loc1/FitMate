import { Client, Databases, Account, Models } from 'appwrite';
import { Query } from 'appwrite';

// Appwrite configuration
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('687296c10007fbb090a5'); 

export const databases = new Databases(client);
export const account = new Account(client);

// Database and collection IDs
export const DATABASE_ID = '6873a725002d274b19d5';
export const MEALS_COLLECTION_ID = '6873a7300002ab20ce58';
export const STEPS_COLLECTION_ID = '6873e8580023a4e9eae2';
export const WATER_COLLECTION_ID = '6877c0d70004b645f204'; 

// Meal interface
export interface Meal {
    $id?: string;
    mealName: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    userID: string;
    createdAt: string;
}

// Steps interface
export interface Steps {
    $id?: string;
    userID: string;
    steps: number;
    date: string; // Format: YYYY-MM-DD
    createdAt: string;
    updatedAt: string;
}

// Water interface
export interface Water {
  $id?: string;
  userID: string;
  water: number;
  date: string; // Format: YYYY-MM-DD
}

// Type for Appwrite document
type MealDocument = Models.Document & Meal;
type StepsDocument = Models.Document & Steps;
type WaterDocument = Models.Document & Water;

// Helper function to create short timestamp for Appwrite
const createShortTimestamp = (): string => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' '); // Format: "2024-01-15 10:30:00"
};

// Steps service functions - folosește Firebase user ID
export const stepsService = {
    // Create or update steps for a specific date
    async upsertSteps(firebaseUserID: string, steps: number, date: string): Promise<Steps> {
        try {
            // Încearcă să găsească un record existent pentru această dată
            const existingSteps = await this.getStepsByDate(firebaseUserID, date);
            
            if (existingSteps) {
                // Update existing record
                const response = await databases.updateDocument(
                    DATABASE_ID,
                    STEPS_COLLECTION_ID,
                    existingSteps.$id!,
                    {
                        steps: steps,
                        updatedAt: createShortTimestamp()
                    }
                );
                return response as unknown as Steps;
            } else {
                // Create new record
                const response = await databases.createDocument(
                    DATABASE_ID,
                    STEPS_COLLECTION_ID,
                    'unique()',
                    {
                        userID: firebaseUserID,
                        steps: steps,
                        date: date,
                        createdAt: createShortTimestamp(),
                        updatedAt: createShortTimestamp()
                    }
                );
                return response as unknown as Steps;
            }
        } catch (error) {
            console.error('Error upserting steps:', error);
            throw error;
        }
    },

    // Get steps for a specific date
    async getStepsByDate(firebaseUserID: string, date: string): Promise<Steps | null> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                STEPS_COLLECTION_ID,
                [
                    // Filter by userID and date
                    // Note: You'll need to create indexes for userID and date in your Appwrite collection
                ]
            );
            
            const allSteps = response.documents as unknown as Steps[];
            const filteredSteps = allSteps.filter(step => 
                step.userID === firebaseUserID && step.date === date
            );
            
            return filteredSteps.length > 0 ? filteredSteps[0] : null;
        } catch (error) {
            console.error('Error fetching steps by date:', error);
            throw error;
        }
    },

    // Get steps for a date range
    async getStepsByDateRange(firebaseUserID: string, startDate: string, endDate: string): Promise<Steps[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                STEPS_COLLECTION_ID,
                [
                    // Filter by userID and date range
                    // Note: You'll need to create indexes for userID and date in your Appwrite collection
                ]
            );
            
            const allSteps = response.documents as unknown as Steps[];
            return allSteps.filter(step => 
                step.userID === firebaseUserID && 
                step.date >= startDate && 
                step.date <= endDate
            );
        } catch (error) {
            console.error('Error fetching steps by date range:', error);
            throw error;
        }
    },

    // Get today's steps
    async getTodaySteps(firebaseUserID: string): Promise<Steps | null> {
        const today = new Date().toISOString().slice(0, 10);
        return await this.getStepsByDate(firebaseUserID, today);
    },

    // Get all steps for a user
    async getUserSteps(firebaseUserID: string): Promise<Steps[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                STEPS_COLLECTION_ID,
                [
                    // Filter by userID
                    // Note: You'll need to create an index for userID in your Appwrite collection
                ]
            );
            
            const allSteps = response.documents as unknown as Steps[];
            return allSteps.filter(step => step.userID === firebaseUserID);
        } catch (error) {
            console.error('Error fetching user steps:', error);
            throw error;
        }
    },

    // Delete steps for a specific date
    async deleteSteps(stepId: string): Promise<void> {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                STEPS_COLLECTION_ID,
                stepId
            );
        } catch (error) {
            console.error('Error deleting steps:', error);
            throw error;
        }
    },

    async getWeeklySteps(userId: string): Promise<{ date: string; steps: number; }[]> {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        const startDate = sevenDaysAgo.toISOString().slice(0, 10);
        const endDate = today.toISOString().slice(0, 10);

        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                STEPS_COLLECTION_ID,
                [
                    Query.equal('userID', userId),
                    Query.greaterThanEqual('date', startDate),
                    Query.lessThanEqual('date', endDate)
                ]
            );

            const stepsMap = new Map<string, number>();
            for (const doc of response.documents) {
                stepsMap.set(doc.date, doc.steps);
            }

            const result: { date: string; steps: number }[] = [];
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(sevenDaysAgo);
                currentDate.setDate(sevenDaysAgo.getDate() + i);
                const dateStr = currentDate.toISOString().slice(0, 10);
                result.push({
                    date: dateStr,
                    steps: stepsMap.get(dateStr) || 0
                });
            }

            return result;
        } catch (error) {
            console.error('Eroare la preluarea pașilor săptămânali:', error);
            return [];
        }
    }
};

// Meal service functions - folosește Firebase user ID
export const mealService = {
    // Create a new meal
    async createMeal(mealData: Omit<Meal, '$id' | 'createdAt'>): Promise<Meal> {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                MEALS_COLLECTION_ID,
                'unique()',
                {
                    mealName: mealData.mealName,
                    mealType: mealData.mealType,
                    calories: Number(mealData.calories),
                    protein: Number(mealData.protein),
                    carbs: Number(mealData.carbs),
                    fat: Number(mealData.fat),
                    userID: mealData.userID,
                    createdAt: createShortTimestamp()
                }
            );
            return response as unknown as Meal;
        } catch (error) {
            console.error('Error creating meal:', error);
            throw error;
        }
    },

    // Get all meals for a user
    async getUserMeals(firebaseUserID: string): Promise<Meal[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                MEALS_COLLECTION_ID,
                [
                    // Filter by userID
                    // Note: You'll need to create an index for userID in your Appwrite collection
                ]
            );
            // Filter meals by userID on the client side for now
            const allMeals = response.documents as unknown as Meal[];
            return allMeals.filter(meal => meal.userID === firebaseUserID);
        } catch (error) {
            console.error('Error fetching meals:', error);
            throw error;
        }
    },

    // Delete a meal
    async deleteMeal(mealId: string): Promise<void> {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                MEALS_COLLECTION_ID,
                mealId
            );
        } catch (error) {
            console.error('Error deleting meal:', error);
            throw error;
        }
    }
}; 

export const waterService = {
  // Create or update water for a specific date
  async upsertWater(firebaseUserID: string, water: number, date: string): Promise<Water> {
    try {
      const existingWater = await this.getWaterByDate(firebaseUserID, date);
      if (existingWater) {
        const response = await databases.updateDocument(
          DATABASE_ID,
          WATER_COLLECTION_ID,
          existingWater.$id!,
          { water }
        );
        return response as unknown as Water;
      } else {
        const response = await databases.createDocument(
          DATABASE_ID,
          WATER_COLLECTION_ID,
          'unique()',
          {
            userID: firebaseUserID,
            water,
            date
          }
        );
        return response as unknown as Water;
      }
    } catch (error) {
      console.error('Error upserting water:', error);
      throw error;
    }
  },

  // Get water for a specific date
  async getWaterByDate(firebaseUserID: string, date: string): Promise<Water | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        WATER_COLLECTION_ID,
        []
      );
      const allWater = response.documents as unknown as Water[];
      const filtered = allWater.filter(w => w.userID === firebaseUserID && w.date === date);
      return filtered.length > 0 ? filtered[0] : null;
    } catch (error) {
      console.error('Error fetching water by date:', error);
      throw error;
    }
  },

  // Get all water entries for a user
  async getUserWater(firebaseUserID: string): Promise<Water[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        WATER_COLLECTION_ID,
        []
      );
      const allWater = response.documents as unknown as Water[];
      return allWater.filter(w => w.userID === firebaseUserID);
    } catch (error) {
      console.error('Error fetching user water:', error);
      throw error;
    }
  }
}; 
