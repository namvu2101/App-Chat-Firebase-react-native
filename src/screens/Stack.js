import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PaperProvider} from 'react-native-paper';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Login from './Login';
import Register from './Register';
import Settings from './Settings';
import Home from './Home/Index';
import LoadingScreen from './Loading';
import {auth} from '../../api/firebaseConfig';
import UserProfile from './User/Index';
import Index from './Friend/Index';
import Chat from './Chat/Index';
import GroupChat from './GroupChat/Index';
import Group_Message from './GroupChat/Group_Message';
import Test from '../Test';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator initialRouteName="Home" screenOptions={{headerShown: false}}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="facebook-messenger"
              color={color}
              size={size}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Calls"
        component={Calls}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="phone-in-talk-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
     */}
      <Tab.Screen
        name="Friend"
        component={Index}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Group"
        component={GroupChat}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default function StackNavigation() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={auth().currentUser ? 'Loading' : 'Login'}
          screenOptions={{headerTitleAlign: 'center'}}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{headerTitle: 'Create your account'}}
          />
          <Stack.Screen
            name="Loading"
            component={LoadingScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Tabs"
            component={MyTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={UserProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Chat" component={Chat} />

          <Tab.Screen name="Group_Message" component={Group_Message} />
          <Stack.Screen
            name="Settings"
            component={Settings}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Test"
            component={Test}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({});
