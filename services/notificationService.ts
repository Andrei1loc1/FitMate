import * as Notifications from 'expo-notifications';
import * as BackgroundTask from 'expo-background-task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STEPS_STORAGE_KEY = 'background_steps_data';

// Configurează notificările
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permisiuni notificări refuzate');
      return false;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('steps', {
        name: 'Pași zilnici',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return true;
  }

  static async scheduleStepsNotification(steps: number, goal: number = 10000) {
    const progress = Math.round((steps / goal) * 100);
    
    // Pentru Expo Go, trimitem doar notificări de test
    // În development build, acestea vor funcționa complet
    try {
      // Notificare pentru progres zilnic
      if (progress >= 50 && progress < 100) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🏃‍♂️ Ai făcut progres!',
            body: `Ai parcurs ${steps} pași din ${goal} (${progress}%)`,
            data: { type: 'steps_progress' },
          },
          trigger: null, // Notificare imediată
        });
      }
      
      // Notificare pentru obiectiv atins
      if (progress >= 100) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🎉 Felicitări!',
            body: `Ai atins obiectivul de ${goal} pași!`,
            data: { type: 'steps_goal_reached' },
          },
          trigger: null,
        });
      }
      
      // Notificare de motivare dacă progresul este mic
      if (progress < 30 && steps > 0) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '💪 Hai să mergem!',
            body: `Ai făcut ${steps} pași. Mai ai nevoie de ${goal - steps} pentru obiectiv!`,
            data: { type: 'steps_motivation' },
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.log('Notificarea nu a putut fi trimisă (Expo Go limitare):', error);
    }
  }

  static async scheduleReminderNotification() {
    // Notificare de reamintire la 18:00 dacă progresul este mic
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(18, 0, 0, 0);
    
    if (now.getTime() < reminderTime.getTime()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🚶‍♂️ Nu uita de pași!',
          body: 'Mai ai timp să atingi obiectivul zilnic. Hai să mergem!',
          data: { type: 'steps_reminder' },
        },
        trigger: {
          hour: 18,
          minute: 0,
          repeats: false,
        },
      });
    }
  }

  static async registerBackgroundTask() {
    try {
      await BackgroundTask.registerTaskAsync('background-steps-task', async () => {
        try {
          const now = Date.now();
          console.log('Background task executat la:', new Date(now).toLocaleString());
          
          // Simulează o creștere de pași
          const lastData = await NotificationService.getStepsData();
          let currentSteps = 0;
          
          if (lastData) {
            const timeDiff = now - lastData.timestamp;
            const hoursDiff = timeDiff / (1000 * 60 * 60);
            const stepsPerHour = 500; // Simulare
            currentSteps = lastData.steps + Math.floor(hoursDiff * stepsPerHour);
          }
          
          // Salvează datele curente
          await NotificationService.saveStepsData(currentSteps, now);
          
          // Trimite notificări dacă este necesar
          if (currentSteps > 0) {
            await NotificationService.scheduleStepsNotification(currentSteps);
          }
          
          return BackgroundTask.BackgroundTaskResult.Success;
        } catch (error) {
          console.log('Eroare în background task:', error);
          return BackgroundTask.BackgroundTaskResult.Failed;
        }
      });
      
      console.log('Background task înregistrat cu succes');
    } catch (err) {
      console.log('Eroare la înregistrarea background task:', err);
    }
  }

  static async unregisterBackgroundTask() {
    try {
      await BackgroundTask.unregisterTaskAsync('background-steps-task');
      console.log('Background task dezînregistrat');
    } catch (err) {
      console.log('Eroare la dezînregistrarea background task:', err);
    }
  }

  static async getBackgroundTaskStatus() {
    try {
      const isAvailable = await BackgroundTask.isAvailableAsync();
      return isAvailable ? 'available' : 'denied';
    } catch (err) {
      return 'unknown';
    }
  }

  static async saveStepsData(steps: number, timestamp: number) {
    try {
      const data = {
        steps,
        timestamp,
        date: new Date(timestamp).toISOString().split('T')[0],
      };
      
      await AsyncStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.log('Eroare la salvarea datelor de pași:', error);
    }
  }

  static async getStepsData() {
    try {
      const data = await AsyncStorage.getItem(STEPS_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log('Eroare la citirea datelor de pași:', error);
      return null;
    }
  }
}

// Funcție pentru a porni background task manual (pentru testare)
export const startBackgroundTask = async () => {
  try {
    await BackgroundTask.startTaskAsync('background-steps-task');
    console.log('Background task pornit manual');
  } catch (error) {
    console.log('Eroare la pornirea background task:', error);
  }
}; 