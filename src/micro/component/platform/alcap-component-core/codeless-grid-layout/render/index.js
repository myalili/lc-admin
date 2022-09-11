// import ScreenPanel from "./ScreenPanel";
import screenPage from "./screenPage";
import screenCtn from "./screenCtn";
import v2ScreenPanel from "./screenPanel.vue";
import v2ScreenDig from "./screenDig.vue"

import v2Container from "./runtime/v2-container";
import screenTabBtn from "./runtime/screen-tab-btn";
import screenCaliber from "./runtime/screen-caliber";
import screenSorter from "./runtime/screen-sorter";
import v2Switchable from "./runtime/v2-switchable.vue";
import mobileScreenPanel from "./mobile/mobileScreenPanel.vue";
import pcScreenPanel from "./pc/pcScreenPanel.vue";
import pcScreenPage from "./pc/pcScreenPage.vue";

// Vue.component("v2-screen-panel", ScreenPanel);
// Vue.component("v2-screen-page", screenPage);
// Vue.component("v2-screen-ctn", screenCtn);
window.screenComponent = {
  // "v2-screen-panel": ScreenPanel,
  "v2-screen-page": screenPage,
  "v2-screen-ctn": screenCtn,
  "v2-screen-dig": v2ScreenDig,
  v2container: v2Container,
  "v2-screen-panel": v2ScreenPanel,
  "v2-switchable": v2Switchable,
  "v2-screen-btn": screenTabBtn,
  "v2-screen-caliber": screenCaliber,
  "v2-screen-sorter": screenSorter,
  "v2-screen-dig": v2ScreenDig,
  "mobile-screen-panel": mobileScreenPanel,
  "pc-screen-panel":pcScreenPanel,
  "pc-screen-page":pcScreenPage,
};