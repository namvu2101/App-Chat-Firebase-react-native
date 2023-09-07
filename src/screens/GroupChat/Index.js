import {StyleSheet, Text, View, Pressable, FlatList} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect} from 'react';
import Modal_Group from '../Modals/Modal_Group';
import {screenwidth} from '../Dimensions';
import {db} from '../../../api/firebaseConfig';
import Custom_item from './Custom_item';
import Create_Group from './CreateGroup';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GroupChat() {
  const [isVisible, setisVisible] = React.useState(false);
  const [data, setData] = React.useState([]);
  const onClose = () => {
    setisVisible(false);
  };

  const getDada = async () => {
    const uid = await AsyncStorage.getItem('uid');
     db.collection('Chats').onSnapshot(onSnapshot => {
      const list = [];
      onSnapshot.docs.forEach(i => {
        const group = {
          id: i.id,
          name: i.data().name,
          avatar: i.data().avatar,
          text: i.data().text,
          timestamp: i.data().timestamp,
        };
        if ( i.data().type ==='Group' && i.data().member_id?.find(it => it === uid)) {
          list.push(group);
        }
      });
      setData(list);
    });
  };

  useEffect(() => {
    getDada();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={{
            height: 40,
            width: 40,
            borderWidth: 1,
            borderColor: '#ffffff',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons name="magnify" size={24} color="#ffffff" />
        </Pressable>
        <Text style={{color: '#ffffff', fontSize: 20}}>Group</Text>
        <Pressable
          onPress={() => {
            setisVisible(true);
          }}
          style={{
            height: 40,
            width: 40,
            borderWidth: 1,
            borderColor: '#ffffff',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="account-plus-outline"
            size={24}
            color="#ffffff"
          />
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          width: screenwidth,
        }}>
        <FlatList
          data={data}
          renderItem={({item}) => <Custom_item item={item} />}
        />
      </View>
      <Create_Group isVisible={isVisible} onClose={onClose} />
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
});
