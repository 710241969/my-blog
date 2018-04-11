<template>
  <div v-show="catalogVisible" v-if="isFile" class="catalog-node-div" :style="{paddingLeft:paddingLeft+'px'}" @click.stop=" getBlog ">{{this.catalogName}}</div>

  <div v-show="catalogVisible " v-else class="catalog-node-div " :style="style" @click.stop="clickCatalog ">{{this.catalogName}}{{childrenNum}}
    <catalog-tree v-for="item in catalogArray " :key="item " :catalog-obj="catalogObj[item] " :catalog-name="item " :catalog-url="catalogUrl+ '\/'+item " :catalog-heightNum="catalogLevel+1 " :catalog-visible="childrenVisible " :padding-left="paddingLeft" :children="childrenNum">
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
      displayClass: 'none-display',
      childrenVisible: false,
      // style: {
      //   height: '18px'
      // },
      childrenNum: {
        num: 0
      }
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
    catalogLevel: {},
    catalogVisible: {
      type: Boolean,
      default: false
    },
    paddingLeft: {
      type: Number
    },
    children: {
      type: Object
    }
  },
  computed: {
    isFile() {
      return !(this.catalogObj instanceof Object)
    },
    style() {
      return {
        height: (this.childrenNum.num + 1) * 18 + 'px',
        paddingLeft: this.paddingLeft + 'px'
      }
    }
  },
  created() {
    this.catalogArray = Object.keys(this.catalogObj)
  },
  methods: {
    getBlog(e) {
      this.$router.push({ path: this.catalogUrl })
    },
    clickCatalog(e) {
      this.childrenVisible = !this.childrenVisible
      if (this.childrenVisible) {
        this.childrenNum.num = this.catalogArray.length
        this.children.num = this.children.num + this.childrenNum.num
      } else {
        this.childrenNum.num = 0
        this.children.num = this.children.num - this.catalogArray.length
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
