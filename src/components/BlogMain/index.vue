<template>
  <main style="    overflow: auto;">
    <transition name="slide-fade">
      <router-view class="markdown-body blog-div" ref="markdown"></router-view>
    </transition>
    <top-scroll></top-scroll>
  </main>
</template>

<script>
// import MarkdownToHtml from '../../assets/js/show-down'
import TopScroll from '../TopScroll'
import MarkdownToHtml from '../../assets/js/markdown-html'

export default {
  mounted() {},
  updated() {
    let markdownElement = this.$refs.markdown.$el
    markdownElement.innerHTML = MarkdownToHtml(
      markdownElement.innerHTML.replace(/&gt;/g, '>')
    )
  },
  methods: {},
  watch: {},
  components: {
    TopScroll
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/markdown-body.css'; /*引入公共样式*/
@import '../../assets/css/fade.css'; /*引入公共样式*/

.blog-div {
  padding: 20px 10px;
}
</style>
