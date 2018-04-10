<template>
  <div>
    <div v-for="item in catalogArray" class="catalog-node-div" :key="item.name">
      <div v-if="item.children" @click.stop="clickCatalog(item)">{{item.name}}
        <catalog-tree v-show="item.open" :catalog-array="item.children" :catalog-url="getUrl(item)" :father-level="catalogLevel">
        </catalog-tree>
      </div>

      <div v-else @click.stop="getBlog(item)">{{item.name}}</div>

    </div>
  </div>
</template>

<script>
import CatalogTree from './CatalogTree.vue'

export default {
  name: 'catalog-tree',
  data() {
    return {
      catalogLevel: {
        num: 1
      }
    }
  },
  props: {
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
      type: Object
      // default: () => {
      //   return {
      //     num: 1
      //   }
      // }
    }
  },
  computed: {
    style() {
      return { height: `${(this.catalogLevel.num + 1) * 18}px` }
    }
  },
  created() {
    // this.catalogLevel.num = this.catalogArray.length
  },
  mounted() {
    // console.log(this.$refs)
  },
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
    getBlog(item) {
      this.$router.push({ path: this.getUrl(item) })
    },
    clickCatalog(item) {
      let oldOpen = item.open
      this.catalogArray.forEach(element => {
        element.open = false
      })
      item.open = !oldOpen

      let level = 1
      let childrenArray = item.children
      if (!oldOpen) {
        /*         childrenArray.forEach(element => {
          console.log(element.level)
          level += element.level
          console.log(level)
        }) */
        this.catalogArray.forEach(elememt => {
          level += elememt.level
        })
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
}

.catalog-node-div:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.15);
}
</style>
