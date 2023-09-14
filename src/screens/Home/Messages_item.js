import React, {useLayoutEffect, useState} from 'react';
import {StyleSheet, Text, View, Pressable, Animated} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {db} from '../../firebase/firebaseConfig';
import ExtendChat from '../conponents/ExtendChat';

const styles = StyleSheet.create({
  messageItem: {
    height: 52,
    marginVertical: 10,
    flexDirection: 'row',
    width: 300,
    alignItems: 'center',
  },
  avatarContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    height: 50,
    width: 50,
  },
  statusIndicator: {
    backgroundColor: 'green',
    height: 10,
    width: 10,
    position: 'absolute',
    borderRadius: 5,
    marginLeft: 33,
  },
  contentContainer: {
    width: 160,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  nameText: {
    color: '#000000',
  },
  messageText: {
    color: '#000000',
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginHorizontal: 5,
  },
  timeText: {
    color: '#000000',
  },
  notificationIndicatorContainer: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 5,
  },
  notificationText: {
    color: 'white',
  },
});

export default function MessagesItem({item}) {
  const navigation = useNavigation();
  const [chatmessages, setChatMessages] = useState([]);
  const [isVisiable, setIsVisiable] = useState(false);

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection('Chats')
      .doc(item.id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(async querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        setChatMessages(data);
      });

    return () => unsubscribe();
  }, [item]);

  const onClose = () => {
    setIsVisiable(false);
  };

  return (
    <>
      <Pressable
        onLongPress={() => setIsVisiable(true)}
        onPress={() => {
          navigation.navigate('Chat_Message', item);
        }}
        style={styles.messageItem}>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            source={{
              uri:
                item?.avatar ||
                'https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?w=234&h=204&c=7&r=0&o=5&pid=1.7',
            }}
            size={50}
            style={styles.avatar}
          />
          <View style={styles.statusIndicator} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.nameText}>{item.name}</Text>
          <Text numberOfLines={1} style={styles.messageText}>
            {chatmessages?.[0]?.messageText || item?.text}
          </Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>2 min ago</Text>
          <View style={styles.notificationIndicatorContainer}>
            <Text style={styles.notificationText}>1</Text>
          </View>
        </View>
      </Pressable>
      <ExtendChat
        isVisiable={isVisiable}
        onClose={onClose}
        id={item.id}
        type={item.type}
      />
    </>
  );
}
