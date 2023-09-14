import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {TextInput, Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import Modal_Profile from '../User/Modal_Avatar';
import UISubmit from './UISubmit';

export default function Register() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setisVisible] = useState(false);
  const [visibleLoad, setVisibleLoad] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState(
    'https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?w=234&h=204&c=7&r=0&o=5&pid=1.7',
  );
  const [confirmpassword, setConfirmPassword] = useState('');
  const [confirmsercure, setConfirmSercure] = useState(true);
  const [sercure, setSercure] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
    if (password != confirmpassword) {
      setErrorMessage('confirmpassword wrong');
    } else setErrorMessage('');
  }, [email, password, name, confirmpassword]);

  const clearInput = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{alignItems: 'center'}}>
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

        <View style={{alignItems: 'center'}}>
          <UISubmit
            name={name}
            image={image}
            email={email}
            password={password}
            submit={submit}
            setErrorMessage={setErrorMessage}
            clearInput={clearInput}
          />
        </View>
      </KeyboardAvoidingView>
      <Modal_Profile
        isVisible={isVisible}
        onClose={onClose}
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
    justifyContent: 'space-evenly',
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
