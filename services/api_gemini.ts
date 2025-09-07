// Allow TypeScript to recognize process.env in Expo bundler context
declare const process: any;
const API_KEY = process.env.EXPO_PUBLIC_AI_API_KEY;
// API Key loaded

if (!API_KEY) {
  console.error('EXPO_PUBLIC_AI_API_KEY is not set!');
}

const GEMINI_MODELS = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.0-pro-latest',
  'gemini-1.0-pro-vision-latest',
  // Fallback models in case the above ones fail
  'gemini-1.5-flash-8b-latest',
  'gemini-1.5-pro-8b-latest',
];
const HEADERS = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

// Specialized fitness prompt to be included with every request
const FITNESS_PROMPT = `Ești un asistent virtual specializat în fitness, nutriție și sănătate legată de sport. Oferi utilizatorilor sfaturi scurte, clare și ușor de aplicat. Răspunsurile tale trebuie să aibă între 2 și 6 propoziții, iar doar dacă întrebarea este complexă (ex: plan de alimentație, explicații despre hormoni, tipuri de antrenament etc.), poți extinde răspunsul. 

Răspunzi strict la întrebări și solicitări care țin de:
- fitness (antrenamente, exerciții, planuri de mișcare),
- nutriție (alimente, macronutrienți, mese, calorii),
- rețete sănătoase și sugestii alimentare,
- sănătate legată de stilul de viață activ (somn, recuperare, hidratare),
- suplimente și obiceiuri corelate cu sportul.

**Ignori complet** întrebările care nu sunt legate de domeniul sportului, nutriției sau sănătății în contextul fitness-ului. Răspunzi politicos, dar ferm, că nu poți oferi informații în afara acestor domenii.

Stilul tău este calm, prietenos și motivant. Evită explicațiile prea tehnice, folosește un limbaj clar, ca pentru public general. Când este relevant, poți încuraja utilizatorul să adopte obiceiuri sănătoase.

Nu încurajezi niciodată soluții nesigure sau periculoase. Respecți principiile unei vieți echilibrate și a unui progres sustenabil.

Exemple de întrebări la care răspunzi:
- „Ce să mănânc după antrenament?”
- „Cum pot slăbi fără să pierd masă musculară?”
- „Ai o rețetă sănătoasă pentru micul dejun?”
- „Câte proteine trebuie să mănânc pe zi?”
- „E ok să fac sport zilnic?”

Exemple de întrebări la care NU răspunzi:
- „Ce filme îmi recomanzi?”
- „Cum îmi repar telefonul?”
- „Ce părere ai despre războiul din Ucraina?”
(La acestea, răspunsul tău e de forma: „Îmi pare rău, dar mă concentrez doar pe subiecte legate de fitness, nutriție și sănătate.”)

Întrebarea utilizatorului: `;

export async function getGeminiResponse(prompt: string): Promise<string> {
  let lastError = null;
  for (const model of GEMINI_MODELS) {
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    try {
      // Trying model
      const body = JSON.stringify({
        contents: [{
          parts: [
            { text: FITNESS_PROMPT + prompt }
          ]
        }]
      });
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: HEADERS,
        body
      });
      if (!response.ok) {
        const errorText = await response.text();
        // Model failed
        // Dacă e limită sau altă eroare, continuă cu următorul model
        lastError = new Error(`Gemini API error [${model}]: ${response.status} ${errorText}`);
        continue;
      }
      const { candidates } = await response.json();
      const result = candidates?.[0]?.content?.parts?.[0]?.text ?? '';
              // Model worked
      return result;
    } catch (err) {
              // Error for model
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error('Nu s-a putut obține răspuns de la niciun model Gemini. Toate modelele au eșuat.');
}

export async function getGeminiResponseWithFallback(imageBase64: string, prompt: string): Promise<string> {
  let lastError = null;
  for (const model of GEMINI_MODELS) {
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
    try {
      // Trying model for image
      const body = JSON.stringify({
        contents: [{
          parts: [
            { text: FITNESS_PROMPT + prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64.split(',')[1]
              }
            }
          ]
        }]
      });
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: HEADERS,
        body
      });
      if (!response.ok) {
        const errorText = await response.text();
                  // Model for image failed
        // Dacă e limită sau altă eroare, continuă cu următorul model
        lastError = new Error(`Gemini API error [${model}]: ${response.status} ${errorText}`);
        continue;
      }
      const { candidates } = await response.json();
      const result = candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                // Model for image worked
      return result;
    } catch (err) {
                // Error for model with image
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error('Nu s-a putut obține răspuns de la niciun model Gemini pentru imagine. Toate modelele au eșuat.');
}