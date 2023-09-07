import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {UserStore} from '../Store/store';
import { logout } from '../../api/actions';

export default function Settings() {
  const screenwith = Dimensions.get('window').width - 10;
  const navigation = useNavigation();
  const userProfile = UserStore(state => state.user);

  const listItem = [
    {
      icon: 'account-outline',
      name: 'Account',
      dec: 'Privacy, security, change number',
    },
    {
      icon: 'chat-processing-outline',
      name: 'Chat',
      dec: 'Chat history,theme,wallpapers',
    },
    {
      icon: 'bell-ring-outline',
      name: 'Notifycations',
      dec: 'Messages, group and others',
    },
    {
      icon: 'help-circle-outline',
      name: 'Help',
      dec: 'Help center,contact us, privacy policy',
    },
    {
      icon: 'arrow-expand',
      name: 'Storage and data',
      dec: 'Network usage, stogare usage',
    },
    {
      icon: 'account-multiple-plus-outline',
      name: 'Invite a friend',
      dec: 'Add New Your  Friend',
    },
  ];

  const handleLogOut = () => {
    Alert.alert(
      'Message',
      'Do you want to Log out?',
      [
        {
          text: 'Ok',
          onPress: () => {
            logout();
            navigation.replace('Login');
          },
        },
        {
          text: 'Cancel',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#ffffff" />
        </Pressable>
        <Text
          style={{
            color: '#ffffff',
            fontSize: 20,
            textAlign: 'center',
            flex: 1,
          }}>
          Settings
        </Text>
      </View>

      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          width: screenwith,
          marginTop: 20,
          flex: 1,
          alignItems: 'center',
        }}>
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={{
            height: 100,
            flexDirection: 'row',
            alignItems: 'center',
            width: 300,
          }}>
          <Avatar.Image
            source={{
              uri: userProfile.avatar,
            }}
            size={66}
          />
          <View style={{width: 180, marginHorizontal: 10}}>
            <Text style={{color: '#000'}}>{userProfile.name}</Text>
            <Text style={{color: '#000'}}>Decription</Text>
          </View>
          <MaterialCommunityIcons name="qrcode-scan" size={20} color={'#000'} />
        </Pressable>
        <ScrollView>
          {listItem.map((i, index) => (
            <Pressable
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: 300,
                marginBottom: 20,
              }}>
              <Avatar.Icon icon={i.icon} size={50} color={'#FFFFFF'} />
              <View style={{marginHorizontal: 10}}>
                <Text style={{color: '#000'}}>{i.name}</Text>
                <Text style={{color: '#000'}}>{i.dec}</Text>
              </View>
            </Pressable>
          ))}
          <Pressable
            onPress={handleLogOut}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: 300,
              borderTopColor: '#000',
              borderTopWidth: 1,
              paddingVertical: 10,
            }}>
            <MaterialCommunityIcons name="logout" size={30} color={'#000'} />
            <Text style={{color: '#000'}}>Log Out</Text>
          </Pressable>
        </ScrollView>
      </View>
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
    alignItems: 'center',
    width: 300,
    height: 50,
    marginVertical: 10,
  },
});
