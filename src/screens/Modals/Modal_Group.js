import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Keyboard,
  TextInputBase,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Avatar, TextInput, Button} from 'react-native-paper';
import {db} from '../../../api/firebaseConfig';
import {UserStore} from '../../Store/store';
import firestore from '@react-native-firebase/firestore';

export default function Modal_Group({isVisible, onClose}) {
  const [input, setInput] = React.useState('');
  const userState = UserStore(state => state.user);
  const handleCreate = async input => {
    setInput('');
    onClose();
    await db
      .collection('Group_Chats')
      .add({
        name: input,
        avatar:
          'https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?w=234&h=204&c=7&r=0&o=5&pid=1.7',
        timestamp: firestore.FieldValue.serverTimestamp(),
        text: 'Send somethings',
      })
      .then(() => {
        console.log('Create group success');
      })
      .catch(e => console.log(e));
  };
  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}
      style={{margin: 0}}>
      <View style={styles.container}>
        <TextInput
          label={'name of group'}
          style={{width: 300, backgroundColor: '#fff'}}
          mode="outlined"
          textColor="#000"
          cursorColor="#000"
          value={input}
          onChangeText={setInput}
          autoFocus
        />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'flex-end',
            marginTop: 20,
          }}>
          <Button textColor="#2C6BED" onPress={onClose}>
            Cancel
          </Button>
          <Button textColor="#2C6BED" onPress={() => handleCreate(input)}>
            Create
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    height: 200,
    justifyContent: 'center',
  },
});
