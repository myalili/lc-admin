<template>
    <el-input type="textarea" :rows="20" v-model="value" :placeholder="placeholder"></el-input>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      placeholder: `复刻用
    [
        {
            "createTime": "1648625509680",
            "createUserName": "agreeOwner",
            "updateTime": "1648625509680",
            "updateUserName": "agreeOwner",
            "id": "entity-field-0AsjLhwv",
            "name": "AVBLAM",
            "primaryKey": "0",
            "desc": "可用余额",
            "displayType": "",
            "code": "",
            "type": "string",
            "validations": []
        },
    ]
      `
    }
  }
}
</script>

<style>

</style>