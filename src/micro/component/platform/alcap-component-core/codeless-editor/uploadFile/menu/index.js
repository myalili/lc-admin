import UploadfileMenu from './uploadFileMenu'

export const uploadFileMenuConf = {
  key: 'uploadFile',
  factory() {
    return new UploadfileMenu()
  },
}