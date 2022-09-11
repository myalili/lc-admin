# 使用文档
【管道说明】

## 参数
共【1】个参数:
- `【code】`, 加解密需要的参数，必填

## 使用方法

```
base64
// 加密
pipe.base64.encode(code)

// 解密
pipe.base64.decode(code)
```

## 使用例子
```
pipe.base64.encode(12345678) // MTIzNDU2Nzg=

pipe.base64.decode(MTIzNDU2Nzg=) // 1234678

```
