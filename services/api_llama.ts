// Allow TypeScript to recognize process.env in Expo bundler context
declare const process: any;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
// Read the OpenRouter API key from Expo public env at build time
const API_KEY = process.env.EXPO_PUBLIC_QWEN_API_KEY;

export async function getMotivationalQuoteLlama() {
  const apiKey = API_KEY;
  if (!apiKey) throw new Error('OpenRouter API key missing (EXPO_PUBLIC_QWEN_API_KEY)');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'FitMate AI',
      'HTTP-Referer': 'https://fitmate.ai'
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
    const errorText = await response.text();
    const status = response.status;
    // fallback static dacă e rate limit
    if (status === 429 || errorText.includes('Rate limit exceeded')) {
      return 'Stay strong! Every step counts.';
    }
    let message = errorText;
    try {
      const errJson = JSON.parse(errorText);
      message = errJson?.error?.message || message;
    } catch {}
    if (status === 401 || /user not found/i.test(message)) {
      throw new Error('OpenRouter authentication failed (401). Check EXPO_PUBLIC_QWEN_API_KEY and rebuild the app. Details: ' + message);
    }
    throw new Error('OpenRouter API error: ' + message);
  }

  const data = await response.json();
  if (data.choices && data.choices[0]?.message?.content) {
    return data.choices[0].message.content.trim();
  }
  return 'Stay strong! Every step counts.';
}


export async function getMealPlanLlama(mealTypes: string[]) {
  const apiKey = API_KEY;
  if (!apiKey) throw new Error('OpenRouter API key missing (EXPO_PUBLIC_QWEN_API_KEY)');

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
      'X-Title': 'FitMate AI',
      'HTTP-Referer': 'https://fitmate.ai'
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
    const errorText = await response.text();
    const status = response.status;
    // fallback static dacă e rate limit
    if (status === 429 || errorText.includes('Rate limit exceeded')) {
      // fallback plan static
      const staticPlan = Object.fromEntries(mealTypes.map((type, idx) => [type, `Example meal for ${type.toLowerCase()}`]));
      return staticPlan;
    }
    let message = errorText;
    try {
      const errJson = JSON.parse(errorText);
      message = errJson?.error?.message || message;
    } catch {}
    if (status === 401 || /user not found/i.test(message)) {
      throw new Error('OpenRouter authentication failed (401). Check EXPO_PUBLIC_QWEN_API_KEY and rebuild the app. Details: ' + message);
    }
    throw new Error('OpenRouter API error: ' + message);
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