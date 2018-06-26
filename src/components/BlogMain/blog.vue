<template>
  <div></div>
</template>

<script>
export default {
  date() {},
  created() {
    console.log("blog组件created");
  },
  mounted() {
    this.$el.innerHTML = require("../../../blogs" + this.$route.name + ".md");
    console.log("blog组件mounted");
  },
  beforeUpdate() {
    console.log("blog组件beforeUpdate");
  },
  beforeDestroy() {
    console.log("blog组件beforeDestroy");
  },
  computed: {},
  watch: {
    $route: function(val, oldVal) {
      console.log("blog组件路由变化");
      this.$el.innerHTML = require("../../../blogs" + this.$route.name + ".md");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
