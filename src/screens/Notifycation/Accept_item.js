import React from 'react';
import {View, Text, Pressable, Alert, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-paper';
import {firebase} from '@react-native-firebase/firestore';
import {db} from '../../firebase/firebaseConfig';
import {screenwidth} from '../conponents/Dimensions';
import {useProfileStore} from '../../Store/profileStore';

export default function Accept_item({item}) {
  const {data} = useProfileStore();
  const id = data.id;

  const updateDoc = async (docId, data) => {
    try {
      await db.doc(`Users/${docId}`).update(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addFriend = async () => {
    await updateDoc(item.id, {
      friends: firebase.firestore.FieldValue.arrayUnion({id: data.id}),
    });
    await updateDoc(id, {
      friends: firebase.firestore.FieldValue.arrayUnion({id: item.id}),
    });

    removeFriendsRequest();
    delSentRequest();
  };

  const removeFriendsRequest = async () => {
    try {
      await db
        .collection('Users')
        .doc(id)
        .update({
          friendsRequest: firebase.firestore.FieldValue.arrayRemove(item),
        });
    } catch (error) {
      console.log(error);
    }
  };

  const delSentRequest = async () => {
    const userSent = {
      id: `${data.id}`,
      name: `${data.name}`,
      avatar: `${data.avatar}`,
    };
    await updateDoc(item.id, {
      sentFriendRequest: firebase.firestore.FieldValue.arrayRemove(userSent),
    });

    await updateDoc(data.id, {
      sentFriendRequest: firebase.firestore.FieldValue.arrayRemove(userSent),
    });
  };

  const delFriendRequest = () => {
    Alert.alert('Message', 'Do you want delete this request?', [
      {
        text: 'OK',
        onPress: () => {
          removeFriendsRequest();
          delSentRequest();
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Avatar.Image source={{uri: item.avatar}} size={50} />
      <View style={styles._text_box}>
        <Text style={{color: '#000'}}>{item.name}</Text>
      </View>
      <Pressable onPress={addFriend} style={styles.acceptButton}>
        <Text style={styles.acceptButtonText}>Accept</Text>
      </Pressable>
      <Pressable onPress={delFriendRequest} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Del</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 69,
    flexDirection: 'row',
    width: screenwidth,
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  _text_box: {
    marginHorizontal: 10,
    width: '44%',
  },
  acceptButton: {
    backgroundColor: '#8A2BE2',
    borderRadius: 5,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: 5,
  },
  acceptButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#66CDAA',
    borderRadius: 5,
    width: 40,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#fff',
  },
});
