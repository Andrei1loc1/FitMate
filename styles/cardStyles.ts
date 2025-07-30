import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 10,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)', // Consider replacing with COLORS.CardBackground + opacity if needed
    shadowColor: COLORS.GreenPrimary, // green glow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 90,
  },
});

export const buttonStyles = StyleSheet.create({
  button: {
    borderRadius: 14,
    padding: 8,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    shadowColor: COLORS.GreenPrimary, // green glow
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 90,
  },
});
export const button2Styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    padding: 8,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#2C9474', 
    shadowColor: COLORS.GreenPrimary, // green glow
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 90,
  },
});

export const inputStyles = StyleSheet.create({
  input: {
    borderRadius: 14,
    padding: 10,
    borderColor: 'rgba(183, 179, 179, 0.44)',
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export const SettingsStyles = StyleSheet.create({
  button: {
    borderRadius: 18,
    padding: 8,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    shadowColor: '#1F2937',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 90,
  },
});

export const chatCardStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    shadowColor: COLORS.GreenPrimary, // green glow
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 90,
  },
});

export const SugestioncardStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 20,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.10)',
    shadowColor: COLORS.GreenPrimary, // green glow
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 90,
  },
});

export const daycardStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    shadowColor:'#1F2937', // green glow
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 90,
  },
});

export const solidCard = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 10,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 0,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  card_transparent: {
    borderRadius: 14,
    padding: 10,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 0,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.58)',
  },
  gym_card: {
    borderRadius: 14,
    padding: 0,
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
}); 
