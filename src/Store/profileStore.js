import {create} from 'zustand';
import {db} from '../firebase/firebaseConfig';

export const useProfileStore = create(set => ({
  data: [],
  loading: false,
  error: null,
  getData: async uid => {
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
          set({data: newUser});
          console.log('Get data User success');
        } else {
          // Xử lý trường hợp không tìm thấy tài liệu
          console.log('Tài liệu không tồn tại');

        }
      });
  },
}));
