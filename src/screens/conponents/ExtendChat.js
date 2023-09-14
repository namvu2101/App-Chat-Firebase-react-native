import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {db} from '../../firebase/firebaseConfig';

export default function ExtendChat({isVisiable, onClose, id, type}) {
  const [isNotifycation, setisNotifycation] = React.useState(true);
  const data = [
    {
      title: 'Notifycation',
      icon: isNotifycation ? 'bell-off' : 'bell',
      onPress: () => {
        setisNotifycation(!isNotifycation);
        console.log('Notifycation');
      },
    },
    {
      title: 'Open Bubble',
      icon: 'circle-multiple',
      onPress: () => {
        console.log('Open Bubble');
      },
    },
  ];
  if (type === 'Person') {
    data.push(
      {
        title: 'Hide',
        icon: 'eye-off',
        onPress: () => handleDelete('hide'),
      },
      {
        title: 'Delete',
        icon: 'delete-circle-outline',
        onPress: () => handleDelete('delete'),
      },
    );
  }
  const handleDelete = action => {
    Alert.alert(
      'Message',
      'Do you want delete this Message?',
      [
        {
          text: 'Ok',
          onPress: () => {
            db.collection('Chats').doc(id).delete();
            if (action === 'delete') {
              removeChat(id);
            }
          },
        },
        {
          text: 'Cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const removeChat = async id => {
    try {
      const messagesRef = db.collection('Chats').doc(id).collection('messages');
      const querySnapshot = await messagesRef.get();
      querySnapshot.forEach(async doc => {
        await doc.ref.delete();
      });
    } catch (error) {
      console.error('Error deleting messages:', error);
      Alert.alert(
        'Error',
        'An error occurred while deleting messages',
        [
          {
            text: 'Ok',
          },
        ],
        {cancelable: true},
      );
    }
  };
  return (
    <Modal
      isVisible={isVisiable}
      onBackdropPress={() => onClose()}
      style={{margin: 0, justifyContent: 'flex-end'}}>
      <View
        style={{
          height: 300,
          backgroundColor: '#FFFFFF',
          borderRadius: 10,
          marginHorizontal: 10,
          padding: 15,
        }}>
        {data.map((item, index) => (
          <Pressable
            onPress={item.onPress}
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}
            key={index}>
            <MaterialCommunityIcons name={item.icon} size={33} color={'red'} />
            <Text style={{color: '#000', marginHorizontal: 10, fontSize: 16}}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
