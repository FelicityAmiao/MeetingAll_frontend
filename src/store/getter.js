const getters = {
  token: state => state.user.token,
  username: state => state.user.username,
  roomOptions: state => state.user.roomOptions
};
export default getters;
