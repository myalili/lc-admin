<template>
  <div class="aweb-tabs-container">
    <el-tabs
      class="aweb-tabs"
      v-model="activeTab"
      hide-add
      type="border-card"
      v-if="openedTabs.length"
    >
      <el-tab-pane
        v-for="item in openedTabs"
        :key="item.path"
        :name="item.path"
      >
        <div
          slot="label"
          class="aweb-tab"
          @contextmenu="(e) => openRightMenu(item, e)"
        >
          <div class="aweb-tab-title" @click="tabClick(item)">
            {{
              (item.path === meta.__path && meta.title) ||
              (item.meta && item.meta.title)
            }}
          </div>

          <i
            v-if="!(item.meta && item.meta.fixed)"
            @click.stop="tabRemove(item.path)"
            class="aweb-tab-icon-close el-icon-close"
          ></i>
        </div>
      </el-tab-pane>
    </el-tabs>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="aweb-contextmenu"
    >
      <template v-for="item in rightMenuData">
        <li
          :key="item.key"
          v-if="
            !(
              currentMenu &&
              currentMenu.meta &&
              currentMenu.meta.fixed &&
              item.key === 'close'
            )
          "
          @click="rightMenuClick(item.key)"
        >
          {{ item.name }}
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
// import iFrame from "./iframe/index.vue";
export default {
  mixins: [window.V8.mixins],
  components: {
    // iFrame,
  },
  data() {
    return {
      meta: {},
      visible: false,
      left: 0,
      top: 25,
      rightMenuData: [
        {
          name: "刷新此窗口",
          key: "refresh",
        },
        {
          name: "关闭此窗口",
          key: "close",
        },
        {
          name: "关闭左侧窗口",
          key: "closeLeft",
        },
        {
          name: "关闭右侧窗口",
          key: "closeRight",
        },
        {
          name: "关闭全部窗口",
          key: "closeAll",
        },
      ],
      currentMenu: null,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        let _to = {};
        _to.path = to.path;
        _to.meta = to.meta;
        _to.query = to.query;
        _to.params = to.params;
        let routeConfig = window.V8.getCurrentRoute(to.path);
        if (routeConfig) {
          _to.meta = { ..._to.meta, ...routeConfig.meta };
        }
        if (to.path === "/") {
          return;
        }
        if (/^\/redirect/.test(to.path)) {
          return;
        }
        let inTabs = this.openedTabs.some((item) => item.path === to.path);
        if (inTabs) {
          this.$store.commit("tabs/SET_ACTIVE_TAB", _to.path);
        } else if (to.meta.type === "SELF") {
          this.$store.commit("tabs/ADD_SELF_TABS", _to);
        } else {
          this.$store.commit("tabs/ADD_TABS", _to);
        }
        let newOpenedTabs = this.openedTabs.map((item) => {
          let itemRoute = window.V8.getCurrentRoute(item.path);
          if (itemRoute) {
            let meta = { ...item.meta, ...itemRoute.meta };
            item = { ...item, ...itemRoute };
            item.meta = meta;
          }
          return item;
        });
        this.$store.commit("tabs/SET_TABS", newOpenedTabs);
      },
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeRightMenu);
      } else {
        document.body.removeEventListener("click", this.closeRightMenu);
      }
    },
    activeTab: {
      immediate: true,
      handler(nV, v) {
        if (nV !== v && nV !== this.$route.path) {
          let info = this.openedTabs.filter((item) => item.path === nV);
          if (info.length) {
            info = info[0];
            this.open({
              path: info.path,
              params: info.query || {},
            });
          }
        }
      },
    },
  },
  computed: {
    activeTab: {
      get() {
        return this.$store.state.tabs.activeTab;
      },
      set(newValue) {
        this.$store.commit("tabs/SET_ACTIVE_TAB", newValue);
      },
    },

    openedTabs() {
      return this.$store.state.tabs.openedTabs;
    },
  },
  mounted() {},
  methods: {
    rightMenuClick(key) {
      switch (key) {
        case "refresh":
          if (this.currentMenu.path === this.activeTab) {
            this.$router.replace({
              path: "/redirect" + this.currentMenu.path,
              query: this.currentMenu.query,
            });
          }

          break;

        case "close":
          this.$store.commit("tabs/DELETE_TABS", this.currentMenu.path);

          break;
        case "closeLeft":
          this.$store.commit("tabs/DELETE_LEFT_TABS", this.currentMenu.path);

          break;
        case "closeRight":
          this.$store.commit("tabs/DELETE_RIGHT_TABS", this.currentMenu.path);

          break;

        case "closeAll":
          this.$store.commit("tabs/DELETE_ALL_TABS");
          break;
      }
    },
    tabClick(tab) {
      let info = this.openedTabs.filter((item) => item.path === tab.path);
      if (info && info.length) {
        info = info[0];
        this.$router.replace({
          path: info.path,
          query: info.query || {},
        });
      }
    },
    tabRemove(path) {
      this.$store.commit("tabs/DELETE_TABS", path);
      if (!this.openedTabs.length) {
        this.$router.push("/");
      }
    },
    openRightMenu(item, e) {
      if (item) {
        e.stopPropagation();
        e.preventDefault();
        // const menuMinWidth = 105;
        // const offsetLeft = el.getBoundingClientRect().left;
        // const offsetWidth = el.offsetWidth;
        // const maxLeft = offsetWidth - menuMinWidth;
        // const left = e.clientX - offsetLeft;

        // if (left > maxLeft) {
        //   this.left = maxLeft;
        // } else {
        //   this.left = left;
        // }

        this.left = e.clientX;
        this.top = e.clientY;
        this.currentMenu = item;

        this.visible = true;
      }
    },
    closeRightMenu() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less">
.aweb-tabs-container {
  overflow: hidden;
  //   padding: 8px 20px 0;
}

.aweb-tabs {
  //   height: 32px;
  overflow: hidden;
  border-bottom: none;
  > .el-tabs__header {
    margin: 0;
  }
  > .el-tabs__content {
    padding: 0;
  }
  .aweb-tab {
    position: relative;
    .aweb-tab-title {
      display: inline-block;
      vertical-align: middle;
    }
    .aweb-tab-icon-close {
      margin: 0 -4px 0 8px;
      vertical-align: middle;
      font-size: 12px;
    }
  }
}
.aweb-contextmenu {
  margin: 0;
  background: rgba(255, 255, 255, 1);

  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  border-radius: 4px;
  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
    &:hover {
    }
  }
}
</style>
