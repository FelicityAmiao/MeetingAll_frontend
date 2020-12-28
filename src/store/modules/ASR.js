import { convertToText } from '../../api/ASR.js';

const state = {
  disabled: true,
  href: ''
};
const mutations = {
  updateDisabledStatusAndHerf: (state, updateObject) => {
    state.disabled = updateObject.disabled;
    state.href = updateObject.downloadLink;
  }
};
const actions = {
  async startConvert (context) {
    const response = await convertToText();
    console.log(response);
    if (response.status === 200) {
      context.commit('updateDisabledStatusAndHerf', { disabled: false, downloadLink: response.data });
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
