<template>
  <main class="blog-main">
    <div class="blog-div">
      <transition name="slide-fade">
        <router-view class="markdown-body no-border" ref="markdown"></router-view>
      </transition>
    </div>
    <top-scroll></top-scroll>
  </main>
</template>

<script>
import { BlogRequireContext } from "../../assets/js/blog-require-context";
import TopScroll from "../TopScroll";

export default {
  computed: {
    currentUrl() {
      // console.log(1)
      // let markdownElement = this.$refs.markdown.$el
      // markdownElement.innerHTML = require('../../../blogs' +
      //   this.$store.state.currentUrl +
      //   '.md')
      // return this.$store.state.currentUrl
      return this.$route;
    }
  },
  watch: {
    $route: function(val, oldVal) {
      // if(val==='/'){

      // }
      // console.log(val)
      // console.log("watch");
      this.renderMarkdown();
    }
  },
  created() {},
  mounted() {
    // console.log("mounted");
    // console.log(this.$refs);
    this.renderMarkdown();
  },
  updated() {
    // console.log("update");
  },
  methods: {
    renderMarkdown() {
      // console.log(BlogRequireContext("." + this.$route.path + ".md"));
      let markdownElement = this.$refs.markdown.$el;
      if (this.$route.path === "/home") {
        markdownElement.innerHTML = require("./home.md");
        return;
      }
      markdownElement.innerHTML =
        // await (() =>
        // import("../../../blogs" + this.$route.path + ".md"))();
        //  await (resolve =>
        //     require.ensure([], () =>
        //       resolve(require("../../../blogs" + this.$route.path + ".md"))
        //     ))();
        //   );
        // resolve =>
        // require.ensure([], () =>
        //   require(BlogRequireContext("." + this.$route.path + ".md"))
        // );
        // BlogRequireContext("." + this.$route.path + ".md");

        require("../../../blogs" + this.$route.path + ".md");
    }
  },
  components: {
    TopScroll
  }
};
</script>

<style lang="scss" scoped>
// @import '../../assets/css/markdown-body.scss'; /*引入公共样式*/
@import "../../assets/css/fade.css"; /*引入公共样式*/

.blog-div {
  padding: 20px 10px;
}
.no-border {
  border: none;
  white-space: pre-line;
}
</style>
