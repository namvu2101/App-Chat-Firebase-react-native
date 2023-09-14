import {View, Text, Pressable, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-paper';

export default function List_Message({item, userId, user}) {
  const [isSelected, setisSelected] = React.useState(false);
  const formatTime = time => {
    const jsDate = time.toDate();
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(jsDate).toLocaleString('en-US', options);
  };

  const messageContainerStyle =
    item?.senderId === userId
      ? {
          alignSelf: 'flex-end',
          backgroundColor: '#DCF8C6',
        }
      : {
          alignSelf: 'flex-start',
          backgroundColor: '#F0F0F0',
        };

  return (
    <>
      {item.messageType === 'text' ? (
        <Pressable
          onPress={() => setisSelected(!isSelected)}
          style={[styles.messageContainer, messageContainerStyle]}>
          <Text style={styles.messageText}>{item?.messageText}</Text>

          {isSelected && (
            <Text style={styles.timestampText}>
              {formatTime(item.timestamp)}
            </Text>
          )}
        </Pressable>
      ) : (
        item.messageType === 'image' && (
          <Pressable
            onPress={() => setisSelected(!isSelected)}
            style={[styles.messageContainer, messageContainerStyle]}>
            <View>
              <Image source={{uri: item.photo}} style={styles.image} />
              {isSelected && (
                <Text
                  style={[
                    styles.timestampText,
                    item?.senderId === userId
                      ? {textAlign: 'right'}
                      : {textAlign: 'left'},
                  ]}>
                  {formatTime(item.timestamp)}
                </Text>
              )}
            </View>
          </Pressable>
        )
      )}
      {item?.senderId !== userId && (
        <View style={styles.userInfoContainer}>
          <Avatar.Image
            source={{uri: user.type === 'Person' ? user.avatar : item.avatar}}
            size={20}
          />
          <Text style={styles.senderNameText}>{item.name}</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    padding: 8,
    maxWidth: '60%',
    borderRadius: 7,
    margin: 10,
  },
  messageText: {
    fontSize: 15,
    color: '#000',
  },
  timestampText: {
    fontSize: 9,
    color: '#000',
    marginTop: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 7,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderNameText: {
    fontSize: 9,
    color: '#000',
    marginHorizontal: 5,
  },
});