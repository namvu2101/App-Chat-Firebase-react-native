import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import {Avatar, TextInput} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {UserStore} from '../../Store/store';
import {auth, db, storage} from '../../../api/firebaseConfig';
import Modal_Profile from '../Modals/Modal_Profile';
import {screenwidth} from '../Dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserProfile() {
  const userProfile = UserStore(state => state.user);
  const navigation = useNavigation();
  const [isVisible, setisVisible] = React.useState(false);
  const [image, setImage] = useState(userProfile.avatar);
  const [type, setType] = useState('');
  const [dec, setdec] = useState(userProfile.dec);
  const [date, setDate] = useState(userProfile.Dateofbirth);
  const list = [
    {
      name: 'Display Name',
      value: userProfile.name,
      editable: false,
    },
    {
      name: 'Email Address',
      value: auth().currentUser.email,
      editable: false,
    },
    {
      name: 'Address',
      value: userProfile.address,
      editable: false,
    },
    {
      name: 'Phone Number',
      value: auth().currentUser.phoneNumber,
      editable: false,
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
  const handleUpdate = () => {
    try {
      db.collection('Users')
        .doc(userProfile.id)
        .update({
          avatar: image,
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
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 300,
          height: 50,
          marginVertical: 10,
          justifyContent: 'space-between',
        }}>
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
      <Text>{userProfile.name}</Text>
      <Text>{userProfile.dec}</Text>
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
        image={image}
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
});
