import {create} from 'zustand';
import {db} from '../firebase/firebaseConfig';

export const useListFriend = create(set => ({
  friends: [],
  loading: false,
  setFriends: newlist => set({friends: newlist}),
  getFriends: async friends => {
    const data = [];
    try {
      const promises = friends.filter(async item => {
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

      set({friends: data, loading: true});
    } catch (error) {
      console.log(error);
    }
  },
}));
