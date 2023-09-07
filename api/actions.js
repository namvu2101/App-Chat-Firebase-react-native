import AsyncStorage from '@react-native-async-storage/async-storage';
import {FriendStore, UserStore} from '../src/Store/store';
import {auth, db} from './firebaseConfig';

const register = async (email, password, name, image) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );

    await userCredential.user.updateProfile({
      displayName: name,
      photoURL: image,
    });
  } catch (e) {
    switch (e.code) {
      case 'auth/email-already-in-use':
        UserStore.setState({error: 'Email đã tồn tại', loading: false});
        break;
      case 'auth/invalid-email':
        UserStore.setState({error: 'Email không hợp lệ', loading: false});
        break;
      case 'auth/weak-password':
        UserStore.setState({
          error: 'Mật khẩu phải lớn hơn 6 kí tự',
          loading: false,
        });
        break;
      default:
        UserStore.setState({error: e, loading: false});
        break;
    }
  }
};

const update = ({name, image}) => {
  auth()
    .currentUser.updateProfile({
      displayName: name,
      photoURL: image,
    })
    .then(() => {
      const id = auth().currentUser.uid;
      console.log('Update Name & Avatar success');
      creatProfile(id);
    })
    .catch(e => {
      console.log(e);
      UserStore.setState({error: e, loading: false});
    });
};

const updateProfile = ({
  actions,
  email,
  password,
  name,
  image,
  number,
  Dateofbirth,
  id,
}) => {
  switch (actions) {
    case 'Update_Email':
      auth().currentUser.updateEmail(email);
      break;
    case 'Update_Password':
      auth().currentUser.updatePassword(password);
      break;
    case 'Update_Avatar':
      auth().currentUser.updateProfile({photoURL: image});
      break;
    case 'Update_Name':
      auth().currentUser.updateProfile({displayName: name});
      break;
    case 'Update_Phone':
      auth().currentUser.updatePhoneNumber(number);
      break;
    case 'Update_Dateofbirth':
      db.collection('Users').doc(id).update({
        Dateofbirth: Dateofbirth,
      });
      break;
    default:
      break;
  }
};

const creatProfile = (id, name, image) => {
  UserStore.setState({loading: false});
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString();
  const Dateofbirth = `${day}/${month}/${year}`;
  db.collection('Users')
    .doc(id)
    .set({
      name,
      avatar: image,
      Dateofbirth,
      address: '',
      dec: '',
      friends: [],
      friendsRequest: [],
      sentFriendRequest: [],
      listMessage: [],
    })
    .then(() => {
      console.log('User added to FireStore');
      UserStore.setState({loading: true});
    })
    .catch(e => {
      UserStore.setState({error: e, loading: false});
      console.log(e);
    });
};

const getUserdata = (uid) => {
  db.collection('Users')
    .doc(uid)
    .onSnapshot(doc => {
      if (doc.exists) {
        const newUser = {
          id: uid,
          avatar: doc.data().avatar,
          name: doc.data().name,
          Dateofbirth: doc.data().Dateofbirth,
          address: doc.data().address,
          friends: doc.data().friends,
          friendsRequest: doc.data().friendsRequest,
          sentFriendRequest: doc.data().sentFriendRequest,
        };
        getFriends(doc.data().friends);
        UserStore.setState({user: newUser, error: null, loading: true});
        console.log('Get data User success');
      } else {
        // Xử lý trường hợp không tìm thấy tài liệu
        console.log('Tài liệu không tồn tại');
      }
    });
};

const getFriends = async friends => {
  const data = [];
  try {
    const promises = friends.map(async item => {
      const doc = await db.collection('Users').doc(item.id).get();
      if (doc.exists) {
        const user = {
          id: doc.id,
          name: doc.data().name,
          avatar: doc.data().avatar,
        };
        data.push(user);
      }
    });

    await Promise.all(promises);

    FriendStore.setState({friends: data}); // Log thông tin bạn bè sau khi đã lấy xong
  } catch (error) {
    console.log(error);
  }
};

const logout = () => {
  auth()
    .signOut()
    .then(() => {
      UserStore.setState({user: null, error: null, loading: false});
      AsyncStorage.removeItem('uid');
      console.log('User signed out!');
    });
};

export {logout, register, getUserdata, updateProfile, update, creatProfile};
