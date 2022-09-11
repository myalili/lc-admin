<template>
  <div class="w-full pt-5 box-border flex justify-between" style="heigth: 100px; padding: 20px 10% 0 10%;">
    <div class="ebank-footer-l">
      <img src="./img/logo.png" class="w-28 h-6 mb-1" alt="" />
      <p class="flex items-center" style="font-size: 12px; line-height:24px ">
        <span class="mr-6 flex items-center">
          <img
            class="mr-1"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAClklEQVQ4T4WTTUhUURTH/+c54+fCiUA0KAhKqkUbM8SZF1pgWAvfU4QIFQXfywz7oDaCRkqtaiMV2rzRIiGCkZlRF31QIb0pUYpUxCTMhTgZWpml4sw478SUH6Np3dXh3nN/3HP5/wjr1kG5ZKsZMWUCSARgYWYfmB9/i555OOR0Bv60swWg7+GKIu/b8hSZBLQAZFkPZmCYjGCB3n53aEOAVVJyBaJOZsyBuM7kNz/oSpiaylhMTDVBOAPmSgCTQYEP9Li02TUv2JVbFZMSuzACxpYQYHvt0frSj5Umm2OEnbNzwYGBp61zVlmpEECNDDi97jvqGkCmpBREEbUxcM3rttdY89RTJOAmAWYwvgDCcd3T1CvKihdAhm/0yL7R/hMfVv5AlJXrAF1CEGnzcfgYv4gJZp4GwQngNDG90T12q01SLxLhxuxMcsm7F/WtEQBVA1AeIGO7KUiJgokGQbilu+xVoqz2AbxNd2tJNkkpJqL78z+TKt8+u9q4CpDUehBqmY3sz/647uRY/xgxEkEYAJAOcLvu1iRRVuoAuvzj6/aC/pe1rhXAIbn8MEN4DuZ7ukcrs8qqjRgOEHYTuAtERXrU9KQYtAwDSBkdPLnHN5I9HpGDK4Io+wYBpC6ykdntae5dykE4Jxyul+cHuEl326v/CpKYpxxlwiMQxjgUynzV0fJpOUw2qTwLRE+IaS5gGHt7OjT/xkmU1QYCzgL8PkCc0+NyjNukiiyiUAeDEghGvu52tG8a5cLCwqiJoKWNiCQGfGBDIxKqmTkawAWvR2v4pwvhw7Q01Ry/I+wDipZGCDGMc1634/aqH5vIFCEQiflqDTPOwwiVetubO9fK9X/A7/79OcUJYQ/WmwlwLEAL4f1f73MbIABU7RMAAAAASUVORK5CYII="
            alt=""
            srcset=""
          />
          公司地址：上海市杨浦区政立路415号中航天盛广场B座7层
        </span> 
        <span class="mr-6 flex items-center">
          <img
            class="mr-1"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABvklEQVQ4T5WRvUtbURjGnyeRJIqKGbR2EBScrJvgFzdFUJSb0iYRMrQ6FEwCLqI4dC0uluIgOJTGD9CCg4tXIbq1YC4V/QOcbGkptEoRBwe/krxyrlyNH+TqO53znuf5vec8h7DqvUt79aebLndMzt1xM/Xp8LJfuPSQ0UAtlBgiMQyiTskFMmAuT885mdW5BQiE4ymQQdsggi3TSLY+AhDrB11f8g1ErnNjeearE8S6QUfHW1/G7/lNoOrKIDKUNqanHgRQIi0Sf0fwg5WBYNE0kn1O5qsM1KKtLVpcVO3fAVALwUjaSE4+CqDEgVC8R4h1kmcZyT7fNGa3nSBWBvkiLZyYIDEqIvs4z7abqbmfhSB3ANFo1L2X8a8AeAHBryzQ9d1I/siDqIFi7+8A7DzcTypWSXYB8h+Se502ar5pkb9jFLwBZfzfiW9hd33q9F6AgtTruvepr2YGQL8AOQA7BBqvvxkHAJY8fLZ6I4Pb7w2EE4MCqFxK7sni2IuW7oIAZWp+GavzFLkmIBIhea0XzJdK8KMjwJ6shWNNJEcA9gIolhxayxA8ejDABrXofeVeT6m2sfJ5TdeXKi8A9ReTB7mrHckAAAAASUVORK5CYII="
            alt=""
            srcset=""
          />
          联系我们：020-37583826
        </span>
      </p>
      <p style="font-size: 12px; line-height:24px ">
        <span class="mr-6">版权所有：科技股份有限公司</span>
        <span class="mr-6">备案号：京ICP备14027589号-1</span>
      </p>
    </div>
    <div class="ebank-footer-r text-center">
      <img style="width: 60px; height: 60px" src="./img/qrCode.jpg" alt="" srcset="" />
      <p  style="font-size: 12px; line-height:24px ">扫码关注</p>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";
export default {
  _options: pck.docs,
  name: 'v2AEbankFooter'
};
</script>

<style>
</style>