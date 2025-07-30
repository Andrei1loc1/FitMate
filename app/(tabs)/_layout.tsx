import { Tabs } from 'expo-router';
import React from 'react';
import TabIcon from '../../components/TabIcon';
import { icons } from '@/constants/icons';

const tabList = [
  { name: 'index', icon: icons.home, title: 'Home' },
  { name: 'AIchat', icon: icons.robot, title: 'AI Chat' },
  { name: 'workout', icon: icons.gym, title: 'Workout' },
  { name: 'meals', icon: icons.chef, title: 'Meals' },
  { name: 'profile', icon: icons.user, title: 'Profile' },
];

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#1F2937',
          borderRadius: 0,
          marginHorizontal: 0,
          paddingHorizontal: 10,
          paddingTop: 15,
          marginBottom: 0,
          height: 80,
          position: 'absolute',
          borderWidth: 0,
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          flex: 1,
          minWidth: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        // Animații simple pentru tranziții între tab-uri
        // animation: 'slide_from_right',
        // animationDuration: 300,
      }}
    >
      {tabList.map((tab, idx) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={tab.icon}
                title={tab.title}
                isFirst={idx === 0}
                isLast={idx === tabList.length - 1}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default _layout;
