import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 引入重置样式表
import "./assets/css/reset.css";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
