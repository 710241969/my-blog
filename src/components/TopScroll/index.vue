<template>
  <button v-show="buttonVisible" class="top-scroll-button" @click="toTop">TOP</button>
</template>

<script>
/**
回到顶部按钮组件
 */
export default {
  data() {
    return {
      scrollTop: 0,
      scrollInitSpeed: 5,
      scrollAddSpeed: 10,
      scrollTimeOut: 20
    };
  },
  computed: {
    buttonVisible() {
      return this.scrollTop > 200;
    }
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
    },
    toTop() {
      let top = this.scrollTop;
      this.toTopTimeOut(top, this.scrollInitSpeed);
    },
    toTopTimeOut(top, speed) {
      setTimeout(() => {
        if (top - speed < 0) {
          window.pageYOffset = 0;
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
          return;
        }
        top = top - speed;
        window.pageYOffset = top;
        document.documentElement.scrollTop = top;
        document.body.scrollTop = top;
        speed += this.scrollAddSpeed;
        this.toTopTimeOut(top, speed);
      }, this.scrollTimeOut);
    }
  }
};
</script>


<style lang="scss" scoped>
.top-scroll-button {
  text-align: center;
  font-size: 12px;
  position: fixed;
  width: 26px;
  height: 45px;
  bottom: 200px;
  right: 20px;
  border: none;
  outline: none;
  opacity: 0.5;
  word-wrap: break-word;
  cursor: pointer;
  transition: all 0.5s;
}

.top-scroll-button:before {
  content: "";
  height: 0px;
  width: 0px;
  position: absolute;
  top: -15px;
  left: 0px;
  border-width: 0px 13px 15px;
  border-style: solid;
  border-color: transparent transparent red;
}
</style>
