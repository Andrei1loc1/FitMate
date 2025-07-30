import { useState, useEffect, useCallback } from 'react';
import { NotificationService } from '@/services/notificationService';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const useBackgroundNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [backgroundStatus, setBackgroundStatus] = useState<string>('unknown');

  // Inițializează notificările
  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Cere permisiuni
      const granted = await NotificationService.requestPermissions();
      setPermissionsGranted(granted);

             if (granted) {
         // Verifică statusul background task
         const status = await NotificationService.getBackgroundTaskStatus();
         setBackgroundStatus(status);
         setIsEnabled(status === 'available');
       }

      // Configurează listener pentru notificări
      const subscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('Notificare primită:', notification);
      });

      const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Răspuns la notificare:', response);
        // Aici poți adăuga logica pentru a deschide aplicația sau naviga la o pagină specifică
      });

      return () => {
        subscription.remove();
        responseSubscription.remove();
      };
    } catch (error) {
      console.log('Eroare la inițializarea notificărilor:', error);
    }
  };

  const enableBackgroundNotifications = useCallback(async () => {
    try {
      if (!permissionsGranted) {
        const granted = await NotificationService.requestPermissions();
        if (!granted) {
          console.log('Permisiuni notificări refuzate');
          return false;
        }
        setPermissionsGranted(true);
      }

             await NotificationService.registerBackgroundTask();
      setIsEnabled(true);
      setBackgroundStatus('available');
      
      // Programează notificarea de reamintire
      await NotificationService.scheduleReminderNotification();
      
      console.log('Notificări de background activate');
      return true;
    } catch (error) {
      console.log('Eroare la activarea notificărilor:', error);
      return false;
    }
  }, [permissionsGranted]);

  const disableBackgroundNotifications = useCallback(async () => {
    try {
             await NotificationService.unregisterBackgroundTask();
      setIsEnabled(false);
      setBackgroundStatus('denied');
      
      // Șterge toate notificările programate
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      console.log('Notificări de background dezactivate');
      return true;
    } catch (error) {
      console.log('Eroare la dezactivarea notificărilor:', error);
      return false;
    }
  }, []);

  const sendTestNotification = useCallback(async () => {
    try {
      await NotificationService.scheduleStepsNotification(5000, 10000);
      console.log('Notificare de test trimisă');
    } catch (error) {
      console.log('Eroare la trimiterea notificării de test:', error);
    }
  }, []);

  const updateStepsNotification = useCallback(async (steps: number, goal: number = 10000) => {
    try {
      await NotificationService.scheduleStepsNotification(steps, goal);
      await NotificationService.saveStepsData(steps, Date.now());
    } catch (error) {
      console.log('Eroare la actualizarea notificării de pași:', error);
    }
  }, []);

  return {
    isEnabled,
    permissionsGranted,
    backgroundStatus,
    enableBackgroundNotifications,
    disableBackgroundNotifications,
    sendTestNotification,
    updateStepsNotification,
  };
}; 