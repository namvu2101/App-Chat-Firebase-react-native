import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  Pressable
} from 'react-native';
import React, {useEffect, useState,useLayoutEffect} from 'react';
import {TextInput,Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {creatProfile} from '../../api/actions';
import {UserStore} from '../Store/store';
import {auth} from '../../api/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal_Profile from './Modals/Modal_Profile';

export default function Register() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setisVisible] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(
    'https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?w=234&h=204&c=7&r=0&o=5&pid=1.7',
  );
  const [confirmpassword, setConfirmPassword] = useState('');
  const [confirmsercure, setConfirmSercure] = useState(true);
  const [sercure, setSercure] = useState(true);
  const [submit, setSubmit] = useState(false);
  const errorMessage = UserStore(state => state.error);
  const [type, setType] = useState('');

  const onClose = () => {
    setisVisible(false);
  };
  useEffect(() => {
    if (email == '' || password == '' || name == '' || confirmpassword == '') {
      setSubmit(false);
    } else {
      setSubmit(true);
    }
  }, [email, password, name, confirmpassword]);
  useLayoutEffect(()=>{
    UserStore.setState({error: null});
  },[navigation])
  const clearInput=()=>{
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setName('')
  }
  const handleSignUp = () => {
    Keyboard.dismiss();
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async userCredential => {
        const id = userCredential.user.uid;
        AsyncStorage.setItem('uid', id);
        creatProfile(id, name, image);
        Alert.alert('Thông báo!', 'Đăng ký thành công', [
          {
            text: 'OK',
            onPress: () => {
              clearInput()
              navigation.replace('Loading');
            },
          },
        ]);
      })
      .catch(e => {
        switch (e.code) {
          case 'auth/email-already-in-use':
            UserStore.setState({error: 'Email đã tồn tại', loading: false});
            break;
          case 'auth/invalid-email':
            UserStore.setState({error: 'Email không hợp lệ', loading: false});
            break;
          case 'auth/weak-password':
            UserStore.setState({
              error: 'Mật khẩu phải lớn hơn 6 kí tự',
              loading: false,
            });
            break;
          default:
            UserStore.setState({error: e, loading: false});
            break;
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text_color, {fontSize: 16, fontWeight: 'bold'}]}>
        Sign up with Email
      </Text>
      <Text
        style={{
          textAlign: 'center',
          color: '#797C7B',
          marginHorizontal: 20,
          marginVertical: 10,
        }}>
        Get chatting with friends and family today by signing up for our chat
        app!
      </Text>
      <Pressable
        onPress={() => {
          setType('Avatar');
          setisVisible(true);
        }}
        style={styles.profileSection}>
        <Avatar.Image
          source={{
            uri: image,
          }}
          size={70}
        />
      </Pressable>
      <KeyboardAwareScrollView>
        <TextInput
          style={styles.input}
          label="Your name"
          textColor="#000000"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          label="Your Email"
          keyboardType="email-address"
          textColor="#000000"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
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
        <TextInput
          style={styles.input}
          value={confirmpassword}
          onChangeText={setConfirmPassword}
          label="Confirm Password"
          secureTextEntry={confirmsercure}
          textColor="#000000"
          right={
            <TextInput.Icon
              icon={confirmsercure ? 'eye' : 'eye-off'}
              onPress={() => {
                setConfirmSercure(!confirmsercure);
              }}
              color={'#000000'}
            />
          }
        />
        <Text style={{color: 'red'}}>{errorMessage}</Text>
      </KeyboardAwareScrollView>

      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          disabled={!submit}
          onPress={handleSignUp}
          style={{
            backgroundColor: submit ? '#24786D' : '#F3F6F6',
            height: 48,
            width: 300,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <Text style={{color: submit ? '#FFFFFF' : '#24786D'}}>
            Create an account
          </Text>
        </TouchableOpacity>
      </View>
      <Modal_Profile
        isVisible={isVisible}
        onClose={onClose}
        image={image}
        setImage={setImage}
        type={type}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 30,
  },
  text_color: {
    color: '#000000',
  },
  input: {
    width: 327,
    backgroundColor: '#FFFFFF',
    height: 58,
    marginTop: 20,
  },
});
