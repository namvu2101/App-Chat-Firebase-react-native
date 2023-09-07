import {View, Text, Pressable} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Button} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import ListAvatar from '../User/ListAvatar';
import {storage} from '../../../api/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Modal_Profile({
  isVisible,
  onClose,
  setImage,
  type,
  setDate,
}) {
  const [newdate, setNewDate] = useState(new Date());

  const updateDateofBirth = () => {
    setDate(
      newdate.getDate() +
        '/' +
        (newdate.getMonth() + 1) +
        '/' +
        newdate.getFullYear(),
    );
    onClose();
  };

  const handlePickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const pathToFile = response.assets[0].uri;
        saveImage(pathToFile);
        onClose();
      }
    });
  };
  const saveImage = async image => {
    const uid = await AsyncStorage.getItem('uid');
    const reference = storage().ref(`Users/Avatar/${uid}`);
    try {
      reference.putFile(image).then(async () => {
        const downloadURL = await reference.getDownloadURL();
        setImage(downloadURL);
      });
    } catch (error) {}
  };
  return (
    <Modal
      animationOutTiming={500}
      isVisible={isVisible}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}
      style={{margin: 0}}>
      {type === 'Date_of_birth' ? (
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          <DatePicker
            textColor="black"
            mode="date"
            locale="vn"
            date={newdate}
            onDateChange={setNewDate}
            androidVariant="nativeAndroid"
            onConfirm={date => {
              setNewDate(date);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'flex-end',
            }}>
            <Button textColor="#2C6BED" onPress={onClose}>
              Cancel
            </Button>
            <Button textColor="#2C6BED" onPress={updateDateofBirth}>
              Ok
            </Button>
          </View>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#fff',
            alignItems: 'center',
            paddingVertical: 20,
          }}>
          <Button mode="contained" onPress={handlePickImage}>
            Select From Galery
          </Button>
          <ListAvatar setImage={setImage} onClose={onClose} />
        </View>
      )}
    </Modal>
  );
}
