<template>
  <div class="add-department-content">
    <div>
      <span><span>*</span><span>名称</span></span>
      <input type="text" v-model="roles.name" placeholder="输入名称" />
    </div>
    <div>
      <span><span></span><span>备注</span></span>
      <textarea type="text" v-model="roles.desc" placeholder="输入备注" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roles: {
        name: "",
        desc: "",
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.add-department-content {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    > span {
      display: flex;
      width: 80px;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      span:first-child {
        color: #f65656;
      }
      span:last-child {
        font-size: 14px;
        font-weight: 400;
        color: var(--codeless-font-color-primary);
      }
    }

    > input {
      width: 350px;
      height: 30px;
      outline: none;
      border: 1px solid #a9bdc7;
      border-radius: 4px;
      margin-left: 16px;
      padding: 0px 12px 0px 12px;

      &::placeholder {
        font-size: 12px;
        font-weight: 400;
        color: #c0c4cc;
      }
      &:focus {
        border: 1px solid var(--color-primary);
      }
    }

    > textarea{
      width: 350px;
      height: 60px;
      outline: none;
      border: 1px solid #a9bdc7;
      border-radius: 4px;
      margin-left: 16px;
      padding: 0px 12px 0px 12px;

      &::placeholder {
        font-size: 12px;
        font-weight: 400;
        color: #c0c4cc;
      }
      &:focus {
        border: 1px solid var(--color-primary);
      }
    }
  }
  >div:last-child{
    align-items: flex-start;
    margin-bottom: 20px;
    margin-top:20px;
    >span {
      margin-top:2px;
    }
  }
}
</style>