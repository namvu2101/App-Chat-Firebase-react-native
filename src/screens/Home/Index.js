import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {Avatar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Messages_item from './Messages_item';
import Friends_item from './Friends_item';
import {FriendStore, UserStore} from '../../Store/store';
import {db} from '../../../api/firebaseConfig';

export default function Home() {
  const navigation = useNavigation();
  const userState = UserStore(state => state.user);
  const friends = FriendStore(state => state.friends);
  const screenwith = Dimensions.get('window').width - 10;
  const [listMessage, setListMessage] = useState([]);

  useEffect(() => {
    const subscriber = db
      .collection('Chats')
      .orderBy('timestamp', 'desc')
      .onSnapshot(onSnapshot => {
        const list = [];
        onSnapshot.docs.map(doc => {
          if (doc.data().member_id == userState.id) {
            const res = {
              id: doc.id,
              name: doc.data().name,
              avatar: doc.data().avatar,
              type :doc.data().type
            };
            if (doc.data().type === 'Person') {
              (res.senderID = doc.data().member_id),
                (res.reciverID = doc.data().reciverID);
            }
            list.push(res);
          }
        });
        setListMessage(list.sort((a, b) => b.timestamp - a.timestamp));
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <Avatar.Image
            source={{
              uri: userState?.avatar || 'https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?w=234&h=204&c=7&r=0&o=5&pid=1.7',
            }}
            size={40}
          />
        </Pressable>
        <Text style={{color: '#ffffff', fontSize: 20}}>Home</Text>
        <Pressable
          onPress={() => {}}
          style={{
            height: 40,
            width: 40,
            borderWidth: 0.5,
            borderColor: '#ffffff',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons name="magnify" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* List Friend */}
      <View style={{height: 100, marginLeft: 20, marginVertical: 10,width:screenwith}}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={friends}
          renderItem={({item}) => <Friends_item item={item} />}
          horizontal
        />
      </View>

      {/* List Messages */}
      {listMessage.length == 0 && (
        <Text style={{color: '#FFFFFF'}}> Chua co tin nhan </Text>
      )}
      <View
        style={{
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          width: screenwith,
          flex: 1,
        }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listMessage}
          renderItem={({item}) => <Messages_item item={item} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300,
    height: 50,
    marginVertical: 10,
  },
});
