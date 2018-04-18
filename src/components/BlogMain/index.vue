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
import TopScroll from '../TopScroll'

export default {
  computed: {
    currentUrl() {
      // console.log(1)
      // let markdownElement = this.$refs.markdown.$el
      // markdownElement.innerHTML = require('../../../blogs' +
      //   this.$store.state.currentUrl +
      //   '.md')
      // return this.$store.state.currentUrl
      return this.$route

    }
  },
  watch: {
    $route: function(val, oldVal) {
this.renderMarkdown()
    }
  },
  created(){},
  mounted() {
    this.renderMarkdown()
  },
  updated() {},
  methods: {
    renderMarkdown(){
          let markdownElement = this.$refs.markdown.$el      
    markdownElement.innerHTML = require('../../../blogs' + this.$route.path+ '.md')
    }
  },
  components: {
    TopScroll
  }
}
</script>

<style lang="scss" scoped>
// @import '../../assets/css/markdown-body.scss'; /*引入公共样式*/
@import '../../assets/css/fade.css'; /*引入公共样式*/

.blog-div {
  padding: 20px 10px;
}
.no-border {
  border: none;
  white-space: pre-line;
}
</style>
