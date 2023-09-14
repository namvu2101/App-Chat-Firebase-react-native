import React from 'react';
import {View, Text, Pressable, Alert} from 'react-native';
import {Avatar} from 'react-native-paper';
import {firebase} from '@react-native-firebase/firestore';
import {db} from '../../firebase/firebaseConfig';
import {useProfileStore} from '../../Store/profileStore';
import {screenwidth} from '../conponents/Dimensions';

export default function Custom_item({item}) {
  const {data} = useProfileStore();

  const updateDoc = async (docId, data) => {
    try {
      await db.doc(`Users/${docId}`).update(data);
    } catch (error) {
      console.error(error);
    }
  };

  const removeFriend = async () => {
    await updateDoc(data.id, {
      friends: firebase.firestore.FieldValue.arrayRemove({id: item.id}),
    });
    await updateDoc(item.id, {
      friends: firebase.firestore.FieldValue.arrayRemove({id: data.id}),
    });
  };

  const handleUnFriend = () => {
    Alert.alert('Message', 'Do you want delete this Friend?', [
      {
        text: 'OK',
        onPress: () => {
          removeFriend();
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Avatar.Image
        source={{uri: item.avatar}}
        size={50}
        style={styles.avatar}
      />
      <View style={styles.name}>
        <Text style={styles.name}>{item.name}</Text>
      </View>

      <Pressable onPress={handleUnFriend} style={styles.unfriendButton}>
        <Text style={styles.unfriendButtonText}>UnFriend</Text>
      </Pressable>
    </View>
  );
}
const styles = {
  container: {
    height: 69,
    flexDirection: 'row',
    width: screenwidth,
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  name: {
    marginHorizontal: 10,
    width: '55%',
    color: '#000',
  },
  unfriendButton: {
    backgroundColor: '#66CDAA',
    borderRadius: 5,
    height: 30,
    width: 69,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unfriendButtonText: {
    color: '#fff',
  },
};
