import {StyleSheet, Text, View, Pressable, FlatList} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Modals_Chat from '../Modals/Modal_Chat';
import {UserStore} from '../../Store/store';
import {db} from '../../../api/firebaseConfig';
import {screenwidth} from '../Dimensions';
export default function Chat({route}) {
  const inforSender = UserStore(state => state.user);
  const [submit, setSubmit] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const senderId = inforSender.id;
  const [isVisible, setisVisible] = React.useState(false);
  const recived = route.params.data;
  const [showTime, setShowTime] = React.useState({});

  const onClose = () => {
    setisVisible(false);
  };
  const navigation = useNavigation();
  React.useEffect(() => {
    if (input == '') {
      setSubmit(false);
    } else setSubmit(true);
  }, [input]);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTintColor: '#000000',
      headerStyle: {backgroundColor: '#FFFFFF'},
      headerBackVisible: false,
      headerTitleAlign: 'left',
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </Pressable>
          <Avatar.Image
            size={49}
            source={{uri: recived.avatar}}
            style={{marginHorizontal: 10}}
          />
          <Text
            style={{
              color: '#000000',
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            {recived.name}
          </Text>
        </View>
      ),
      headerRight: () => (
        <>
          <Pressable onPress={() => alert('video call')}>
            <MaterialCommunityIcons name="video" size={28} color={'#989E9C'} />
          </Pressable>
          <Pressable
            onPress={() => alert('call')}
            style={{marginHorizontal: 10}}>
            <MaterialCommunityIcons name="phone" size={28} color={'#989E9C'} />
          </Pressable>
          <Pressable
            onPress={() => {
              setisVisible(true);
            }}>
            <MaterialCommunityIcons
              name="information"
              size={28}
              color={'#989E9C'}
            />
          </Pressable>
        </>
      ),
    });
  }, [recived]);
  React.useEffect(() => {
    const unsubscribe = db
      .collection('Chats')
      .doc(`${senderId}-${recived.id}`)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        if (querySnapshot == null) {
          setMessages([]);
        } else {
          const message = [];
          querySnapshot.forEach(documentSnapshot => {
            message.push({
              id: documentSnapshot.id,
              text: documentSnapshot.data().text,
              timestamp: documentSnapshot.data().timestamp?.toDate(),
              senderId: documentSnapshot.data().senderId,
              receiverId: documentSnapshot.data().receiverId,
              senderAvatar: documentSnapshot.data().senderAvatar,
            });
          });
          setMessages(message);
        }
      });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    setInput('');
    const setdata = await db
      .collection('Chats')
      .doc(`${senderId}-${recived.id}`);
    if (input) {
      try {
        setdata
          .collection('messages')
          .add({
            type: 'Text',
            text: input,
            timestamp: firestore.FieldValue.serverTimestamp(),
            receiverId: recived.id,
            senderId: senderId,
            senderAvatar: inforSender.avatar,
            senderName: inforSender.name,
          })
          .then(async () => {
            await db.collection('Chats').doc(`${senderId}-${recived.id}`).set({
              name: recived.name,
              avatar: recived.avatar,
              type: 'Person',
              text: input,
              timestamp: firestore.FieldValue.serverTimestamp(),
            });
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const addListChat = async input => {
    if (input) {
      const Chat = {
        timestamp: firestore.FieldValue.serverTimestamp(),
        id: recived.id,
        name: recived.name,
        avatar: recived.avatar,
        text: input,
      };
      try {
        await db.collection('List_Chat').doc(senderId).set({
          recived,
          text: input,
          timestamp: firestore.FieldValue.serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderItem = ({item: message, index}) => {
    const isSender = message.senderId === senderId;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showTimestamp =
      isSender ||
      (previousMessage &&
        message.timestamp - previousMessage.timestamp > 30 * 60 * 1000);
    return (
      <View key={message.id}>
        {!showTimestamp ? (
          <Text style={{textAlign: 'center', color: 'black'}}>
            {message.timestamp
              ? message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </Text>
        ) : null}
        {!isSender && (
          <Avatar.Image size={30} source={{uri: message.senderAvatar}} />
        )}
        <View style={isSender ? styles.messageSender : styles.messageReciever}>
          <Pressable
            onPress={() => {
              setShowTime({...showTime, [message.id]: !showTime[message.id]});
            }}>
            <Text style={isSender ? styles.senderText : styles.reciverText}>
              {message.text}
            </Text>
          </Pressable>
          {showTime[message.id] && (
            <Text
              style={
                isSender
                  ? styles.timestampSenderText
                  : styles.timestampReciverText
              }>
              {message.timestamp
                ? message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          )}
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        inverted
        showsVerticalScrollIndicator={false}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <View style={styles.box_input}>
        <MaterialCommunityIcons name="paperclip" size={25} color={'#000E08'} />
        <TextInput
          value={input}
          onChangeText={setInput}
          outlineStyle={{
            borderRadius: 25,
            backgroundColor: '#F3F6F6',
            borderColor: '#F3F6F6',
            marginHorizontal: 10,
          }}
          style={{width: '70%', paddingHorizontal: 5}}
          textColor="#000E08"
          cursorColor="#000E08"
          mode="outlined"
          right={<TextInput.Icon icon="file-outline" color={'#797C7B'} />}
        />
        <View
          style={{
            width: 50,
            justifyContent: 'center',
            flexDirection: 'row',
            marginHorizontal: 10,
          }}>
          {submit ? (
            <Pressable onPress={handleSendMessage}>
              <MaterialCommunityIcons
                name="send-circle"
                size={44}
                color={'#20A090'}
              />
            </Pressable>
          ) : (
            <>
              <Pressable style={{marginRight: 10}}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={25}
                  color={'#000E08'}
                />
              </Pressable>
              <Pressable>
                <MaterialCommunityIcons
                  name="microphone"
                  size={25}
                  color={'#000E08'}
                />
              </Pressable>
            </>
          )}
        </View>
      </View>
      <Modals_Chat isVisible={isVisible} onClose={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  box_input: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    width: screenwidth,
    justifyContent: 'center',
  },
  messageSender: {
    padding: 10,
    backgroundColor: '#2C6BED',
    alignSelf: 'flex-end',
    borderRadius: 25,
    maxWidth: '80%',
    position: 'relative',
    marginRight: 10,
    marginVertical: 3,
  },
  messageReciever: {
    padding: 10,
    backgroundColor: '#efefef',
    alignSelf: 'flex-start',
    borderRadius: 25,
    maxWidth: '80%',
    position: 'relative',
    marginLeft: 10,
  },
  reciverText: {
    fontSize: 20,
    marginRight: 8,
    color: 'black',
  },
  senderText: {
    fontSize: 20,
    marginRight: 8,
    color: 'white',
  },
  timestampSenderText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'right',
  },
  timestampReciverText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'left',
  },
  color_font: {backgroundColor: '#2C6BED'},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
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
});
