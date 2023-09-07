
import React from 'react';
import {View, Text, Pressable, Alert} from 'react-native';
import {Avatar} from 'react-native-paper';
import {firebase} from '@react-native-firebase/firestore';
import { db } from '../../../api/firebaseConfig';
import { UserStore } from '../../Store/store';
import { screenhight, screenwidth } from '../Dimensions';

export default function Accept_item({item}) {
  const userState = UserStore(state => state.user);
  const id = userState.id;

  const updateDoc = async (docId, data) => {
    try {
      await db.doc(`Users/${docId}`).update(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addFriend = async () => {
    const userSent = {
      id: `${userState.id}`,
      name: `${userState.name}`,
      avatar: `${userState.avatar}`,
    };

    await updateDoc(id, {
      friends: firebase.firestore.FieldValue.arrayUnion({id:item.id}),
    });

    await updateDoc(item.id, {
      friends: firebase.firestore.FieldValue.arrayUnion({id:userState.id}),
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
      id: `${userState.id}`,
      name: `${userState.name}`,
      avatar: `${userState.avatar}`,
    };
    await updateDoc(item.id, {
      sentFriendRequest: firebase.firestore.FieldValue.arrayRemove(userSent),
    });

    await updateDoc(userState.id, {
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
    <View
      style={{
        height: 69,
        flexDirection: 'row',
        width: screenwidth,
        paddingHorizontal: 20,
        marginVertical: 5,
        alignItems: 'center',
      }}>
      <Avatar.Image source={{uri: item.avatar}} size={50} />
      <View style={{marginHorizontal: 10, width: '44%'}}>
        <Text style={{color: '#000'}}>{item.name}</Text>
      </View>
      <Pressable
        onPress={addFriend}
        style={{
          backgroundColor: '#8A2BE2',
          borderRadius: 5,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 10,
          paddingHorizontal: 5,
        }}>
        <Text style={{color: '#fff'}}>Accept</Text>
      </Pressable>
      <Pressable
        onPress={delFriendRequest}
        style={{
          backgroundColor: '#66CDAA',
          borderRadius: 5,
          width: 40,
          height: 30,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: '#fff'}}>Del</Text>
      </Pressable>
    </View>
  );
}

