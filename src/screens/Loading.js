import React, {useLayoutEffect, useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {auth} from '../firebase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useProfileStore} from '../Store/profileStore';
import {useListMessage} from '../Store/list_messageStore';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator, Avatar, ProgressBar} from 'react-native-paper';

const LoadingScreen = ({navigation}) => {
  const {getList, list} = useListMessage();
  const isFocused = useIsFocused();
  const {getData} = useProfileStore();
  const [progress, setProgress] = React.useState(0);
  useLayoutEffect(() => {
    const checkUserAndRedirect = async () => {
      const uid = await AsyncStorage.getItem('uid');
      const user = auth().currentUser;

      try {
        getData(uid);
        getList(uid);

        if (user && isFocused) {
          let newProgress = 0;
          const intervalId = setInterval(() => {
            newProgress += 0.1;
            setProgress(newProgress);

            if (newProgress >= 1) {
              clearInterval(intervalId);
              navigation.replace('Tabs');
            }
          }, 200);

          return () => {
            clearInterval(intervalId);
          };
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkUserAndRedirect();
  }, [isFocused]);

  return (
    <LinearGradient
      colors={['#3777F0', '#FFFFFF']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}>
      <Avatar.Image source={require('../../assets/iconapp.jpg')} size={88} />
      <ProgressBar
        progress={progress}
        color={'#FFFFFF'}
        style={{
          height: 10,
          width: 150,
          borderRadius: 5,
          backgroundColor: '#477FEE',
          marginVertical:10
        }}
      />
    </LinearGradient>
  );
};

export default LoadingScreen;
