<template>
  <div class="aside-container">
    <div
      v-if="fieldItem && fieldItem.length > 0"
      class="field-container"
    >
      <!-- <div class="desc-container">
        <div class="field-name">
          <span>中文名称：</span>
          <span>{{ fieldItem.validationRuleType.name }}</span>
        </div>
        <div class="field-desc">
          <span>描述：</span>
          <span>{{ fieldItem.validationRuleType.desc }}</span>
        </div>
      </div> -->
      <div class="valid-container">
        <div class="valid-container-title">校验条件</div>
        <div
          v-for="(item, index) in fieldItem"
          :key="index"
        >
          <div v-if="item.type == '1'" class="valid-box">
            <div class="valid-title">长度检查：</div>
            <div class="valid-detail">
              <span>错误提示：：</span>
              <span>{{ item.tips }}</span>
            </div>
            <div class="valid-detail">
              <span>最大长度：</span>
              <span>{{ item.maxLength }}</span>
            </div>
            <div class="valid-detail">
              <span>最大长度：</span>
              <span>{{ item.minLength }}</span>
            </div>
            <div class="valid-detail">
              <span>是否汉字：</span>
              <span>{{ item.chinese == "1" ? "是" : "否" }}</span>
            </div>
          </div>

          <div v-if="item.type == '2'" class="valid-box">
            <div class="valid-title">精度检查：</div>
            <div class="valid-detail">
              <span>错误提示：</span>
              <span>{{ item.tips }}</span>
            </div>
          </div>

          <div v-if="item.type == '3'" class="valid-box">
            <div class="valid-title">阈值检查：</div>
            <div class="valid-detail">
              <span>错误提示：</span>
              <span>{{ item.tips }}</span>
            </div>
          </div>

          <div v-if="item.type == '4'" class="valid-box">
            <div class="valid-title">格式检查：</div>
            <div class="valid-detail">
              <span>错误提示：</span>
              <span>{{ item.tips }}</span>
            </div>
            <div class="valid-title">正则：</div>
            <div class="valid-detail">
              <span>错误提示：</span>
              <span>{{ item.regex }}</span>
            </div>
          </div>

          <div v-if="item.type == '5'" class="valid-box">
            <div class="valid-title">非空检查：</div>
            <div class="valid-detail">
              <span>错误提示：</span>
              <span>{{ item.tips }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class=" flex  items-center flex-col" v-else>
      <img data-v-3904da1b="" style="width:60%; margin-top: 70px;" src="img/empty.png" alt="">
      <span class=" text-base font-bold mt-8" style="color: #333">该字段无校验条件</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fieldItem: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  mounted() {
    console.log(this.fieldItem);
  }
};
</script>

<style lang="scss" scoped>
.aside-container {
  padding: 15px;
  
    .field-container {
      .desc-container {
        margin-bottom: 40px;
        .field-name {
          margin-bottom: 20px;
        }
        .field-desc {
          margin-bottom: 20px;
        }
      }
      .valid-container {
        .valid-container-title {
          margin-bottom: 24px;
        }
        .valid-box {
          margin-bottom: 40px;
          .valid-title {
            margin-bottom: 20px;
            font-weight: bold;
          }
          .valid-detail {
            margin-bottom: 20px;
          }
        }
      }
    }
  
}
</style>