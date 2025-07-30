import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

interface TabIconProps {
  focused: boolean;
  icon: any;
  title: string;
  isFirst?: boolean;
  isLast?: boolean;
}

const TabIcon = ({ focused, icon, title, isFirst, isLast }: TabIconProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (focused) {
      // Enhanced focus animation
      scale.value = withSpring(1.15, {
        damping: 12,
        stiffness: 200,
      });
      opacity.value = withTiming(1, { duration: 300 });
      rotation.value = withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );
      glowOpacity.value = withTiming(1, { duration: 400 });
      
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(0.6, { duration: 200 });
      glowOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const iconSize = focused ? 20 : 18;
  const textSize = focused ? 12 : 0;
  const minWidth = focused ? 85 : 40;
  const paddingHorizontal = focused ? 12 : 0;
  const activeColor = '#23D167'; // Enhanced green
  const inactiveColor = '#9EA5B1';

  if (focused) {
    return (
      <Animated.View style={[glowStyle, {
        shadowColor: activeColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
      }]}>
        <BlurView intensity={15} style={{
          flexDirection: 'row',
          minWidth: 85,
          minHeight: 48,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          paddingHorizontal: 12,
          borderRadius: 20,
          backgroundColor: 'rgba(11, 22, 223, 0.08)',
          borderWidth: 0,
          borderColor: 'rgba(35, 209, 103, 0.3)',
        }}>
          <LinearGradient
            colors={['rgba(35, 209, 103, 0.1)', 'rgba(35, 209, 103, 0.05)']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 20,
            }}
          />
          <Animated.View style={animatedStyle}>
            <Image 
              source={icon} 
              style={{ 
                width: iconSize, 
                height: iconSize, 
                tintColor: "white",
                shadowColor: activeColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.5,
                shadowRadius: 4,
              }} 
            />
          </Animated.View>
          <Text
            style={{
              color: "white",
              fontWeight: '700',
              fontSize: textSize,
              marginLeft: 8,
            }}
          >
            {title}
          </Text>
        </BlurView>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          minWidth,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <Image 
        source={icon} 
        style={{ 
          width: iconSize, 
          height: iconSize, 
          tintColor: inactiveColor,
          opacity: 0.7,
        }} 
      />
    </Animated.View>
  );
};

export default TabIcon;
