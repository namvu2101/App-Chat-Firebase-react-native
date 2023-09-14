import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useProfileStore} from '../../Store/profileStore';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginRight: 2,
  },
  text: {
    textAlign: 'center',
    marginHorizontal: 2,
    color: '#FFFFFF',
    height: 35,
  },
  avatar: {
    height: 60,
    width: 60,
  },
});

export default function FriendsItem({item}) {
  const navigation = useNavigation();
  const {data} = useProfileStore();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('Chat_Message', {
          id: `${data.id}-${item.id}`,
          senderId: data.id,
          name: item.name,
          avatar: item.avatar,
          type: 'Person',
          reciverID: item.id,
        });
      }}
      style={styles.container}>
      <Avatar.Image
        source={{uri: item.avatar}}
        size={60}
        style={styles.avatar}
      />
      <Text numberOfLines={2} style={styles.text}>
        {item.name}
      </Text>
    </Pressable>
  );
}
