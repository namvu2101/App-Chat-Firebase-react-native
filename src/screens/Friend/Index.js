import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserStore } from '../../Store/store';
import UISearchFriend from '../Modals/Modal_SearchFriend';
import Accept_item from './Accept_item';

export default function Index() {
  const screenwith = Dimensions.get('window').width - 10;
  const [users, setUsers] = React.useState([]);
  const userState = UserStore(state => state.user);
  const [isVisible, setisVisible] = React.useState(false);
  const onClose = () => {
    setisVisible(false);
  };
  
  React.useEffect(() => {
    setUsers(userState.friendsRequest)
  }, [userState]);

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
        <Text style={{color: '#ffffff', fontSize: 20}}>Friends</Text>
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

      {/* List Messages */}
      {users.length > 0 ? (
        <Text style={{color: '#fff'}}>Your Request</Text>
      ) : (
        <Text style={{color: '#fff'}}>You dont have Friends request</Text>
      )}
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          width: screenwith,
        }}>
        <FlatList
          contentContainerStyle={{
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            marginTop: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: screenwith,
          }}
          showsVerticalScrollIndicator={false}
          data={users}
          renderItem={({index, item}) => (
            <Accept_item
              index={index}
              item={item}
              data={users}
              setData={setUsers}
            />
          )}
        />
      </View>

      <UISearchFriend isVisible={isVisible} onClose={onClose} />
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
