import {View, Text, Pressable, Image} from 'react-native';
import React from 'react';
import {Avatar} from 'react-native-paper';

export default function List_Message({item, userId}) {
  const [isSelected, setisSelected] = React.useState(false);
  const formatTime = time => {
    const jsDate = time.toDate();
    const options = {hour: 'numeric', minute: 'numeric'};
    return new Date(jsDate).toLocaleString('en-US', options);
  };
  return (
    <>
      {item.messageType === 'text' ? (
        <Pressable
          onPress={() => setisSelected(!isSelected)}
          style={[
            item?.senderId === userId
              ? {
                  alignSelf: 'flex-end',
                  backgroundColor: '#DCF8C6',
                  padding: 8,
                  maxWidth: '60%',
                  borderRadius: 7,
                  margin: 10,
                }
              : {
                  alignSelf: 'flex-start',
                  backgroundColor: '#F0F0F0',
                  padding: 8,
                  margin: 10,
                  borderRadius: 7,
                  maxWidth: '60%',
                },
          ]}>
          <Text
            style={{
              fontSize: 13,
              textAlign: 'center',
              color: '#000',
            }}>
            {item?.messageText}
          </Text>

          {isSelected && (
            <Text
              style={{
                textAlign: 'center',
                fontSize: 9,
                color: '#000',
                marginTop: 5,
              }}>
              {formatTime(item.timestamp)}
            </Text>
          )}
        </Pressable>
      ) : (
        item.messageType === 'image' && (
          <Pressable
            onPress={() => setisSelected(!isSelected)}
            style={[
              item?.senderId === userId
                ? {
                    alignSelf: 'flex-end',
                    backgroundColor: '#DCF8C6',
                    padding: 8,
                    maxWidth: '60%',
                    borderRadius: 7,
                    margin: 10,
                  }
                : {
                    alignSelf: 'flex-start',
                    backgroundColor: 'white',
                    padding: 8,
                    margin: 10,
                    borderRadius: 7,
                    maxWidth: '60%',
                  },
            ]}>
            <View>
              <Image
                source={{uri: item.photo}}
                style={{width: 200, height: 200, borderRadius: 7}}
              />
              {isSelected && (
                <Text
                  style={{
                    textAlign: item?.senderId === userId ? 'right' : 'left',
                    fontSize: 9,
                    color: '#000',
                    marginTop: 5,
                  }}>
                  {formatTime(item.timestamp)}
                </Text>
              )}
            </View>
          </Pressable>
        )
      )}
      {item?.senderId !== userId && (
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Avatar.Image source={{uri: item.avatar}} size={20} />
          <Text
            style={{
              fontSize: 9,
              color: '#000',
              marginHorizontal:5,
            }}>
            {item.name}
          </Text>
        </View>
      )}
    </>
  );
}
