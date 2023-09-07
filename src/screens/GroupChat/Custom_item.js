import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Avatar, List} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function Custom_item({item}) {
    const navigation = useNavigation()
  return (
    <List.Item
      onPress={() => {
        navigation.navigate('Group_Message',item)
      }}
      key={item.id}
      title={item.name}
      descriptionNumberOfLines={1}
      titleStyle={{color: '#000',fontSize:20}}
      description={item.text}
      descriptionStyle={{color: '#000', fontWeight: 'bold'}}
      left={props => (
        <Avatar.Image source={{uri: item.avatar}} size={55} {...props} />
      )}
    />
  );
}

const styles = StyleSheet.create({});
