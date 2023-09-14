import {TouchableOpacity, Text, Keyboard, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import useAuthStore from '../../Store/authStore';
import Loading from '../conponents/Loading';

export default function UISubmit({
  submit,
  setErrorMessage,
  clearInput,
  email,
  password,
  name,
  image,
}) {
  const [isVisible, setisVisible] = useState(false);
  const navigation = useNavigation();
  const {register} = useAuthStore();
  const handleSignUp = async () => {
    Keyboard.dismiss();
    setisVisible(true);
    try {
      await register(email, password, name, image);
      setisVisible(false);
      await Alert.alert('Thông báo!', 'Đăng ký thành công', [
        {
          text: 'OK',
          onPress: () => {
            clearInput();
            navigation.replace('Loading');
          },
        },
      ]);
    } catch (error) {
      console.log(error);
      setisVisible(false);
      switch (error) {
        case 'auth/email-already-in-use':
          setErrorMessage('Email đã tồn tại');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Email không hợp lệ');
          break;
        case 'auth/weak-password':
          setErrorMessage('Mật khẩu phải lớn hơn 6 kí tự');
          break;
        default:
          setErrorMessage('Lỗi không xác định');
          break;
      }
    }
  };

  return (
    <>
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
      <Loading isVisible={isVisible} />
    </>
  );
}
