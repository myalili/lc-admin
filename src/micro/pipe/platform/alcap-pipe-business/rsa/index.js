import { b64tohex, hex2b64 } from "jsencrypt/lib/lib/jsbn/base64";
import JSEncrypt from 'jsencrypt';
class JsEncryptNew extends JSEncrypt {
    constructor() {
        super();
        this.b64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        this.b64pad = '=';
        this.BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz';
    }
    base64ToArrayBuffer = function (base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            undefined
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes;
    };

    int2char = function (n) {
        return this.BI_RM.charAt(n);
    };
    b64tohex = function (s) {
        var ret = '';
        var i;
        var k = 0; // b64 state, 0-3
        var slop = 0;
        for (i = 0; i < s.length; ++i) {
            if (s.charAt(i) === this.b64pad) {
                break;
            }
            var v = this.b64map.indexOf(s.charAt(i));
            if (v < 0) {
                continue;
            }
            if (k === 0) {
                ret += this.int2char(v >> 2);
                slop = v & 3;
                k = 1;
            } else if (k === 1) {
                ret += this.int2char((slop << 2) | (v >> 4));
                slop = v & 0xf;
                k = 2;
            } else if (k === 2) {
                ret += this.int2char(slop);
                ret += this.int2char(v >> 2);
                slop = v & 3;
                k = 3;
            } else {
                ret += this.int2char((slop << 2) | (v >> 4));
                ret += this.int2char(v & 0xf);
                k = 0;
            }
        }
        if (k === 1) {
            ret += this.int2char(slop << 2);
        }
        return ret;
    };
    hex2b64 = function (h) {
        var i;
        var c;
        var ret = '';
        for (i = 0; i + 3 <= h.length; i += 3) {
            c = parseInt(h.substring(i, i + 3), 16);
            ret += this.b64map.charAt(c >> 6) + this.b64map.charAt(c & 63);
        }
        if (i + 1 === h.length) {
            c = parseInt(h.substring(i, i + 1), 16);
            ret += this.b64map.charAt(c << 2);
        } else if (i + 2 === h.length) {
            c = parseInt(h.substring(i, i + 2), 16);
            ret += this.b64map.charAt(c >> 2) + this.b64map.charAt((c & 3) << 4);
        }
        while ((ret.length & 3) > 0) {
            ret += this.b64pad;
        }
        return ret;
    };
    // 分段加密
    encryptLong = function (string) {
        var k = this.getKey();
        // var maxLength = (((k.n.bitLength() + 7) >> 3) - 11);//117
        try {
            // var lt = '';
            var ct = '';
            // RSA每次加密117bytes，需要辅助方法判断字符串截取位置
            // 1.获取字符串截取点
            var bytes = [];
            bytes.push(0);
            var byteNo = 0;
            var len, c;
            len = string.length;
            var temp = 0;
            for (var i = 0; i < len; i++) {
                c = string.charCodeAt(i);
                if (c >= 0x010000 && c <= 0x10FFFF) {
                    byteNo += 4;
                } else if (c >= 0x000800 && c <= 0x00FFFF) {
                    byteNo += 3;
                } else if (c >= 0x000080 && c <= 0x0007FF) {
                    byteNo += 2;
                } else {
                    byteNo += 1;
                }
                if ((byteNo % 117) >= 114 || (byteNo % 117) === 0) {
                    if (byteNo - temp >= 114) {
                        bytes.push(i);
                        temp = byteNo;
                    }
                }
            }
            // 2.截取字符串并分段加密
            if (bytes.length > 1) {
                for (let i = 0; i < bytes.length - 1; i++) {
                    var str;
                    if (i === 0) {
                        str = string.substring(0, bytes[i + 1] + 1);
                    } else {
                        str = string.substring(bytes[i] + 1, bytes[i + 1] + 1);
                    }
                    var t1 = k.encrypt(str);
                    ct += t1;
                }
                ;
                if (bytes[bytes.length - 1] !== string.length - 1) {
                    var lastStr = string.substring(bytes[bytes.length - 1] + 1);
                    ct += k.encrypt(lastStr);
                    // debugger;
                }
                return this.hex2b64(ct);
            }
            var t = k.encrypt(string);
            var y = this.hex2b64(t);
            return y;

        } catch (ex) {
            return false;
        }
    };
    // 分段解密长字符串
    decryptLong = function (text) {
        // Return the decrypted string.
        // console.log(this);
        var k = this.getKey();
        var maxLength = 128;
        try {
            var str = this.b64tohex(text);
            // var b=hex2Bytes(str);

            var inputLen = str.length;

            var ct = '';

            if (inputLen > maxLength) {

                var lt = str.match(/.{1,256}/g);
                lt.forEach(function (entry) {
                    var t1 = k.decrypt(entry);
                    // console.log(t1)
                    ct += t1;
                });
                return ct;
            }
            var y = k.decrypt(this.b64tohex(text));
            return y;
        } catch (ex) {
            return false;
        }
    };
}
//任意长度RSA Key分段加密解密长字符串

//获取RSA key 长度
JSEncrypt.prototype.getkeylength = function () {
    return ((this.key.n.bitLength() + 7) >> 3);
};

// 分段解密，支持中文
JSEncrypt.prototype.decryptUnicodeLong = function (string) {
    var k = this.getKey();
    //解密长度=key size.hex2b64结果是每字节每两字符，所以直接*2
    var maxLength = ((k.n.bitLength() + 7) >> 3) * 2;
    try {
        var hexString = b64tohex(string);
        var decryptedString = "";
        var rexStr = ".{1," + maxLength + "}";
        var rex = new RegExp(rexStr, 'g');
        var subStrArray = hexString.match(rex);
        if (subStrArray) {
            subStrArray.forEach(function (entry) {
                decryptedString += k.decrypt(entry);
            });
            return decryptedString;
        }
    } catch (ex) {
        return false;
    }
};

// 分段加密，支持中文
JSEncrypt.prototype.encryptUnicodeLong = function (string) {
    var k = this.getKey();
    //根据key所能编码的最大长度来定分段长度。key size - 11：11字节随机padding使每次加密结果都不同。
    var maxLength = ((k.n.bitLength() + 7) >> 3) - 11;
    try {
        var subStr = "", encryptedString = "";
        var subStart = 0, subEnd = 0;
        var bitLen = 0, tmpPoint = 0;
        for (var i = 0, len = string.length; i < len; i++) {
            //js 是使用 Unicode 编码的，每个字符所占用的字节数不同
            var charCode = string.charCodeAt(i);
            if (charCode <= 0x007f) {
                bitLen += 1;
            } else if (charCode <= 0x07ff) {
                bitLen += 2;
            } else if (charCode <= 0xffff) {
                bitLen += 3;
            } else {
                bitLen += 4;
            }
            //字节数到达上限，获取子字符串加密并追加到总字符串后。更新下一个字符串起始位置及字节计算。
            if (bitLen > maxLength) {
                subStr = string.substring(subStart, subEnd)
                encryptedString += k.encrypt(subStr);
                subStart = subEnd;
                bitLen = bitLen - tmpPoint;
            } else {
                subEnd = i;
                tmpPoint = bitLen;
            }
        }
        subStr = string.substring(subStart, len)
        encryptedString += k.encrypt(subStr);
        return hex2b64(encryptedString);
    } catch (ex) {
        return false;
    }
};
//添加的函数与方法结束


//加密
const encrypt = (publicKey, value) => {
    let encrypt = new JsEncryptNew();
    encrypt.setPublicKey(publicKey);
    return encrypt.encryptLong(value);
}


//解密
const decrypt = (privateKey, value) => {
    let decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    return decrypt.decryptUnicodeLong(value);
}


export default {
    decrypt,
    encrypt
}
