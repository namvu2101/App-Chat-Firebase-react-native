import {StyleSheet, Text, View, Alert, TouchableOpacity} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-paper';
import {firebase} from '@react-native-firebase/firestore';
import {UserStore} from '../../Store/store';
import {db} from '../../../api/firebaseConfig';
import {screenwidth} from '../Dimensions';

export default function Request_item({item, check, mode, friend}) {
  const userState = UserStore(state => state.user);
  const [request, setRequest] = React.useState();
  const [disable, setDisable] = React.useState(true);
  const id = userState.id;

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

  const sentRequest = item => {
     db.doc(`Users/${userState.id}`).update({
      sentFriendRequest: firebase.firestore.FieldValue.arrayUnion({
        id: item.id,
        name: item.name,
        avatar: item.avatar,
      }),
    });
  };
  const updateFriendsRequest = item => {
    const userSent = {
      id: `${userState.id}`,
      name: `${userState.name}`,
      avatar: `${userState.avatar}`,
    };
    try {
       db.doc(`Users/${item.id}`).update({
        friendsRequest: firebase.firestore.FieldValue.arrayUnion(userSent),
      });
      console.log('Friends request updated successfully!');
    } catch (error) {
      console.error('Error updating friends request:', error);
    }
  };
  const removeFriendsRequest = async item => {
    const userSent = {
      id: `${userState.id}`,
      name: `${userState.name}`,
      avatar: `${userState.avatar}`,
    };
    await db
      .doc(`Users/${item.id}`)
      .update({
        friendsRequest: firebase.firestore.FieldValue.arrayRemove(userSent),
      })
      .then(() => {
        console.log('remove success');
      })
      .catch(e => {
        console.log(e);
      });
  };

  const delSentRequest = async item => {
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
      .catch(e => {
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
    <View
      style={{
        height: 69,
        flexDirection: 'row',
        width: screenwidth,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
      }}>
      <Avatar.Image source={{uri: item.avatar}} size={50} />
      <View style={{marginHorizontal: 10, width: '55%'}}>
        <Text style={{color: '#000', fontSize: 16, fontWeight: 'bold'}}>
          {item.name}
        </Text>
      </View>

      {mode === 'List_Request' ? (
        <TouchableOpacity
          disabled={disable}
          onPress={() => {
            removeFriendsRequest(item);
            delSentRequest(item);
          }}
          style={{
            backgroundColor: '#FF0000',
            borderRadius: 5,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            paddingHorizontal: 5,
            width: 66,
          }}>
          <Text style={{color: '#fff'}}>Cancel</Text>
        </TouchableOpacity>
      ) : mode === 'List_Search' && check != null ? (
        <TouchableOpacity
          disabled={disable}
          onPress={() => {
            setRequest(!request);
            checkActions(item, request);
          }}
          style={{
            backgroundColor: request ? '#FF0000' : '#8A2BE2',
            borderRadius: 5,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            paddingHorizontal: 5,
            width: 66,
          }}>
          <Text style={{color: '#fff'}}>{request ? 'Cancel' : 'Request'}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
              console.log('aaa');
          }}
          style={{
            backgroundColor: '#C0C0C0',
            borderRadius: 5,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            paddingHorizontal: 5,
            width: 66,
          }}>
          <Text style={{color: '#fff'}}>Friend</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
