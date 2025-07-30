const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = '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'; // For testing only!

export async function getMotivationalQuoteLlama() {
  const apiKey = API_KEY;
  if (!apiKey) throw new Error('Qwen API key missing!');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen/qwen-2.5-72b-instruct:free',
      messages: [
        { role: 'system', content: 'You are a fitness coach AI. Reply only with short, punchy, motivational fitness quotes in English, max 20 words.' },
        { role: 'user', content: 'Give me a short motivational fitness quote.' }
      ],
      max_tokens: 60,
      temperature: 0.9,
      stream: false
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    // fallback static dacă e rate limit
    if (response.status === 429 || error.includes('Rate limit exceeded')) {
      return 'Stay strong! Every step counts.';
    }
    throw new Error('Qwen API error: ' + error);
  }

  const data = await response.json();
  if (data.choices && data.choices[0]?.message?.content) {
    return data.choices[0].message.content.trim();
  }
  return 'Stay strong! Every step counts.';
}


export async function getMealPlanLlama(mealTypes: string[]) {
  const apiKey = API_KEY;
  if (!apiKey) throw new Error('API key missing!');

  // Use English meal types for MoonshotAI
  // If mealTypes are not in English, map them here
  // const mealTypesEn = ['Breakfast', 'Snack 1', 'Lunch', 'Snack 2', 'Dinner', 'Snack 3'];
  // For now, assume mealTypes are in English
  const mealList = mealTypes.map((type, idx) => `${idx + 1}. ${type}`).join('\n');
  const userPrompt = `Generate a concrete meal plan for one day, with food suggestions for each meal. List each meal with a short recommended menu. Meals are:\n${mealList}\nReply only with the list, no extra explanations. Write in English and use exactly the meal names provided.`;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'moonshotai/kimi-k2:free',
      messages: [
        { role: 'system', content: 'You are an AI nutritionist specialized in fitness. You only reply with concrete meal plans, by meal, in English, using exactly the meal names provided.' },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
      stream: false
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    // fallback static dacă e rate limit
    if (response.status === 429 || error.includes('Rate limit exceeded')) {
      // fallback plan static
      const staticPlan = Object.fromEntries(mealTypes.map((type, idx) => [type, `Example meal for ${type.toLowerCase()}`]));
      return staticPlan;
    }
    throw new Error('MoonshotAI API error: ' + error);
  }

  const data = await response.json();
          // Full Kimi response received
  if (data.choices && data.choices[0]?.message?.content) {
    const text = data.choices[0].message.content.trim();
          // Raw AI meal plan response received
    const lines = text.split(/\n|\r/).filter((line: string): boolean => Boolean(line));
    const plan: { [type: string]: string } = {};
    const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').trim();
    mealTypes.forEach(type => {
      const found = lines.find((line: string) => normalize(line).includes(normalize(type)));
      if (found) {
        const parts = found.split(/:|-/);
        plan[type] = parts.length > 1 ? parts.slice(1).join('-').trim() : found.trim();
      } else {
        plan[type] = '-';
      }
    });
    return plan;
  }
  // fallback
  return Object.fromEntries(mealTypes.map(type => [type, '-']));
} 