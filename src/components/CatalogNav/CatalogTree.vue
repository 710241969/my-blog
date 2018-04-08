<template>
    <div v-if="isFile" class="catalog-node-div"   
    @click="getBlog">{{this.catalogName}}</div>
    <div v-else 
    class="catalog-node-div"
    @click.stop="clickCatalog">{{this.catalogName}}
    <catalog-tree v-for="item in catalogArray" :key="item"
     :catalog-obj="catalogObj[item]" 
     :catalog-name="item" 
     :catalog-url="catalogUrl+'\/'+item" 
     :catalog-level="catalogLevel+1">
    </catalog-tree>
    </div>
</template>

<script>
import CatalogTree from './CatalogTree.vue'
export default {
  name: 'catalog-tree',
  data() {
    return {
      catalogArray: null,
      divClass: 'catalog-node-div',
      displayClass: 'none-display'
    }
  },
  props: {
    catalogObj: {
      // type: Object,
      // default: 0,
      // required: true,
      // validator: () => {}
    },
    catalogName: {
      // type: String
      // default: 0,
      // required: true,
      // validator: () => {}
    },
    catalogUrl: {
      tupe: String
    },
    catalogLevel: {}
  },
  computed: {
    isFile() {
      return !(this.catalogObj instanceof Object)
    },
    style() {
      return {
        height:
          this.catalogLevel == 0 ? this.catalogArray.length * 20 + 'px' : '0px',
        overflow: 'hidden'
      }
    }
  },
  created() {
    this.catalogArray = Object.keys(this.catalogObj)
  },
  methods: {
    getBlog() {
      // 对象
      this.$router.push({ path: this.catalogUrl })
    },
    clickCatalog(e) {
      console.log(e.target)
    }
  },
  components: {
    CatalogTree
  }
}
</script>


<style lang="scss" scoped>
.catalog-node-div {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
}

.catalog-node-div:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.15);
}
</style>
