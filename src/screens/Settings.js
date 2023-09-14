import React from 'react';
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
import {Avatar} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import useAuthStore from '../Store/authStore';
import {useProfileStore} from '../Store/profileStore';
import {screenwidth} from './conponents/Dimensions';
import {useListMessage} from '../Store/list_messageStore';
import {useListFriend} from '../Store/list_friendStore';

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
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    alignItems: 'center',
    width: screenwidth,
  },
  profileSection: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
  },
  profileAvatar: {
    width: 180,
    marginHorizontal: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    marginBottom: 20,
  },
  logOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    borderTopColor: '#000',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
});

const Settings = () => {
  const navigation = useNavigation();
  const {data} = useProfileStore();
  const {logout} = useAuthStore();
  const {setList} = useListMessage();
  const {setFriends} = useListFriend();
  const listItem = [
    {
      icon: 'account-outline',
      name: 'Account',
      dec: 'Privacy, security, change number',
    },
    {
      icon: 'chat-processing-outline',
      name: 'Chat',
      dec: 'Chat history, theme, wallpapers',
    },
    {
      icon: 'bell-ring-outline',
      name: 'Notifications',
      dec: 'Messages, group and others',
    },
    {
      icon: 'help-circle-outline',
      name: 'Help',
      dec: 'Help center, contact us, privacy policy',
    },
    {
      icon: 'arrow-expand',
      name: 'Storage and data',
      dec: 'Network usage, storage usage',
    },
    {
      icon: 'account-multiple-plus-outline',
      name: 'Invite a friend',
      dec: 'Add a new friend',
    },
  ];

  const handleLogOut = () => {
    Alert.alert(
      'Message',
      'Do you want to log out?',
      [
        {
          text: 'Ok',
          onPress: () => {
            logout();
            setList([]);
            setFriends([]);
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

      <View style={styles.contentContainer}>
        <Pressable
          onPress={() => navigation.navigate('Profile')}
          style={styles.profileSection}>
          <Avatar.Image
            source={{
              uri:
                data?.avatar ||
                'https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?w=234&h=204&c=7&r=0&o=5&pid=1.7',
            }}
            size={66}
          />
          <View style={styles.profileAvatar}>
            <Text style={{color: '#000'}}>{data.name}</Text>
            <Text style={{color: '#000'}}>Description</Text>
          </View>
          <MaterialCommunityIcons name="qrcode-scan" size={20} color={'#000'} />
        </Pressable>
        <ScrollView>
          {listItem.map((item, index) => (
            <Pressable key={index} style={styles.listItem}>
              <Avatar.Icon icon={item.icon} size={50} color={'#FFFFFF'} />
              <View style={{marginHorizontal: 10}}>
                <Text style={{color: '#000'}}>{item.name}</Text>
                <Text style={{color: '#000'}}>{item.dec}</Text>
              </View>
            </Pressable>
          ))}
          <Pressable onPress={handleLogOut} style={styles.logOutButton}>
            <MaterialCommunityIcons name="logout" size={30} color={'#000'} />
            <Text style={{color: '#000'}}>Log Out</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};

export default Settings;
