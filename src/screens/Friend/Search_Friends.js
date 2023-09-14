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
import {db} from '../../firebase/firebaseConfig';
import {screenhight} from '../conponents/Dimensions';
import Request_item from './Request_item';
import {useProfileStore} from '../../Store/profileStore';
import {useNavigation} from '@react-navigation/native';

export default function SearchFriend() {
  const [input, setInput] = React.useState('');
  const [response, setResponse] = React.useState([]);
  const [searchdata, setSearchdata] = React.useState([]);
  const {data} = useProfileStore();
  const navigation = useNavigation();
  const getData = async () => {
    await db
      .collection('Users')
      .get()
      .then(querySnapshot => {
        const newdata = [];
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.id !== data.id) {
            const user = {
              id: documentSnapshot.id,
              avatar: documentSnapshot.data().avatar,
              name: documentSnapshot.data().name,
            };
            newdata.push(user);
          }
        });
        setResponse(newdata);
      });
  };

  const handleSearch = input => {
    Keyboard.dismiss();
    if (input.length === 0) {
      setSearchdata([]);
    } else {
      const List_friends = data.friends || [];
      const List_request = data.sentFriendRequest || [];

      const filteredItems = response.filter(item =>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <MaterialCommunityIcons
            name="arrow-left"
            style={styles.backButtonIcon}
          />
        </Pressable>
        <TextInput
          autoFocus
          value={input}
          onChangeText={setInput}
          mode="outlined"
          placeholder="Search"
          style={styles.searchInput}
          textColor="#000"
          placeholderTextColor={'#000'}
        />
        <Pressable
          onPress={() => handleSearch(input)}
          style={styles.searchButton}>
          <MaterialCommunityIcons
            name="magnify"
            style={styles.searchButtonIcon}
          />
        </Pressable>
      </View>

      {searchdata.length > 0 ? (
        <View style={{height: screenhight}}>
          <Text style={{color: '#000', textAlign: 'center'}}>
            Kết quả tìm kiếm
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
      ) : (
        <Text style={styles.noResultsText}>Không tìm thấy kết quả</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  header: {
    height: 60,
    backgroundColor: '#101010',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  backButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 15,
    height: 44,
    backgroundColor: '#fff',
  },
  searchButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  searchButtonIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  noResultsText: {
    color: '#000',
    textAlign: 'center',
  },
});
