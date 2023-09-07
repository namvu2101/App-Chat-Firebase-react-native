import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Keyboard,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, TextInput} from 'react-native-paper';
import {db} from '../../../api/firebaseConfig';
import {screenhight} from '../Dimensions';
import Accept_item from '../Friend/Accept_item';
import {UserStore} from '../../Store/store';
import Request_item from '../Friend/Request_item';

export default function UISearchFriend({isVisible, onClose}) {
  const color_base = '#ffffff';
  const [input, setInput] = React.useState('');
  const [data, setData] = React.useState([]);
  const [sentRequest, setSentRequest] = React.useState([]);
  const [searchdata, setSearchdata] = React.useState([]);
  const userState = UserStore(state => state.user);

  const getData = async () => {
    await db
      .collection('Users')
      .get()
      .then(querySnapshot => {
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.id != userState.id) {
            const user = {
              id: documentSnapshot.id,
              avatar: documentSnapshot.data().avatar,
              name: documentSnapshot.data().name,
            };
            data.push(user);
          }
        });
        setData(data);
        setSentRequest(userState.sentFriendRequest);
      });
  };
  const handleSearch = input => {
    Keyboard.dismiss();
    if (input.length === 0) {
      setSearchdata([]);
    } else {
      const List_friends = userState.friends || [];
      const List_request = userState.sentFriendRequest || [];

      const filteredItems = data.filter(item =>
        item.name.toLowerCase().includes(input.toLowerCase()),
      );

      const friendResults = filteredItems.map(item => ({
        ...item,
        friend: List_friends.some(friend => friend.id === item.id),
      }));

      const resultsWithRequest = friendResults.map(item => {
        if (!item.friend) {
          const isRequested = List_request.some(
            reqItem => reqItem.id === item.id,
          );
          return {
            ...item,
            request: isRequested,
          };
        } else {
          return {
            ...item,
            request: null,
          };
        }
      });

      setSearchdata(resultsWithRequest);
    }
  };

  React.useEffect(() => {
    setSearchdata([]);
  }, [input]);
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <Modal
      animationIn={'slideInRight'}
      animationOut={'slideOutRight'}
      isVisible={isVisible}
      onBackButtonPress={() => {
        setInput('')
        onClose()}}
      style={{margin: 0}}>
      <View style={styles.container}>
        <View
          style={{
            height: 60,
            backgroundColor: '#101010',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            justifyContent: 'space-between',
          }}>
          <Pressable onPress={onClose}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#FFFFFF"
            />
          </Pressable>
          <TextInput
            autoFocus
            value={input}
            onChangeText={setInput}
            mode="outlined"
            placeholder="Search"
            style={{
              flex: 1,
              marginHorizontal: 15,
              height: 44,
              backgroundColor: '#fff',
            }}
            textColor="#000"
            placeholderTextColor={'#000'}
          />
          <Pressable
            onPress={() => {
              handleSearch(input);
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: '#fff',
              borderWidth: 1,
              borderRadius: 20,
              height: 40,
              width: 40,
            }}>
            <MaterialCommunityIcons name="magnify" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
        {/* List Search */}

        {searchdata.length > 0 && (
          <View style={{height: screenhight}}>
            <Text style={{color: '#000', textAlign: 'center'}}>
              Ket qua tim kiem
            </Text>
            <FlatList
              data={searchdata}
              renderItem={({item}) => (
                <Request_item
                  item={item}
                  check={item.request}
                  friend={item.friend}
                  mode="List_Search"
                />
              )}
            />
          </View>
        )}

        {/* List Friends Request  */}
        {sentRequest.length == 0 ? (
          <Text style={{color: '#000'}}>You dont have Request Friends</Text>
        ) : (
          <Text style={{color: '#000'}}>Your Request Friends</Text>
        )}

        <FlatList
          data={sentRequest}
          renderItem={({item}) => (
            <Request_item item={item} mode="List_Request" />
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'},
});
