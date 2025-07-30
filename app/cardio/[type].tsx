import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { icons } from '@/constants/icons';
import React, { useState, useRef, useEffect } from 'react';
import type { LocationObjectCoords } from 'expo-location';
import { cardStyles, SettingsStyles, solidCard } from '@/styles/cardStyles';
import { buttonStyles, button2Styles } from '@/styles/cardStyles';
import { COLORS } from '@/constants/colors';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import DashCard from '@/components/DashCard';

// Dark map style (Google Maps style array)
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'poi.park', elementType: 'labels.text.stroke', stylers: [{ color: '#1b1b1b' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
  { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#4e4e4e' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] }
];

const cardioData = {
  walking: {
    title: 'Walking',
    goal: 5000,
    unit: 'pași',
    icon: icons.walking,
    description: 'Mersul pe jos este excelent pentru sănătate!'
  },
  running: {
    title: 'Running',
    goal: 3000,
    unit: 'metri',
    icon: icons.running,
    description: 'Alergatul îți crește rezistența și arde calorii.'
  },
  cycling: {
    title: 'Cycling',
    goal: 10000,
    unit: 'metri',
    icon: icons.cycling,
    description: 'Ciclismul este perfect pentru anduranță și picioare puternice.'
  }
} as const;

type CardioType = keyof typeof cardioData;

// Haversine distance in km
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateTotalDistance(path: { latitude: number; longitude: number }[]): number {
  let total = 0;
  for (let i = 1; i < path.length; i++) {
    total += haversineDistance(
      path[i - 1].latitude,
      path[i - 1].longitude,
      path[i].latitude,
      path[i].longitude
    );
  }
  return total;
}

export default function CardioDetail() {
  const params = useLocalSearchParams();
  let type: string = params.type as string;
  if (Array.isArray(type)) type = type[0];
  const validType: CardioType = (['walking','running','cycling'].includes(type) ? type : 'walking') as CardioType;
  const data = cardioData[validType];

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const interval = useRef<number | null>(null);

  const start = async () => {
    if (!running) {
      setRunning(true);
      interval.current = setInterval(() => setSeconds(s => s + 1), 1000) as unknown as number;
      // Start location tracking
      if (location) setPath([location]);
      try {
        locationWatchId.current = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, timeInterval: 2000, distanceInterval: 5 },
          (loc) => {
            setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
            setPath(prev => [...prev, { latitude: loc.coords.latitude, longitude: loc.coords.longitude }]);
          }
        ) as unknown as number;
      } catch (e) {
        setLocationError('Location tracking error');
      }
    }
  };
  const stop = () => {
    setRunning(false);
    if (interval.current) clearInterval(interval.current);
    // Stop location tracking
    if (locationWatchId.current !== null) {
      try { (locationWatchId.current as any).remove(); } catch {}
      locationWatchId.current = null;
    }
  };
  const reset = () => {
    setSeconds(0);
    setRunning(false);
    if (interval.current) clearInterval(interval.current);
    setPath([]);
    // Stop location tracking
    if (locationWatchId.current !== null) {
      try { (locationWatchId.current as any).remove(); } catch {}
      locationWatchId.current = null;
    }
  };

  useEffect(() => {
    return () => { if (interval.current) clearInterval(interval.current); };
  }, []);

  // Location state
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [path, setPath] = useState<{ latitude: number; longitude: number }[]>([]);
  const locationWatchId = useRef<number | null>(null);

  const [locationError, setLocationError] = useState('');

  const distanceKm = calculateTotalDistance(path); // already in km
  const timeHours = seconds / 3600; // convert seconds to hours
  const speed = timeHours > 0 ? distanceKm / timeHours : 0;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission not granted');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    })();
    // Cleanup watcher on unmount
    return () => {
      if (locationWatchId.current !== null) {
        Location.stopLocationUpdatesAsync('cardioTracking');
      }
    };
  }, []);

  return (
    <View className="flex-1 bg-[#1F2937]">
      {/* Header with close button */}
      <View className="flex-row justify-between items-center px-4 pt-8">
        <View />
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-8 h-8 bg-gray-700 rounded-full justify-center items-center"
        >
          <Text className="text-white text-lg font-bold">×</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-1 items-center px-4">
        {/* Map Section */}
        <View className="w-full h-[300px] rounded-2xl overflow-hidden mt-2 mb-4 bg-card">
          {location ? (
            <MapView
              style={{ flex: 1 }}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
              customMapStyle={darkMapStyle}
            >
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
              {path.length > 1 && (
                <Polyline
                  coordinates={path}
                  strokeColor="#23D167"
                  strokeWidth={4}
                />
              )}
            </MapView>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-400">
                {locationError ? locationError : 'Locating...'}
              </Text>
            </View>
          )}
        </View>
        
        <View style={[solidCard.card, { width: '100%' }]} className="mb-8 items-center">
          <Image source={data.icon} style={{ width: 50, height: 50 }} tintColor="white" className="mb-6" />
          <Text className="text-white text-2xl font-bold mb-2">{data.title}</Text>
          <View style={cardStyles.card} className="flex justify-center items-center mb-6 w-[80%]">
            <Text className="text-white text-4xl" style={{ fontVariant: ['tabular-nums'] }}>{Math.floor(seconds/60).toString().padStart(2,'0')}:{(seconds%60).toString().padStart(2,'0')}</Text>
          </View>
          <View className="flex-row justify-center items-center w-full gap-4">
            <View style={cardStyles.card} className="flex justify-center items-center mb-6 w-[45%]">
              <Text className="text-white text-base">Distance</Text>
              <Text className="text-green-400 text-lg">{parseFloat(calculateTotalDistance(path).toFixed(2))} km</Text>
            </View>
            <View style={cardStyles.card} className="flex justify-center items-center mb-6 w-[45%]">
              <Text className="text-white text-base">Medium speed</Text>
              <Text className="text-blue-400 text-lg">{speed.toFixed(2)} km/h</Text>
            </View>
          </View>
          <View className="flex-col justify-center items-center mb-2 w-full">
            <TouchableOpacity onPress={start} style={SettingsStyles.button} className="w-[80%] h-[40px] mb-3 items-center justify-center"> 
              <Text className="text-white font-bold text-base">Start</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={stop} style={SettingsStyles.button} className="w-[80%] h-[40px] mb-3 items-center justify-center"> 
              <Text className="text-white font-bold text-base">Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={reset} style={SettingsStyles.button} className="w-[80%] h-[40px] mb-3 items-center justify-center"> 
              <Text className="text-white font-bold text-base">Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
} 