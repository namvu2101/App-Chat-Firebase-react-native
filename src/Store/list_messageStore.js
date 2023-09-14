import {create} from 'zustand';
import {db} from '../firebase/firebaseConfig';

export const useListMessage = create(set => ({
  list: [],
  loading: false,
  setList: newList => set({list: newList}),
  updateList: item => set(state => ({list: [...state.list, item]})),
  getList: () => {
    db.collection('Chats')
      .orderBy('timestamp', 'desc')
      .onSnapshot(onSnapshot => {
        const list = [];
        onSnapshot.docs.map(doc => {
          const res = {
            id: doc.id,
            data: doc.data(),
          };
          list.push(res);
        });
        console.log('set list ');
        set({list: list});
      });
  },
}));
