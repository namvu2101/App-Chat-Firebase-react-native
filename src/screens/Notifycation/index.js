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
import Accept_item from './Accept_item';
import {useProfileStore} from '../../Store/profileStore';
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
    paddingHorizontal:15
  },
  notifyText: {
    color: '#fff',
  },
  requestText: {
    color: '#fff',
  },
  messageContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  _icon_box: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  _list_container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default function Friends_Request() {
  const screenwidth = Dimensions.get('window').width - 10;
  const [users, setUsers] = React.useState([]);
  const {data} = useProfileStore();
  const [isNotify, setIsNotify] = React.useState(true);

  React.useEffect(() => {
    setUsers(data.friendsRequest);
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles._icon_box}>
          <MaterialCommunityIcons name="magnify" size={30} color="#ffffff" />
        </Pressable>
        <Text style={{...styles.notifyText, fontSize: 20}}>
          Friends Request
        </Text>
        <Pressable
          onPress={() => setIsNotify(!isNotify)}
          style={styles._icon_box}>
          <MaterialCommunityIcons
            name={isNotify ? 'bell-outline' : 'bell-off-outline'}
            size={30}
            color="#ffffff"
          />
        </Pressable>
      </View>

      {/* List Messages */}
      {users.length > 0 ? (
        <Text style={styles.requestText}>Your Request</Text>
      ) : (
        <Text style={styles.requestText}>You dont have Friends request</Text>
      )}
      <View style={{...styles.messageContainer, width: screenwidth}}>
        <FlatList
          contentContainerStyle={styles._list_container}
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
    </View>
  );
}
