<template>
  <div class="w-full">
    <!-- 卡片 -->
    <div
      class="w-full flex items-center my-3"
      style="padding: 0 8%"
      v-if="stepActive === 2 && position === 'top'"
    >
      <div
        class="card-item-wrapper rounded-lg w-80 box-border h-24 mr-7 pr-2"
        style="background: rgba(0, 0, 0, 0.04)"
        v-for="item in formData.stepConfig.resultCard"
        :key="item.id"
      >
        <div class="container h-full flex items-center ml-8 box-border">
          <div class="w-10 h-10 mr-6">
            <codeless-icon
              v-if="item.icon"
              style="width: 100%; height: 100%"
              :icon="
                item.icon.indexOf('icon') > -1 ? item.icon : 'icon-' + item.icon
              "
            ></codeless-icon>
          </div>
          <div class="content-warpper">
            <p
              class="text-sm mb-1 font-medium"
              style="color: rgba(0, 0, 0, 0.65)"
            >
              {{ item.desc }}
            </p>
            <p
              class="text-xl font-bold"
              style="color: rgba(0, 0, 0, 0.65); max-width: 200px"
            >
              {{ formatValue(searchForm[item.engNameShort]) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果 -->
    <div
      class="
        step-result
        w-full
        border border-green-500
        bg-green-50
        flex
        items-center
        py-9
        px-12
      "
      v-if="stepActive === 3 && position === 'top'"
    >
      <div class="flex">
        <i class="el-icon-circle-check text-green-500 text-6xl mr-3"></i>
        <span>
          <p class="font-bold text-green-500 text-xl">
            {{ formData.stepConfig.resultTitle }}
          </p>
          <p class="mt-1">{{ formData.stepConfig.resultDetail }}</p>
          <p class="mt-1">{{ formData.stepConfig.resultDesc }}</p>
        </span>
      </div>
    </div>

    <!-- 详情折叠和展开 -->
    <div
      class="
        step-collapse
        h-10
        w-full
        flex
        items-center
        justify-between
        border-t border-b border-gray-300
        my-4
      "
      v-if="stepActive === 3 && position === 'top'"
    >
      <div class="collapse-top w-full h-full flex items-center justify-between">
        <span class="top-title text-base font-bold">
          <i class="el-icon-tickets mr-1 text-base"></i>
          <span>{{ formData.stepConfig.dealDesc }}</span>
        </span>
        <span
          class="cursor-pointer"
          @click="$parent.collapse = !$parent.collapse"
        >
          <span class="">{{ $parent.collapse ? "收起" : "展开" }}详情</span>
          <i
            :class="
              $parent.collapse ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
            "
          ></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "stepComponents",
  props: {
    formData: {
      type: Object,
      default() {
        return {};
      },
    },
    stepActive: {
      type: Number,
      default() {
        return 1;
      },
    },
    searchForm: {
      type: Object,
      default() {
        return {};
      },
    },
    position: {
      type: String,
      default() {
        return "top";
      },
    },
  },
  data() {
    return {
      collapse: false,
    };
  },
  computed: {
    formatValue() {
      return (value) => {
        if (value && !isNaN(value)) {
          if (value.indexOf(".") > -1) {
            let fValue = Number(value).toFixed(2);
            console.log(fValue, fValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            return fValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          } else {
            return value.replace(/\B(?=(\d{4})+(?!\d))/g, " ");
          }
        } else {
          return value;
        }
      };
    },
  },
};
</script>

<style>
</style>