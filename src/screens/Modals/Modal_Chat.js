import {StyleSheet, Text, View, Pressable, ScrollView} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, TextInput} from 'react-native-paper';
import { screenwidth } from '../Dimensions';

export default function Modals_Chat({isVisible, onClose}) {
  const color_base = '#ffffff';
  const list_item = [
    {
      name: 'Display Name',
      title: 'Jhon Abraham',
    },
    {
        name: 'Email Address',
        title: 'jhonabraham20@gmail.com',
      },
    {
      name: 'Address',
      title: '33 street west subidbazar,sylhet',
    },
    {
      name: 'Phone  Number',
      title: '0974046550',
    },
  ];
  return (
    <Modal
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      isVisible={isVisible}
      onBackButtonPress={() => onClose()}
      style={{margin: 0}}>
      <View style={styles.container}>
        <Pressable
          onPress={onClose}
          style={{
            width: screenwidth,
            height: 50,
            marginVertical: 20,
            paddingHorizontal: 10,
          }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </Pressable>
        <View style={{alignItems: 'center'}}>
          <Avatar.Image
            source={{
              uri: 'https://th.bing.com/th/id/OIP.m5IPjbtP__xtoz0TK6DRjQHaHa?w=211&h=211&c=7&r=0&o=5&pid=1.7',
            }}
            size={70}
          />
          <Text>Name</Text>
          <Text>@Name</Text>
          <View
            style={{
              flexDirection: 'row',
              width: '70%',
              justifyContent: 'space-around',
            }}>
            <Pressable>
              <Avatar.Icon
                icon="phone"
                size={40}
                color={color_base}
                style={{backgroundColor: '#051D13'}}
              />
            </Pressable>
            <Pressable>
              <Avatar.Icon
                icon="video"
                size={40}
                color={color_base}
                style={{backgroundColor: '#051D13'}}
              />
            </Pressable>
            <Pressable>
              <Avatar.Icon
                icon="account-plus"
                size={40}
                color={color_base}
                style={{backgroundColor: '#051D13'}}
              />
            </Pressable>
            <Pressable>
              <Avatar.Icon
                icon="bell"
                size={40}
                color={color_base}
                style={{backgroundColor: '#051D13'}}
              />
            </Pressable>
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: screenwidth - 10,
            marginTop: 20,
            flex: 1,
            paddingTop: 20,
          }}>
          <ScrollView style={{marginHorizontal: 20, flex: 1}}>
            {list_item.map((i, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  marginVertical: 10,
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={{color: '#AAAAAA'}}>{i.name}</Text>
                  <Text style={{color: '#000'}}>{i.title}</Text>
                </View>
                <Pressable>
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={30}
                    color={'#AAAAAA'}
                  />
                </Pressable>
              </View>
            ))}
            <View>
                <Text style={{color:'#000'}}>Media Shared</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000', alignItems: 'center'},
});
