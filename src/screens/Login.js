import {
    StyleSheet,
    Text,
    View,
    Pressable,
    Image,
    Alert,
    KeyboardAvoidingView,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
  import {TextInput} from 'react-native-paper';
  import {useNavigation} from '@react-navigation/native';
  import {UserStore} from '../Store/store';
  import {auth} from '../../api/firebaseConfig';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [sercure, setSercure] = useState(true);
    const [submit, setSubmit] = useState(false);
    const navigation = useNavigation();
    const errorMessage = UserStore(state => state.error);
    useEffect(() => {
      if (email.length == 0 || password.length == 0) {
        setSubmit(false);
      } else {
        UserStore.setState({error: null});
        setSubmit(true);
      }
    }, [email, password]);
  
    const handleLogin = async () => {
      setEmail('')
      setPassword('')
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('Login Success');
          AsyncStorage.setItem('uid',auth().currentUser.uid)
          navigation.replace('Loading')
        })
        .catch(e => {
          switch (e.code) {
            case 'auth/wrong-password':
              UserStore.setState({
                loading: false,
                error: 'Bạn nhập sai mật khẩu',
              });
              break;
            case 'auth/too-many-requests':
              UserStore.setState({
                loading: false,
                error: 'Vui lòng thử lại sau ít phút',
              });
              break;
            case 'auth/invalid-email':
              UserStore.setState({
                loading: false,
                error: 'Email không đúng định dạng',
              });
              break;
            case 'auth/user-not-found':
              UserStore.setState({loading: false, error: 'Email không tồn tại'});
              break;
            case ' auth/network-request-failed':
              UserStore.setState({
                loading: false,
                error: 'Không có kết nối Internet',
              });
              break;
  
            default:
              UserStore.setState({loading: false, error: 'Lỗi không xác định'});
              break;
          }
        });
    };
    
    return (
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Text>Welcome</Text>
          <Text style={[styles.text_color, {fontSize: 16, fontWeight: 'bold'}]}>
            Log in to Chatbox
          </Text>
          <Text
            style={{textAlign: 'center', color: '#797C7B', marginHorizontal: 20}}>
            Welcome back! Sign in using your social account or email to continue
            us
          </Text>
          <TextInput
            style={{
              width: 327,
              backgroundColor: '#FFFFFF',
              height: 58,
              marginTop: 20,
            }}
            label="Email"
            keyboardType="email-address"
            textColor="#000000"
            value={email}
            onChangeText={setEmail}></TextInput>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={{
              width: 327,
              backgroundColor: '#FFFFFF',
              height: 58,
              marginTop: 20,
            }}
            label="Password"
            secureTextEntry={sercure}
            textColor="#000000"
            right={
              <TextInput.Icon
                icon={sercure ? 'eye' : 'eye-off'}
                onPress={() => {
                  setSercure(!sercure);
                }}
                color={'#000000'}
              />
            }
          />
          <Text style={{color: 'red'}}>{errorMessage}</Text>
  
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 30,
            }}>
            <View style={styles.line} />
            <Text style={{color: '#000000'}}>OR</Text>
            <View style={styles.line} />
          </View>
          {/* Social ICon */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: 200,
            }}>
            <Pressable style={styles.social_ic}>
              <MaterialCommunityIcons
                name="facebook"
                color={'#1877F2'}
                size={28}
              />
            </Pressable>
            <Pressable style={styles.social_ic}>
              <Image
                source={require('../../assets/Logo/google.png')}
                style={{height: 25, width: 25}}
                resizeMode="contain"
              />
            </Pressable>
            <Pressable style={styles.social_ic}>
              <MaterialCommunityIcons name="apple" color={'#000'} size={28} />
            </Pressable>
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <Pressable
            onPress={handleLogin}
            disabled={!submit}
            style={[
              styles.btn,
              {
                backgroundColor: submit ? '#24786D' : '#F3F6F6',
              },
            ]}>
            <Text style={{color: submit ? '#FFFFFF' : '#24786D'}}>Login</Text>
          </Pressable>
          <Pressable onPress={()=>navigation.navigate('Register')}>
            <Text style={{color: 'red'}}>Sign Up if you dont have account ?</Text>
          </Pressable>
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
      justifyContent: 'space-around',
    },
    text_color: {
      color: '#000',
    },
    social_ic: {
      borderColor: '#000',
      borderWidth: 0.5,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    line: {
      height: 0.5,
      backgroundColor: '#000000',
      width: 80,
      marginHorizontal: 10,
    },
    btn: {
      height: 48,
      width: 300,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
  });
  