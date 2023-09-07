import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {db} from '../../../api/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Messages_item({item}) {
  const navigation = useNavigation();
  const [chatmessages, setChatMessages] = React.useState([]);

  React.useLayoutEffect(() => {
    const unsubscribe = db
      .collection('Chats')
      .doc(item.id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(async querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        setChatMessages(data);
      });

    return () => unsubscribe();
  }, [item]);
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Group_Message', item);
      }}
      style={{
        height: 52,
        marginVertical: 10,
        flexDirection: 'row',
        width: 300,
        alignItems: 'center',
      }}>
      <View style={{justifyContent: 'flex-end'}}>
        <Avatar.Image
          source={{
            uri:
              item?.avatar 
          }}
          size={50}
        />
        <View
          style={{
            backgroundColor: 'green',
            height: 10,
            width: 10,
            position: 'absolute',
            borderRadius: 5,
            marginLeft: 33,
          }}
        />
      </View>
      <View
        style={{width: 160, justifyContent: 'center', marginHorizontal: 10}}>
        <Text style={{color: '#000000'}}>{item.name}</Text>
        <Text numberOfLines={1} style={{color: '#000000'}}>
          {chatmessages?.[0]?.messageText || 'Say somethings'}
        </Text>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <Text style={{color: '#000000'}}>2 min ago</Text>
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginVertical: 5,
          }}>
          <Text>1</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
