<template>
  <nav id="catalog-nav">
    <div class="catalog-div">
      <catalog-tree :catalog-array="catalogArray" :father-level="catalogLevel"></catalog-tree>
    </div>
  </nav>
</template>

<script>
import CatalogTree from './CatalogTree.vue'
import CatalogArray from '../../assets/js/init-catalog-array'

export default {
  data() {
    return {
      catalogArray: null
    }
  },
  computed: {
    catalogLevel() {
      return {
        num: this.catalogArray.length
      }
    }
  },
  created() {
    this.catalogArray = CatalogArray
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

