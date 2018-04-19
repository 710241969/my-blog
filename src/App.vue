<template>
  <div id="app">
    <catalog-nav :catalog-obj="catalogRoot"></catalog-nav>
    <blog-main></blog-main>
  </div>
</template>

<script>
import CatalogNav from './components/CatalogNav'
import BlogMain from './components/BlogMain'
import CatalogArray from './assets/js/init-catalog-array'

export default {
  data() {
    return {
      catalogArray: null,
      catalogRoot: null
    }
  },
  computed: {},
  methods: {
    setOpenDialog(url) {
      this.catalogArray.forEach(element => {
        element.open = false
      })

      let urlQueue = url.substring(1).split('/')
      let catalogArrayItm = this.catalogArray
      while (urlQueue && urlQueue.length) {
        let urlItem = urlQueue.shift()
        for (let i = 0, len = catalogArrayItm.length; i < len; i++) {
          let catalogItem = catalogArrayItm[i]
          if (catalogItem.name == urlItem && catalogItem.children) {
            catalogItem.open = true
            catalogArrayItm = catalogItem.children
            break
          }
        }
      }
    }
  },
  watch: {
    $route: function(val, oldVal) {
      // this.$store.dispatch('setCurrentUrl', val.fullPath)
      this.setOpenDialog(val.path)
    }
  },
  created() {
    this.catalogArray = CatalogArray
    this.catalogRoot = {
      heightNum: 0,
      open: true,
      level: 0,
      children: CatalogArray
    }
    this.setOpenDialog(this.$route.path)
  },
  mounted() {},
  beforeUpdate() {},
  updated() {},
  components: {
    CatalogNav,
    BlogMain
  }
}
</script>


<style lang="scss">
@import './assets/css/markdown-body.scss'; /*引入公共样式*/
@import './assets/css/high-light.css';
@import './assets/css/style.scss'; /*移动端适配样式*/
// ！！！注意顺序
@import './assets/css/mobile-media.scss'; /*移动端适配样式*/

main {
  margin-left: 300px;
}
</style>
