<template>
  <div class="not-found-ctn">
    <img src="/img/403.png" class="no-found-img" alt />
    <div class="not-found-text">
      <p>403 Forbidden</p>
      <span>服务器拒绝请求</span>
      <p>您没权限访问此页面，或者单击下面的按钮返回主页。</p>
      <button class="not-found-btn" @click="$router.push('/')">返回主页</button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.not-found-ctn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .no-found-img {
  }
  .not-found-text {
    color: #000;
    padding-left: 30px;
    > span {
      display: block;
      margin: 6px 0 10px;
    }
  }
  .not-found-btn {
    width: 80px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    background-color: rgb(25, 41, 50);
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    outline: none;
    box-shadow: none;
    margin-top: 30px;
  }
}
</style>