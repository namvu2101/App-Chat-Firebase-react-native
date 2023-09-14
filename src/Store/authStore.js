// authStore.js
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth, db, storage} from '../firebase/firebaseConfig';
import uuid from 'react-native-uuid';
const useAuthStore = create(set => ({
  user: null,
  loading: false,
  login: async (email, password, navigation) => {
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);

      console.log('Login Success');
      AsyncStorage.setItem('uid', response.user.uid);
      const userData = {
        id: response.user.uid,
        email: response.user.email,
        name: response.user.displayName,
        photo: response.user.photoURL,
      };
      set({user: userData});
      navigation.replace('Loading');
    } catch (error) {
      throw error.code;
    }
  },
  logout: () => {
    auth()
      .signOut()
      .then(() => {
        set({user: null, loading: false});
        AsyncStorage.removeItem('uid');
        console.log('User signed out!');
      });
  },
  register: async (email, password, name, image) => {
    try {
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async userCredential => {
          const id = userCredential.user.uid;
          AsyncStorage.setItem('uid', id);
          console.log(' signed Up!');
          createProfile(id, name, image);
          const userData = {
            id: userCredential.user.uid,
            email: userCredential.user.email,
          };
          set({user: userData});
        });
    } catch (error) {
      throw error.code;
    }
  },
}));
const createProfile = async (id, name, image) => {
  const currentDate = new Date();
  const idImage = uuid.v4();
  const reference = storage().ref(`Users/${id}/Avatar/${idImage}`);
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString();
  const Dateofbirth = `${day}/${month}/${year}`;

  try {
    const avatarUrl = image.includes('http')
      ? image
      : await uploadImageAndGetUrl(reference, image);

    await db.collection('Users').doc(id).set({
      name,
      avatar: avatarUrl,
      Dateofbirth,
      address: '',
      dec: '',
      friends: [],
      friendsRequest: [],
      sentFriendRequest: [],
      listMessage: [],
    });

    console.log('User added to Firestore');
  } catch (error) {
    console.error('Error creating user profile:', error);
  }
};
const uploadImageAndGetUrl = async (reference, image) => {
  await reference.putFile(image);
  return await reference.getDownloadURL();
};
export default useAuthStore;
