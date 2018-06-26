<template>
  <div class="catalog-div" :style="style">
    <div v-for="item in catalogArray" :key="item.name">

      <div class="catalog-node-div" :style="nodeStyle" @click.stop="item.children?clickCatalog(item):getBlog(item)">
        <span :class="[item.children?'right-chevron-i':'fa fa-book fa-fw']" :style="[{'transform':(item.open? 'rotate(90deg)':'')}]"></span>{{item.name}}
      </div>

      <div v-if="item.children">
        <catalog-tree :catalog-array="item.children" :catalog-url="getUrl(item)" :catalog-obj="item">
        </catalog-tree>
      </div>

    </div>
  </div>
</template>

<script>
import CatalogTree from './CatalogTree.vue'

export default {
  name: 'catalog-tree',
  data() {
    return {
      catalogArray: null
    }
  },
  props: {
    catalogUrl: {
      type: String,
      default: ''
      // required: true,
      // validator: () => {}
    },
    catalogObj: {}
  },
  computed: {
    style() {
      return { height: `${this.heightNum * 28}px` }
    },
    nodeStyle() {
      return { paddingLeft: `${(this.catalogObj.level + 1) * 10}px` }
    },
    heightNum() {
      let heightNum = 0
      if (this.catalogObj.open) {
        heightNum = this.catalogArray.length
        let children = this.catalogObj.children
        if (children) {
          children.forEach(item => {
            heightNum += item.heightNum
          })
        }
      }
      this.catalogObj.heightNum = heightNum
      return heightNum
    }
  },
  created() {
    this.catalogArray = this.catalogObj.children
  },
  mounted() {},
  methods: {
    getUrl(item) {
      return this.catalogUrl + '/' + item.name
    },
    getBlog(item) {
      this.$router.push({ path: encodeURI(this.getUrl(item)) })
    },
    clickCatalog(item) {
      let oldOpen = item.open
      this.catalogArray.forEach(element => {
        element.open = false
      })
      item.open = !oldOpen
    }
  },
  components: {
    CatalogTree
  }
}
</script>

<style lang="scss" scoped>
.catalog-div {
  overflow: hidden;
  transition: all 0.2s;
}

.catalog-node-div {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  transition: all 0.3s;
  padding: 5px 0 5px 0;
  white-space: nowrap;
  height: 18px;
}

.catalog-node-div:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 1);
}

.right-chevron-i {
  display: inline-block;
  top: 2px;
  position: relative;
  width: 0px;
  height: 0;
  border-top: 7px solid transparent;
  border-left: 14px solid #fff;
  border-bottom: 7px solid transparent;
  margin-left: 3px;
  margin-right: 2px;
  transition: all 0.2s;
}
</style>
