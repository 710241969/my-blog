<template>
  <div id="app">
    <catalog-nav></catalog-nav>
    <blog-main></blog-main>
  </div>
</template>

<script>
import CatalogNav from './components/CatalogNav'
import BlogMain from './components/BlogMain'

export default {
  data() {
    return {}
  },
  computed: {},
  methods: {},
  watch: {
    $route: function(val, oldVal) {
      console.log('route change', val, oldVal)
    }
  },
  mounted() {
  },
  beforeUpdate() {},
  updated() {},
  components: {
    CatalogNav,
    BlogMain
  }
}
</script>


<style lang="scss">
@import './assets/css/markdown-body.css'; /*引入公共样式*/

main {
  margin-left: 300px;
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
