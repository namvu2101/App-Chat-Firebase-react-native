import {create} from 'zustand';

const UserStore = create(set => ({
  user: null,
  loading: false,
  error: null,
}));
const FriendStore = create(set => ({
  friends: null,
  error: '',
  loading: false,
}));
const sentFriendRequest = create(set => ({
  sentFriendRequest: null,
  error: '',
  loading: false,
}));
const FriendRequestStore = create(set => ({
  friendsRequest: [],
  error: '',
  loading: false,
}));
export {UserStore, FriendStore,FriendRequestStore,sentFriendRequest};
