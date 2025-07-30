const CALORIES_NINJA_API_KEY = process.env.EXPO_PUBLIC_CALORIES_NINJA_API_KEY;
const CALORIES_NINJA_URL = 'https://api.calorieninjas.com/v1/nutrition?query=';

export interface CaloriesNinjaFood {
  name: string;
  calories: number;
  protein_g: number;
  fat_total_g: number;
  carbohydrates_total_g: number;
  serving_size_g?: number;
  [key: string]: any;
}

export async function getCaloriesNinjaData(foods: string[]): Promise<CaloriesNinjaFood[]> {
  if (!CALORIES_NINJA_API_KEY) {
    throw new Error('CALORIES_NINJA_API_KEY is not set!');
  }

  const results: CaloriesNinjaFood[] = [];

  for (const food of foods) {
    const url = CALORIES_NINJA_URL + encodeURIComponent(food);
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': CALORIES_NINJA_API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(`CaloriesNinja error: ${response.status} ${await response.text()}`);
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      // Poate fi mai multe rezultate, dar luăm primul ca fiind cel mai relevant
      results.push({
        name: food,
        ...data.items[0],
      });
    } else {
      // Dacă nu găsește, adaugă cu valori 0
      results.push({
        name: food,
        calories: 0,
        protein_g: 0,
        fat_total_g: 0,
        carbohydrates_total_g: 0,
      });
    }
  }

  return results;
} 