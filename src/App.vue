<template>
  <div id="app">
    <catalog-nav></catalog-nav>
    <main>
     <transition name="slide-fade">
    <router-view class="markdown-body" ref="markdown"></router-view>
     </transition>
     </main>
  </div>
</template>

<script>
import CatalogNav from './components/CatalogNav'

export default {
  data() {
    return {
    }
  },
  computed: {
    getMarkDownText() {
      return MARKDOWN_CONVERTER.makeHtml()
    }
  },
  methods: {},
  watch: {
    $route: function(val, oldVal) {
      console.log('route change', val, oldVal)
    }
  },
  beforeUpdate() {
  },
  updated() {
    let markdownElement = this.$refs.markdown.$el
    markdownElement.innerHTML = MARKDOWN_CONVERTER.makeHtml(
      markdownElement.innerHTML
    )
  },
  components: {
    CatalogNav
  }
}
</script>


<style lang="scss">
 @import './assets/css/markdown-body.css'; /*引入公共样式*/

main {
  margin-left: 300px;
}

/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.6s ease 0.2s;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.none-display {
  display: none;
}
</style>
