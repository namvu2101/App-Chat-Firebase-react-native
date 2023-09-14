import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState, useLayoutEffect} from 'react';
import {Avatar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Messages_item from './Messages_item';
import Friends_item from './Friends_item';
import {useProfileStore} from '../../Store/profileStore';
import {useListMessage} from '../../Store/list_messageStore';
import {useListFriend} from '../../Store/list_friendStore';
import {screenwidth} from '../conponents/Dimensions';

export default function Home() {
  const navigation = useNavigation();
  const {friends, getFriends} = useListFriend();
  const {data} = useProfileStore();
  const {list} = useListMessage();
  const [listMessage, setListMessage] = useState([]);
  useLayoutEffect(() => {
    getFriends(data.friends);
  }, [data]);
  useLayoutEffect(() => {
    const newlist = [];
    list.map(doc => {
      const res = doc.data;
      if (res.senderID == data.id || res.member_id?.find(i => i === data.id)) {
        const newData = {
          id: doc.id,
          name: res.name,
          avatar: res.avatar,
          type: res.type,
          reciverID: res.reciverID,
          text: res.text,
        };
        newlist.push(newData);
      }
      setListMessage(newlist);
    });
  }, [list]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Settings')}>
          <Avatar.Image
            source={{
              uri:
                data?.avatar ||
                'https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?w=234&h=204&c=7&r=0&o=5&pid=1.7',
            }}
            size={44}
          />
        </Pressable>
        <Text style={{color: '#ffffff', fontSize: 20}}>Home</Text>
        <Pressable
          onPress={() => {
            navigation.navigate('AddChat', friends);
          }}>
          <MaterialCommunityIcons
            name="message-plus-outline"
            size={30}
            color="#ffffff"
          />
        </Pressable>
      </View>

      {/* List Friend */}
      <View style={styles._list_fr}>
        <Pressable
          onPress={() => {
            navigation.navigate('SearchFriend');
          }}>
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={66}
            color="#fff"
          />
        </Pressable>
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
      <View style={styles._list_mg}>
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
    height: 50,
    marginVertical: 10,
    width: screenwidth,
    paddingHorizontal: 15,
  },
  _list_fr: {
    height: 100,
    marginLeft: 20,
    marginVertical: 10,
    width: screenwidth,
    flexDirection: 'row',
  },
  _list_mg: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: screenwidth - 10,
    flex: 1,
  },
});
