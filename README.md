
# FitMate AI 🏋️‍♂️

A modern AI-powered fitness and nutrition app built with Expo, React Native, and Firebase. FitMate AI helps users track workouts, meals, hydration, and progress, offering smart suggestions and a personalized experience.

![Expo](https://img.shields.io/badge/Expo-49.0.0-blue?logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.73.0-blue?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

---

## Table of Contents

- [Features](#features)
- [Technologies / Stack](#technologies--stack)
- [Installation](#installation)
- [Usage](#usage)
- [API / Endpoints](#api--endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Credits / References](#credits--references)

---

## Features

- 📊 Track daily steps, calories, water intake, and workouts
- 🥗 AI-powered meal planning and nutrition suggestions
- 🏋️‍♀️ Weekly gym plans and exercise library
- 📸 Add meals via camera (image recognition)
- 👤 Edit profile (name, email, profile picture)
- 📅 Calendar view for meals and workouts
- 🔒 Firebase authentication and Appwrite backend
- 🎨 Modern, responsive UI with dark mode

---

## Technologies / Stack

- **Expo** (React Native)
- **TypeScript**
- **Firebase** (Auth, Firestore)
- **Appwrite** (Database, API)
- **Tailwind CSS** (NativeWind)
- **AI Integrations** (Llama, Gemini)
- **AsyncStorage** (local caching)
- **Phosphor Icons**
- **Jest** (testing)

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/fitmate-ai.git
cd fitmate-ai
npm install
```

Start the development server:

```bash
npx expo start
```

> **Note:**  
> You can run the app on your device using Expo Go, or on an emulator/simulator (Android/iOS).

---

## Usage

- **Start the app:**  
   Run `npx expo start` and scan the QR code with Expo Go or launch on an emulator.
- **Sign up / Log in:**  
   Use Firebase authentication to create an account.
- **Track progress:**  
   Add workouts, meals, and water intake. View weekly stats.
- **AI Suggestions:**  
   Get personalized meal plans and workout recommendations.
- **Edit Profile:**  
   Update your name, email, and profile picture from the profile settings.

---

## API / Endpoints

- **Firebase Auth:**  
   `/auth` - User authentication
- **Appwrite Database:**  
   `/meals` - Meals CRUD  
   `/steps` - Steps tracking  
   `/water` - Hydration tracking
- **AI Services:**  
   `/api_llama` - Meal plan generation  
   `/api_gemini` - Chat and suggestions

---

## Screenshots

> _Add screenshots or GIFs of the app UI here!_

![Dashboard](assets/screenshots/dashboard.png)
![Meal Plan](assets/screenshots/meal-plan.png)
![Profile Edit](assets/screenshots/edit-profile.png)

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Open a pull request

Please follow the code style and add tests where appropriate.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Credits / References

- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Firebase](https://firebase.google.com/)
- [Appwrite](https://appwrite.io/)
- [Phosphor Icons](https://phosphoricons.com/)
- [NativeWind](https://www.nativewind.dev/)
