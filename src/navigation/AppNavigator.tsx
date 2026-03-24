import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import StatsScreen from '../screens/StatsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import OshiFormScreen from '../screens/OshiFormScreen';
import LogFormScreen from '../screens/LogFormScreen';
import LogListScreen from '../screens/LogListScreen';
import LogDetailScreen from '../screens/LogDetailScreen';

import { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabIcon({ label, emoji }: { label: string; emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E91E8C',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#f0f0f0' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'ホーム',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="ホーム" />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: 'カレンダー',
          tabBarIcon: () => <TabIcon emoji="📅" label="カレンダー" />,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: '統計',
          tabBarIcon: () => <TabIcon emoji="📊" label="統計" />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: '設定',
          tabBarIcon: () => <TabIcon emoji="⚙️" label="設定" />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="OshiForm"
          component={OshiFormScreen}
          options={{ presentation: 'modal', headerShown: true, title: '推しを登録' }}
        />
        <Stack.Screen
          name="LogForm"
          component={LogFormScreen}
          options={{ presentation: 'modal', headerShown: true, title: '活動を記録' }}
        />
        <Stack.Screen
          name="LogList"
          component={LogListScreen}
          options={{ headerShown: true, title: '記録一覧' }}
        />
        <Stack.Screen
          name="LogDetail"
          component={LogDetailScreen}
          options={{ headerShown: true, title: '記録詳細' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
