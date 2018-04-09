<template>
  <main>
    <transition name="slide-fade">
      <router-view class="markdown-body" ref="markdown"></router-view>
    </transition>
    <top-scroll></top-scroll>
  </main>
</template>

<script>
import MarkdownToHtml from '../../assets/js/show-down'
import TopScroll from '../TopScroll'

export default {
  mounted() {},
  updated() {
    console.log('更新视图完成updated')
    let markdownElement = this.$refs.markdown.$el
    markdownElement.innerHTML = MarkdownToHtml(markdownElement.innerHTML)
  },
  methods: {},
  components: {
    TopScroll
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/markdown-body.css'; /*引入公共样式*/
@import '../../assets/css/fade.css'; /*引入公共样式*/
</style>
