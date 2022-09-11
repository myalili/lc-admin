import CryptoJS from 'crypto-js';

//DES解密
function ecryptByDES(ciphertext) {
    const keyHex = CryptoJS.enc.Utf8.parse('awebskey');
    const decrypted = CryptoJS.DES.decrypt({
        ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};
//DES加密
function encryptByDES(message) {
    const keyHex = CryptoJS.enc.Utf8.parse('awebskey');
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
};

export default {
   ecryptByDES, 
   encryptByDES
}