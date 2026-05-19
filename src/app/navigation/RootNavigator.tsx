import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../../shared/theme/colors';
import { CustomTabBar } from './CustomTabBar';

// Screens
import { RingScreen } from '../../features/ring/screens/RingScreen';
import { RingDetailScreen } from '../../features/ring/screens/RingDetailScreen';
import { TaskRecordingModal } from '../../features/ring/screens/TaskRecordingModal';
import { ProjectsListScreen } from '../../features/projects/screens/ProjectsListScreen';
import { ProjectOutlineScreen } from '../../features/projects/screens/ProjectOutlineScreen';
import { NewProjectScreen } from '../../features/projects/screens/NewProjectScreen';
import { ArchivedRingScreen } from '../../features/archive/screens/ArchivedRingScreen';

// Placeholder screens
function PlaceholderScreen({ label }: { label: string }) {
  const { View, Text, StyleSheet } = require('react-native');
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: colors.textSecondary, fontSize: 16 }}>
        {label}
      </Text>
      <Text style={{ color: colors.textTertiary, fontSize: 13, marginTop: 8 }}>
        Coming Soon
      </Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function RingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RingMain" component={RingScreen} />
      <Stack.Screen name="RingDetail" component={RingDetailScreen} />
      <Stack.Screen
        name="TaskRecordingModal"
        component={TaskRecordingModal}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

function ProjectsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProjectsList" component={ProjectsListScreen} />
      <Stack.Screen name="ProjectOutline" component={ProjectOutlineScreen} />
      <Stack.Screen name="RingDetail" component={RingDetailScreen} />
      <Stack.Screen name="ArchivedRing" component={ArchivedRingScreen} />
    </Stack.Navigator>
  );
}

function BottomTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Ring" component={RingStack} />
      <Tab.Screen name="Projects" component={ProjectsStack} />
      <Tab.Screen name="New" component={RingStack} />
      <Tab.Screen name="Identity">
        {() => <PlaceholderScreen label="Identity" />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <PlaceholderScreen label="Profile" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabs} />
        <Stack.Screen
          name="NewProjectModal"
          component={NewProjectScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
