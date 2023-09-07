import {Pressable, Text} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {UserStore} from '../../Store/store';

export default function Friends_item({item}) {
  const navigation = useNavigation();
  const userState = UserStore(state => state.user);

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Group_Message', {
          id: `${userState.id}-${item.id}`,
          senderId: userState.id,
          name: item.name,
          avatar: item.avatar,
          type: 'Person',
          reciverID: item.id,
          
        });
      }}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        marginRight: 2,
        
      }}>
      <Avatar.Image source={{uri: item.avatar}} size={60} />
      <Text
        numberOfLines={2}
        style={{textAlign: 'center', marginHorizontal: 2, color: '#FFFFFF',height:35}}>
        {item.name}
      </Text>
    </Pressable>
  );
}
