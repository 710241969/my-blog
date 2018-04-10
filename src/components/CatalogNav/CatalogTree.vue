<template>
  <div v-if="catalogObj.children" class="catalog-node-div" :style="style" @click.stop="clickCatalog">{{catalogObj.name}}
    <catalog-tree v-show="catalogObj.open" v-for="item in catalogObj.children" :key="item.name" :catalog-obj="item" :catalog-array="catalogObj.children" :catalog-url="getUrl(catalogObj)" :father-level="catalogLevel" ref="item">
    </catalog-tree>
  </div>
  <div v-else class="catalog-node-div" @click.stop="getBlog()">{{catalogObj.name}}</div>
</template>

<script>
import CatalogTree from './CatalogTree.vue'

export default {
  name: 'catalog-tree',
  data() {
    return {
      catalogLevel: {
        num: 1
      },
      height: 18
    }
  },
  props: {
    catalogObj: {
      type: Object
    },
    catalogArray: {
      // type: Object,
      // default: 0,
      // required: true,
      // validator: () => {}
    },
    catalogUrl: {
      type: String,
      default: ''
      // required: true,
      // validator: () => {}
    },
    fatherLevel: {
      type: Object,
      default: () => {
        return {
          num: 1
        }
      }
    }
  },
  computed: {
    style() {
      return { height: `${this.getCatalogLevel() * this.height}px` }
    }
  },
  created() {},
  mounted() {},
  methods: {
    getCatalogLevel() {
      return this.catalogLevel.num
    },
    setCatalogLevel(num) {
      this.catalogLevel.num = num
    },
    getUrl(item) {
      return this.catalogUrl + '/' + item.name
    },
    getBlog() {
      this.$router.push({ path: this.getUrl(this.catalogObj) })
    },
    clickCatalog() {
      let oldOpen = this.catalogObj.open
      this.catalogArray.forEach(element => {
        element.open = false
      })
      this.catalogObj.open = !oldOpen

      let level = 1
      let childrenArray = this.$refs.item
      if (!oldOpen) {
        childrenArray.forEach(elememt => {
          level += elememt.getCatalogLevel()
        })
      }
      this.setCatalogLevel(level)
    }
  },
  watch: {
    'catalogLevel.num': function(val, oldVal) {
      this.fatherLevel.num += val - oldVal
    },
    'catalogObj.open': function(val, oldVal) {
      if (false == val) {
        this.setCatalogLevel(1)
      }
    }
  },
  components: {
    CatalogTree
  }
}
</script>

<style lang="scss" scoped>
.catalog-node-div {
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  transition: all 0.3s;
  // padding-top: 10px;
  // padding-bottom: 10px;
  margin-left: 10px;
}

.catalog-node-div:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.15);
}
</style>
