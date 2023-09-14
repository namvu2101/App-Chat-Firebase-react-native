import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextInput} from 'react-native-paper';
import Custom_item from './Custom_item';
import {useListFriend} from '../../Store/list_friendStore';
import {screenwidth} from '../conponents/Dimensions';

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
    width: screenwidth,
    height: 50,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  headerButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 5,
    height: 44,
    backgroundColor: '#fff',
  },
  flatListContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: screenwidth - 10,
    flex: 1,
  },
  noFriendsText: {
    color: '#fff',
  },
  listFriendText: {
    color: '#fff',
  },
});

export default function Index({navigation}) {
  const [list_friend, setlist_friend] = useState([]);
  const [isVisible, setisVisible] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [input, setInput] = useState('');
  const {friends} = useListFriend();


  useEffect(() => {
    setlist_friend(friends);
  }, [friends]);

  const handleSearh = input => {
    const filteredItems = list_friend.filter(item =>
      item.name.toLowerCase().includes(input.toLowerCase()),
    );
    if (input == '') {
      setIsSearch(false);
    } else if (filteredItems.length == 0) {
      Alert.alert('Message', 'You dont have Friends');
      setlist_friend(friends);
    } else {
      setlist_friend(filteredItems);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => setIsSearch(!isSearch)}>
          <MaterialCommunityIcons name="magnify" size={30} color="#ffffff" />
        </Pressable>
        {isSearch && (
          <TextInput
            autoFocus
            value={input}
            onChangeText={setInput}
            mode="outlined"
            placeholder="Search"
            style={styles.searchInput}
            textColor="#000"
            placeholderTextColor="#000"
            right={
              <TextInput.Icon
                icon="magnify"
                onPress={() => {
                  handleSearh(input);
                }}
                color="#000000"
              />
            }
          />
        )}
        <Text style={styles.headerButtonText}>{isSearch ? '' : 'Friends'}</Text>
        <Pressable
          onPress={() => {
            navigation.navigate('SearchFriend');
          }}>
          <MaterialCommunityIcons
            name="account-plus-outline"
            size={30}
            color="#ffffff"
          />
        </Pressable>
      </View>

      {list_friend.length > 0 ? (
        <Text style={styles.listFriendText}>Your List Friend</Text>
      ) : (
        <Text style={styles.noFriendsText}>You dont have Friends</Text>
      )}

      <View style={styles.flatListContainer}>
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          data={list_friend}
          renderItem={({index, item}) => <Custom_item item={item} />}
        />
      </View>
    </View>
  );
}
