const modulesFiles = require.context(`/public/img`, true, /\.png$/);

let publicImg = [];
modulesFiles.keys().map(key => {
  publicImg = [ ...publicImg, key.substr(1)]
})

const state = {
  publicImg
};

export default {
  namespaced: true,
  state
}
