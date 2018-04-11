<template>
  <div class="a-div" :style="style">

    <div class="catalog-node-div" @click.stop="catalogObj.children?clickCatalog():getBlog()">{{catalogObj.name}}{{catalogLevel.num}}</div>

    <div v-if="catalogObj.children">
      <catalog-tree v-for="item in catalogObj.children" :key="item.name" :catalog-obj="item" :catalog-array="catalogObj.children" :catalog-url="getUrl(catalogObj)" :father-heightNum="catalogLevel" ref="item" :catalog-visible="catalogObj.open">
      </catalog-tree>
    </div>

  </div>
</template>

<script>
import CatalogTree from "./CatalogTree.vue";

export default {
  name: "catalog-tree",
  data() {
    return {
      catalogLevel: {
        num: 1
      },
      height: 18
    };
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
      default: ""
      // required: true,
      // validator: () => {}
    },
    fatherLevel: {
      type: Object,
      default: () => {
        return {
          num: 1
        };
      }
    },
    catalogVisible: {}
  },
  computed: {
    style() {
      return {
        height: `${this.getCatalogLevel() * this.height}px`,
        opacity: this.catalogVisible ? 1 : 0
      };
    },
    opacity() {
      return {
        // display:this.catalogObj.open?
        // height: this.catalogObj.open ? "18px" : "0px",
        opacity: this.catalogObj.open ? 1 : 0
      };
    }
  },
  created() {},
  mounted() {},
  methods: {
    getCatalogLevel() {
      return this.catalogLevel.num;
    },
    setCatalogLevel(num) {
      this.catalogLevel.num = num;
    },
    getUrl(item) {
      return this.catalogUrl + "/" + item.name;
    },
    getBlog() {
      this.$router.push({ path: this.getUrl(this.catalogObj) });
    },
    clickCatalog() {
      let oldOpen = this.catalogObj.open;
      this.catalogArray.forEach(element => {
        element.open = false;
      });
      this.catalogObj.open = !oldOpen;

      let heightNum = 1;
      let childrenArray = this.$refs.item;
      if (!oldOpen) {
        childrenArray.forEach(elememt => {
          heightNum += elememt.getCatalogLevel();
        });
      }
      this.setCatalogLevel(heightNum);
    }
  },
  watch: {
    "catalogLevel.num": function(val, oldVal) {
      this.fatherLevel.num += val - oldVal;
    },
    "catalogObj.open": function(val, oldVal) {
      if (false == val) {
        this.setCatalogLevel(1);
      }
    }
  },
  components: {
    CatalogTree
  }
};
</script>

<style lang="scss" scoped>
.a-div {
  transition: all 3s;
}
.b-div {
  overflow: hidden;
  transition: all 3s;
}
.catalog-node-div {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -moz-user-select: none;
  // padding-top: 10px;
  // padding-bottom: 10px;
  margin-left: 10px;
  transition: all 5s;
}

.catalog-node-div:hover {
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.15);
}
</style>
