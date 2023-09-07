import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Avatar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {db, storage} from '../../../api/firebaseConfig';
import {UserStore} from '../../Store/store';
import {firebase} from '@react-native-firebase/firestore';
import List_Message from './List_Message';
import {launchImageLibrary} from 'react-native-image-picker';
import uuid from 'react-native-uuid';
export default function Group_Message({route}) {
  const navigation = useNavigation();
  const [inputText, setInputText] = useState('');
  const [checkData, setcheckData] = useState();
  const userState = UserStore(state => state.user);
  const [messages, setMessages] = useState([]);
  const item = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'left',
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar.Image size={49} source={{uri: item.avatar}} />
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 20,
              marginHorizontal: 10,
            }}>
            {item.name}
          </Text>
        </View>
      ),
      headerRight: () => (
        <>
          <TouchableOpacity onPress={() => alert('video call')}>
            <Avatar.Icon
              size={45}
              icon="video"
              style={{backgroundColor: '#fff'}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('call')}>
            <Avatar.Icon
              size={40}
              icon="phone"
              style={{backgroundColor: '#fff'}}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Avatar.Icon
              size={40}
              icon="information"
              style={{backgroundColor: '#fff'}}
            />
          </TouchableOpacity>
        </>
      ),
    });
  }, [route]);

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('Chats')
      .doc(item.id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          const message = {
            id: documentSnapshot.id,
            data: documentSnapshot.data(),
          };
          data.push(message);
        });

        setMessages(data);
      });

    return () => unsubscribe();
  }, [item]);

  useLayoutEffect(() => {
    const unsubscribe = async () => {
      const user = await db.collection('Chats').doc(item.id).get();
      setcheckData(user.data());
    };
    unsubscribe();
  }, [item]);
  ///////////////////////////////////

  //////////////////////
  const onSendMessage = async (messageType, imageUri) => {
    Keyboard.dismiss();
    setInputText('');
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const formData = {
      timestamp,
      senderId: userState.id,
      avatar: userState.avatar,
      name: userState.name,
    };

    if (messageType === 'image') {
      formData.messageType = 'image'; // Use assignment '=' instead of '()'
      formData.photo = imageUri;
      formData.messageText = 'send photo';
    } else {
      formData.messageType = 'text'; // Use assignment '=' instead of '()'
      formData.messageText = inputText;
    }
    if (item.type === 'Person') {
      const chatIds = [
        `${userState.id}-${item.reciverID}`,
        `${item.reciverID}-${userState.id}`,
      ];

      const updateTimestamps = chatIds.map(chatId => {
        const chatRef = db.collection('Chats').doc(chatId);
        return chatRef.set({
          type: 'Person',
          timestamp,
          member_id:
            chatId === `${userState.id}-${item.reciverID}`
              ? userState.id
              : item.reciverID,
          name:
            chatId === `${userState.id}-${item.reciverID}`
              ? item.name
              : userState.name,
          avatar:
            chatId === `${userState.id}-${item.reciverID}`
              ? item.avatar
              : userState.avatar,
          reciverID:
            chatId === `${userState.id}-${item.reciverID}`
              ? item.reciverID
              : userState.id,
        });
      });

      const sendMessagePromises = chatIds.map(chatId => {
        const messageRef = db
          .collection('Chats')
          .doc(chatId)
          .collection('messages')
          .add(formData);

        return messageRef;
      });

      await Promise.all([...updateTimestamps, ...sendMessagePromises]);
    } else {
      db.collection('Chats').doc(item.id).collection('messages').add(formData);
    }
  };
  const pickImage = async () => {
    const id = uuid.v4()
    const reference = storage().ref(`Chats/${item.id}/Files/${id}`);
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
        try {
          const pathToFile = response.assets[0].uri; // Use 'response.uri' directly
          // Upload the file to Firebase Storage
          reference
            .putFile(pathToFile)
            .then(async () => {
              const downloadURL = await reference.getDownloadURL();
              // Log đường dẫn URL ra console
              console.log('Send image successfully!');
              onSendMessage('image', downloadURL);
            })
            .catch(error => {
              console.error('Error uploading image:', error);
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  return (
    <View style={styles.container}>
      <FlatList
        inverted
        showsVerticalScrollIndicator={false}
        data={messages}
        renderItem={({item}) => (
          <List_Message item={item.data} userId={userState.id} />
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={text => setInputText(text)}
          placeholder="Type a message..."
          placeholderTextColor={'#ccc'}
        />
        <TouchableOpacity onPress={pickImage}>
          <Avatar.Icon
            size={35}
            icon="image"
            style={styles.buttonContainer}
            color="#2C6BED"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSendMessage('text')}>
          <Avatar.Icon
            size={35}
            icon="send"
            style={styles.buttonContainer}
            color="#2C6BED"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#2C6BED',
    marginRight: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: 'black',
  },
  buttonContainer: {
    backgroundColor: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 10,
  },
});
