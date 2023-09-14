import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {Avatar, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {auth, db, storage} from '../../firebase/firebaseConfig';
import Modal_Profile from './Modal_Avatar';
import {screenwidth} from '../conponents/Dimensions';
import {useProfileStore} from '../../Store/profileStore';
import uuid from 'react-native-uuid';

export default function UserProfile() {
  const {data} = useProfileStore();
  const navigation = useNavigation();
  const [isVisible, setisVisible] = React.useState(false);
  const [image, setImage] = useState(data.avatar);
  const [type, setType] = useState('');
  const [dec, setdec] = useState(data.dec);
  const [date, setDate] = useState(data.Dateofbirth);
  const list = [
    {
      name: 'Display Name',
      value: data.name,
      editable: false,
      inputMode: 'text',
    },
    {
      name: 'Email Address',
      value: auth().currentUser.email,
      editable: false,
      inputMode: 'email',
    },
    {
      name: 'Address',
      value: data.address,
      editable: false,
      inputMode: 'text',
    },
    {
      name: 'Phone Number',
      value: auth().currentUser.phoneNumber,
      editable: false,
      inputMode: 'numeric',
    },
  ];
  const [profileFields, setProfileFields] = useState(list);
  const onClose = () => {
    setisVisible(false);
  };
  const handleFieldChange = (index, newValue) => {
    const updatedFields = [...profileFields];
    updatedFields[index].value = newValue;
    setProfileFields(updatedFields);
  };

  const toggleEdit = index => {
    const updatedFields = [...profileFields];
    updatedFields[index].editable = !updatedFields[index].editable;
    setProfileFields(updatedFields);
  };
  const handleUpdate = async () => {
    const idImage = uuid.v4();
    const reference = storage().ref(`Users/${data.id}/Avatar/${idImage}`);
    try {
      const avatarUrl = image.includes('http')
        ? image
        : await uploadImage(reference, image);
      db.collection('Users')
        .doc(data.id)
        .update({
          avatar: avatarUrl,
          name: profileFields[0].value,
          address: profileFields[2].value,
          Dateofbirth: date,
        })
        .then(() => {
          Alert.alert('Message', 'Save Success', [
            {
              text: 'Ok',
              onPress: () => navigation.goBack(),
            },
          ]);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const uploadImage = async (reference, image) => {
    await reference.putFile(image);
    return await reference.getDownloadURL();
  };
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://th.bing.com/th/id/R.31a057b002e52be3a87c1554ab0df61f?rik=pUq4kE2yAahmbg&riu=http%3a%2f%2f4.bp.blogspot.com%2f-cFrX94jbehk%2fUQgQyh66j3I%2fAAAAAAAAAk4%2fqFaJ1jjlMV8%2fs1600%2f9b516f4441a7bfb5174b33ebf74fc1d6_49102622.freebackgrounds5.jpg&ehk=Koj52Q69rFc9d4z9WglpPOi%2fpBSpUT3sFBd9r1fhnok%3d&risl=&pid=ImgRaw&r=0]',
        }}
        style={{width: screenwidth, height: '33%', position: 'absolute'}}
        resizeMode="cover"
      />
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (list !== profileFields) {
              Alert.alert('Message', 'You want save your change ?', [
                {
                  text: 'Save',
                  onPress: () => handleUpdate(),
                },
                {
                  text: 'Cancel',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } else {
              navigation.goBack();
            }
          }}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#FFFFFF" />
        </Pressable>
        <Pressable onPress={handleUpdate}>
          <MaterialCommunityIcons
            name="content-save-check-outline"
            size={30}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
      <Pressable
        onPress={() => {
          setType('Avatar');
          setisVisible(true);
        }}
        style={styles.profileSection}>
        <Avatar.Image
          source={{
            uri: image,
          }}
          size={70}
        />
      </Pressable>
      <Text>{data.name}</Text>
      <Text>{data.dec}</Text>

      <View style={styles.profileForm}>
        <ScrollView style={styles.formScroll}>
          {profileFields.map((field, index) => (
            <View key={index} style={styles.formField}>
              <Text style={styles.fieldName}>{field.name}</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TextInput
                  autoFocus={field.editable}
                  disabled={!field.editable}
                  value={field.value}
                  mode="outlined"
                  inputMode={field.inputMode}
                  onChangeText={newValue => handleFieldChange(index, newValue)}
                  style={{
                    flex: 1,
                    backgroundColor: field.editable ? '#FFFFFF' : '#FAFAFA',
                  }}
                  textColor="#000000"
                />

                <Pressable
                  onPress={() => {
                    toggleEdit(index);
                  }}>
                  <MaterialCommunityIcons
                    name={
                      field.editable ? 'check-circle-outline' : 'pencil-outline'
                    }
                    size={30}
                    color="red"
                  />
                </Pressable>
              </View>
            </View>
          ))}
          <View style={styles.formField}>
            <Text style={styles.fieldName}>Date of Birth</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                value={date}
                mode="outlined"
                disabled
                onChangeText={setDate}
                style={{
                  flex: 1,
                  backgroundColor: '#FAFAFA',
                }}
                textColor="#000000"
              />

              <Pressable
                onPress={() => {
                  setType('Date_of_birth');
                  setisVisible(true);
                }}>
                <MaterialCommunityIcons
                  name={'pencil-outline'}
                  size={30}
                  color="red"
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.mediaShared}>
            <Text>Media Shared</Text>
          </View>
        </ScrollView>
      </View>
      <Modal_Profile
        isVisible={isVisible}
        onClose={onClose}
        setDate={setDate}
        setImage={setImage}
        type={type}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  backButton: {
    width: screenwidth,
    height: 50,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  profileForm: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: screenwidth - 10,
    marginTop: 20,
    flex: 1,
    paddingTop: 20,
  },
  formScroll: {
    marginHorizontal: 20,
    flex: 1,
  },
  formField: {
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  fieldName: {
    color: '#AAAAAA',
  },
  mediaShared: {
    color: '#000',
    height: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    height: 50,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
});
