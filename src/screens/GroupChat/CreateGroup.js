import {StyleSheet, Text, View, Pressable, FlatList} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Avatar, Button} from 'react-native-paper';
import {db} from '../../firebase/firebaseConfig';
import firestore from '@react-native-firebase/firestore';
import Modal_Profile from '../User/Modal_Avatar';
import {useNavigation} from '@react-navigation/native';
import {useProfileStore} from '../../Store/profileStore';



export default function CreateGroup({isVisible, onClose, friends, input}) {
  const {data} = useProfileStore();
  const navigation = useNavigation();
  const [isSelected, setIsSelected] = useState([]);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('');
  const [image, setImage] = useState(
    'https://th.bing.com/th/id/OIP.3IsXMskZyheEWqtE3Dr7JwHaGe?w=234&h=204&c=7&r=0&o=5&pid=1.7',
  );

  const handleCreate = async input => {
    const newMember = [data.id];
    const trueValues = Object.keys(isSelected).filter(
      key => isSelected[key] === true,
    );
    newMember.push(...trueValues);

    db.collection('Chats')
      .add({
        type: 'Group',
        name: input,
        avatar: image,
        timestamp: firestore.FieldValue.serverTimestamp(),
        text: 'Send somethings',
        member_id: newMember,
      })
      .then(() => {
        onClose();
        navigation.goBack();
        console.log('Create group success');
      })
      .catch(e => console.log(e));
  };

  const onHide = () => {
    setIsSelected([]);
    setVisible(false);
  };

  const onPress = id => {
    const newSelectedItems = {...isSelected};
    newSelectedItems[id] = !newSelectedItems[id];
    setIsSelected(newSelectedItems);
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.memberItem}>
        <Avatar.Image source={{uri: item.avatar}} size={50} />
        <View style={{marginHorizontal: 10}}>
          <Text style={styles.memberName}>{item.name}</Text>
        </View>
        <Pressable
          onPress={() => onPress(item.id)}
          style={
            isSelected[item.id]
              ? {...styles.selectButton, backgroundColor: '#CACACA'}
              : {...styles.selectButton, backgroundColor: '#ffffff'}
          }></Pressable>
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}
      style={{margin: 0}}>
      <View style={styles.container}>
        <Pressable
          onPress={() => {
            setType('Avatar');
            setVisible(true);
          }}
          style={styles.avatarContainer}>
          <Avatar.Image
            source={{uri: image}}
            size={70}
            style={styles.avatarImage}
          />
          <Text style={styles.changeAvatarText}>Change</Text>
        </Pressable>
        <FlatList data={friends} renderItem={renderItem} />
        <View style={styles.buttonContainer}>
          <Button textColor="#2C6BED" onPress={onClose}>
            Cancel
          </Button>
          <Button textColor="#2C6BED" onPress={() => handleCreate(input)}>
            Create
          </Button>
        </View>
      </View>
      <Modal_Profile
        isVisible={visible}
        onClose={onHide}
        image={image}
        setImage={setImage}
        type={type}
      />
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    height: 500,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  avatarImage: {
    height: 70,
    width: 70,
  },
  changeAvatarText: {
    color: '#000',
    padding: 5,
    backgroundColor: '#DCDCDC',
    borderRadius: 15,
  },
  memberItem: {
    height: 69,
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberName: {
    color: '#000',
    width: 150,
    marginLeft: 20,
  },
  selectButton: {
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1,
    height: 20,
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
});