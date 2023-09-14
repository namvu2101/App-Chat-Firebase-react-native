import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../Store/authStore';
import Loading from '../conponents/Loading';

export default function Login() {
  const { login } = useAuthStore();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('123456');
  const [sercure, setSercure] = useState(true);
  const [submit, setSubmit] = useState(false);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (email.length === 0 || password.length === 0) {
      setSubmit(false);
    } else {
      setSubmit(true);
    }
    setErrorMessage('');
  }, [email, password]);

  const handleLogin = async () => {
    setIsVisible(true);

    try {
      await login(email, password, navigation);
      setIsVisible(false);
    } catch (error) {
      console.log(error);
      setIsVisible(false);

      switch (error) {
        case 'auth/wrong-password':
          setErrorMessage('Bạn nhập sai mật khẩu');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Vui lòng thử lại sau ít phút');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Email không đúng định dạng');
          break;
        case 'auth/user-not-found':
          setErrorMessage('Email không tồn tại');
          break;
        case 'auth/network-request-failed':
          setErrorMessage('Không có kết nối Internet');
          break;
        default:
          setErrorMessage('Lỗi không xác định');
          break;
      }
    }
  };

  const onClose = () => {
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Text>Welcome</Text>
        <Text style={styles.boldText}>
          Log in to Chatbox
        </Text>
        <Text
          style={styles.centeredText}>
          Welcome back! Sign in using your social account or email to continue us
        </Text>
        <TextInput
          style={styles.input}
          label="Email"
          keyboardType="email-address"
          textColor="#000000"
          value={email}
          onChangeText={setEmail}></TextInput>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
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
        <Text style={styles.errorText}>{errorMessage}</Text>

        <View style={styles.horizontalLine}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>
        {/* Social Icon */}
        <View style={styles.socialIconsContainer}>
          <Pressable style={styles.socialIcon} >
            <MaterialCommunityIcons
              name="facebook"
              color={'#1877F2'}
              size={28}
            />
          </Pressable>
          <Pressable style={styles.socialIcon}>
            <Image
              source={require('../../../assets/Logo/google.png')}
              style={styles.socialImage}
              resizeMode="contain"
            />
          </Pressable>
          <Pressable style={styles.socialIcon}>
            <MaterialCommunityIcons name="apple" color={'#000'} size={28} />
          </Pressable>
        </View>
      </View>

      <View style={styles.centered}>
        <Pressable
          onPress={handleLogin}
          disabled={!submit}
          style={[
            styles.loginButton,
            {
              backgroundColor: submit ? '#24786D' : '#F3F6F6',
            },
          ]}>
          <Text style={{ color: submit ? '#FFFFFF' : '#24786D' }}>Login</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.redText}>Sign Up if you don't have an account?</Text>
        </Pressable>
      </View>

      <Loading isVisible={isVisible} onClose={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-around',
  },
  centered: {
    alignItems: 'center',
  },
  boldText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredText: {
    textAlign: 'center',
    color: '#797C7B',
    marginHorizontal: 20,
  },
  input: {
    width: 327,
    backgroundColor: '#FFFFFF',
    height: 58,
    marginTop: 20,
  },
  errorText: {
    color: 'red',
  },
  horizontalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    height: 0.5,
    backgroundColor: '#000000',
    width: 80,
    marginHorizontal: 10,
  },
  orText: {
    color: '#000000',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
  },
  socialIcon: {
    borderColor: '#000',
    borderWidth: 0.5,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialImage: {
    height: 25,
    width: 25,
  },
  loginButton: {
    height: 48,
    width: 300,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  redText: {
    color: 'red',
  },
});
