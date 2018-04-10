<template>
  <nav id="catalog-nav">
    <div class="catalog-div">
      {{children}}
      <catalog-tree v-for="item in catalogArray" :key="item" :catalog-obj="catalogObj[item]" :catalog-name="item" :catalog-url="path+item" :catalog-level="level" :catalog-visible="catalogVisible" :padding-left="paddingLeft" :children="children">
      </catalog-tree>
    </div>
  </nav>
</template>

<script>
import CatalogTree from './CatalogTree.vue'
import CatalogObj from '../../assets/js/init-catalog'

export default {
  data() {
    return {
      catalogObj: null,
      catalogArray: null,
      path: '/',
      level: 0,
      catalogVisible: true,
      paddingLeft: 10,
      children: {
        num: 0
      }
    }
  },
  computed: {},
  created() {
    this.catalogObj = CatalogObj
    this.catalogArray = Object.keys(CatalogObj)
    this.children.num = this.catalogArray.length
  },
  methods: {},
  components: {
    CatalogTree
  }
}
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  background: #222629;
  width: 300px;
  height: 100%;
  box-shadow: inset -0.25em 0 0.25em 0 rgba(0, 0, 0, 0.1);
  color: #fff;
  left: 0;
  overflow-y: auto;
  position: fixed;
  text-align: left;
  top: 0;
}

@media screen and (max-width: 700px) {
  nav {
    background: #222629;
    width: 100%;
    height: 200px;
    box-shadow: inset -0.25em 0 0.25em 0 rgba(0, 0, 0, 0.1);
    color: #fff;
    left: 0;
    overflow-y: auto;
    position: fixed;
    text-align: center;
    top: 0;
  }
}

.catalog-div {
  position: relative;
  height: 500px;
}
</style>

