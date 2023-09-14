import { StyleSheet, Text, View, Pressable, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Avatar } from 'react-native-paper';
import { firebase } from '@react-native-firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { screenwidth } from '../conponents/Dimensions';
import { useProfileStore } from '../../Store/profileStore';

export default function RequestItem({ item, check, mode, friend }) {
  const [request, setRequest] = useState();
  const [disable, setDisable] = useState(true);
  const { data } = useProfileStore();
  const id = data.id;

  React.useEffect(() => {
    if (check) {
      setRequest(true);
    } else {
      setRequest(false);
    }
  }, []);

  React.useEffect(() => {
    setDisable(true);
    setTimeout(() => {
      setDisable(false);
    }, 3000);
  }, [request]);

  const sentRequest = (item) => {
    db.doc(`Users/${data.id}`).update({
      sentFriendRequest: firebase.firestore.FieldValue.arrayUnion({
        id: item.id,
        name: item.name,
        avatar: item.avatar,
      }),
    });
  };

  const updateFriendsRequest = (item) => {
    const dataSent = {
      id: `${data.id}`,
      name: `${data.name}`,
      avatar: `${data.avatar}`,
    };
    try {
      db.doc(`Users/${item.id}`).update({
        friendsRequest: firebase.firestore.FieldValue.arrayUnion(dataSent),
      });
      console.log('Friends request updated successfully!');
    } catch (error) {
      console.error('Error updating friends request:', error);
    }
  };

  const removeFriendsRequest = async (item) => {
    const dataSent = {
      id: `${data.id}`,
      name: `${data.name}`,
      avatar: `${data.avatar}`,
    };
    await db
      .doc(`Users/${item.id}`)
      .update({
        friendsRequest: firebase.firestore.FieldValue.arrayRemove(dataSent),
      })
      .then(() => {
        console.log('remove success');
      })
      .catch((e) => {
        console.log('remove error');
        console.log(e);
      });
  };

  const delSentRequest = async (item) => {
    await db
      .doc(`Users/${id}`)
      .update({
        sentFriendRequest: firebase.firestore.FieldValue.arrayRemove({
          id: item.id,
          name: item.name,
          avatar: item.avatar,
        }),
      })
      .then(() => {
        console.log('delete requests');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const checkActions = async (item, request) => {
    if (request == false) {
      sentRequest(item);
      updateFriendsRequest(item);
    } else {
      removeFriendsRequest(item);
      delSentRequest(item);
    }
  };

  return (
    <View style={styles.container}>
      <Avatar.Image source={{ uri: item.avatar }} style={styles.avatar} size={50} />
      <View style={styles.nameContainer}>
        <Text style={styles.name}>{item.name}</Text>
      </View>

      {mode === 'List_Request' ? (
        <TouchableOpacity
          disabled={disable}
          onPress={() => {
            removeFriendsRequest(item);
            delSentRequest(item);
          }}
          style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      ) : mode === 'List_Search' && check != null ? (
        <TouchableOpacity
          disabled={disable}
          onPress={() => {
            setRequest(!request);
            checkActions(item, request);
          }}
          style={[
            styles.requestButton,
            {
              backgroundColor: request ? '#FF0000' : '#8A2BE2',
            },
          ]}>
          <Text style={styles.requestButtonText}>
            {request ? 'Cancel' : 'Request'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            console.log('aaa');
          }}
          style={styles.friendButton}>
          <Text style={styles.friendButtonText}>Friend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 69,
    flexDirection: 'row',
    width: screenwidth,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  avatar: {
    width: 50,
    height: 50,
  },
  nameContainer: {
    marginHorizontal: 10,
    width: '55%',
  },
  name: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    borderRadius: 5,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: 5,
    width: 66,
  },
  cancelButtonText: {
    color: '#fff',
  },
  requestButton: {
    borderRadius: 5,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: 5,
    width: 66,
  },
  requestButtonText: {
    color: '#fff',
  },
  friendButton: {
    backgroundColor: '#C0C0C0',
    borderRadius: 5,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    paddingHorizontal: 5,
    width: 66,
  },
  friendButtonText: {
    color: '#fff',
  },
});
