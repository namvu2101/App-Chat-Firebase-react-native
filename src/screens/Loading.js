import React, {useLayoutEffect, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {auth} from '../../api/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserdata, logout} from '../../api/actions';
import {UserStore} from '../Store/store';

const LoadingScreen = ({navigation}) => {
  const isFocused = useIsFocused();
  const userState = UserStore(state => state.user);

  useLayoutEffect(() => {
    const checkUser = async () => {
      const uid = await AsyncStorage.getItem('uid');
      const user = auth().currentUser;
      try {
        getUserdata(uid);
        if (user && isFocused) {
          setTimeout(() => {
            navigation.replace('Tabs');
          }, 1000);
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUser();
  }, [isFocused]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default LoadingScreen;
