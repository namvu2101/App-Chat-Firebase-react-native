import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Custom_item from './Custom_item';
import Create_Group from './CreateGroup';
import { screenwidth } from '../conponents/Dimensions';
import { db } from '../../firebase/firebaseConfig';

export default function AddChat({ navigation, route }) {
  const [isVisible, setisVisible] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [input, setInput] = useState('');

  const onClose = () => {
    setisVisible(false);
  };

  const onOpen = () => {
    if (input.length == 0) {
      Alert.alert('Message', 'Name group is empty');
    } else {
      Keyboard.dismiss();
      setisVisible(true);
    }
  };

  const getDada = async () => {
    const uid = await AsyncStorage.getItem('uid');
    db.collection('Chats').onSnapshot((onSnapshot) => {
      const list = [];
      onSnapshot.docs.forEach((i) => {
        const group = {
          id: i.id,
          name: i.data().name,
          avatar: i.data().avatar,
          text: i.data().text,
          timestamp: i.data().timestamp,
        };
        if (i.data().type === 'Group' && i.data().member_id?.find((it) => it === uid)) {
          list.push(group);
        }
      });
      setDataList(list);
    });
  };

  useEffect(() => {
    getDada();
  }, []);

  return (
    <View style={styles.container}>
      {/* -----------------------Header--------------------- */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
        </Pressable>
        <Text style={{ color: '#ffffff', fontSize: 20 }}>Group</Text>
        <Pressable
          onPress={() => { }}
          style={{
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialCommunityIcons name="magnify" size={24} color="#ffffff" />
        </Pressable>
      </View>
      {/* -----------------------UnderHeader--------------------- */}
      <View style={styles.underHeaderContainer}>
        <View style={styles.underHeader}>
          <MaterialCommunityIcons name="account-group" size={30} color={'#fff'} />
          <Text style={styles.underHeaderText}>Create group</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '90%',
            justifyContent: 'space-between',
          }}
        >
          <TextInput value={input} onChangeText={setInput} autoFocus style={{ width: 80 }} />
          <Pressable onPress={onOpen}>
            <MaterialCommunityIcons name="plus-circle-outline" size={30} color="#fff" />
          </Pressable>
        </View>
      </View>
      {/* -----------------------Body--------------------- */}
      <View style={styles.bodyContainer}>
        <Text style={styles.groupChatsText}>Your GroupChats</Text>
        <FlatList data={dataList} renderItem={({ item }) => <Custom_item item={item} />} />
      </View>
      <Create_Group isVisible={isVisible} onClose={onClose} friends={route.params} input={input} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  underHeaderContainer: {
    width: '80%',
    marginVertical: 10,
  },
  underHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underHeaderText: {
    color: '#fff',
    marginHorizontal: 20,
  },
  createGroupIcon: {
    color: '#fff',
    marginHorizontal: 20,
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    width: screenwidth - 10,
  },
  groupChatsText: {
    color: '#000',
    textAlign: 'center',
  },
});
