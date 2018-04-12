<template>
  <nav id="catalog-nav">
    <div style="
    margin-bottom: 15px;
">
      <div style="    margin: 25px 0 5px 0;">
        <img class="head-icon-img" src="data:image/jpeg;base64,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MnHQfjxSZI6g0CuAcn+I0u4g5BYH1zQFw1Owv9LvJLLUbK5srmJ2SSGeMxujKxVgVIBBBBBB6EEVWyTycmpjLmV0EouLsxwYgg5HFPwCO3PNUJAAwwOABSrjIyRnFAwY/OF4ANC8SMMggcZHQ0uox/anE4Xk9elMaGHbnAHNMKEfwt+VAhVzuXcSATiprjyluJBAX8jednmY3bc8Zxxmp1uVpYb8h5I/EGlUjH3V+oFUTcVBltpA/GkdcEgFfpimSR++4ce1DHGMnI+lArkRYyNuYsxx1JyacxDYySMDHrSsO7uEQiEymUMYwRvCHDEZ5wSDg0Blxht5I6YpWdxq3UaX9AaBtJ+Zu1MQZHGD2p6grwaQ0PaR2RUJ+Vc7RnpmkYkrimNaACC3zBh64AqRXRckPIpxx8vegCSKUZO64KZ9QacTGzBftMTduQcfqKB79Sdvstqg/wBXcTkAjaP3afX+8fbp9elZpZQxK+npUpvdlVElZIInAcFiMVK0qlxyhHqetXcyGeZGQCyfkaG2A8MefQ5ouSf/2f/gABBKRklGAAEBAAABAAEAAP/bAIQAUDc8RjwyUEZBRlpVUF94yIJ4bm549a+5kcj//////////////////////////////////////////////////wFVWlp4aXjrgoLr/////////////////////////////////////////////////////////////////////////8AAEQgAYACAAwERAAIRAQMRAf/EAaIAAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKCxAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6AQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgsRAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8AhzTEJmgBM0AGaBhmgABoAXNABQAooAdQAhoAKAFoAKACgAxQMjNBIlAwoAKACgAoAKAFoAcKAHLQADk0hjsUAGKYgoASkMQ0wGE0EjaAFxQMMUAGKAFAoAdspDDZQABTQAoFACgUAOpiCgAoASgAxQBDmgBKAFxQA5VNIB4U0DHhaAFxQAhUdaADPoKAEwaAF5oAKYgxQAhFADec0gsOxTAhxQAoWkAbTQA9cd6Bjsr60AB4HU0ACHJoAfjNAC4oAMUCDFAWExQFgoCwlFx2DFFwsGKLjsQigkeKAFxQAuBQAuxaBjlApDHbR6UDFxQAmKBWDFAxDSATFFwsLtouFgxRcdhMUBYaUz3ouKxHuHpVEhvoEKHFAChqAFDUhjxSKHYNABzQMXBoAMUgDFAXDBoAQ8daYDC3saBADQAvNAEQQ+lFw5RdhFFw5RMe1MQ4An+GkAAYPIoGSqVpDH5FAhM+1AC5oAKVwDIouAhZfWgCF3TPUk1STBsb5wHRaLCuNM7egp2C4hmf1osK5CJHHRjRYLsXzn7miwXYvnN60WC44XDD/wDVRZBdgbljRyoLjDK5PWiwXYea/wDeNFguw81/7x/OiwXYea/rTsFxDIx/iNAXEyfWgQZPrQAbj60AG40AG40AGTQA2gAoAKAFoAKAEoAWgAoAKACgAoAKACgAoAKACgBKACgAoAKACgAoAWgAoASgAoAWgAoAKACgAoAKACgBKAFoASgAoAKAFoASgBaACgAoAOKAEoAWgAoAKAP/2Q==">
      </div>
      <div style="font-size: 30px;
    padding-bottom: 10px;">
        <span style="    position: relative;
    left: 70px;">小明同學
        </span>
      </div>
      <div style="    text-align: center;">
        <span style="font-size: 18px;">学习、积累、沉淀、记录、分享</span>
      </div>
      <div style="    margin-top: 30px;">
        <div>
          <span style="    position: relative;
    color: #959da5;
    left: 105px;">瞧一瞧</span>
        </div>
        <div>
          <a href="https://github.com/710241969/my-blog" class="contact-a" style="left: 50px;" target="_blank">
            <i class="fa fa-github fa-2x fa-fw" style="    padding: 5px 0;"></i>
          </a>
          <a class="contact-a" style="  left: 68px;" target="_blank">
            <i class="fa fa-envelope fa-2x fa-fw"></i>
          </a>
          <a class="contact-a" style="    left: 90px;
    top: 2px;" target="_blank">
            <i class="fa fa-wechat fa-2x fa-fw"></i>
          </a>
          <a class="contact-a" style="    left: 90px; display:none;
    top: 2px;" target="_blank">
            <i class="fa fa-home fa-2x fa-fw"></i>
          </a>
        </div>
      </div>
    </div>
    <div>
      <div style="    font-size: 25px;
    height: 30px;
    padding: 10px 0 0 5px;    border-bottom: 1px solid #c6cbd1;">博客目录</div>
      <catalog-tree :catalog-obj="catalogObj"></catalog-tree>
    </div>
  </nav>
</template>

<script>
import CatalogTree from './CatalogTree.vue'

export default {
  data() {
    return {}
  },
  props: {
    catalogObj: {
      type: Object,
      default: ''
      // required: true,
      // validator: () => {}
    }
  },
  computed: {},
  created() {},
  methods: {},
  components: {
    CatalogTree
  }
}
</script>

<style lang="scss" scoped>
.head-icon-img {
  height: 90px;
  width: 90px;
  border-radius: 50%;
  border: 5px solid #444d56;
  position: relative;
  left: 80px;
}

.contact-a {
  // width: 42px;
  // height: 42px;
  color: #fff;
  display: inline-block;
  // padding: 3px 0;
  // padding: 0 20px;
  position: relative;
}

a {
  text-decoration: none;
  cursor: pointer;
}
a:hover {
  text-decoration: none;
}
a:focus {
  text-decoration: none;
}
a:visited {
  text-decoration: none;
}
a:active {
  text-decoration: none;
}

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

.catalog-nav-div {
  // overflow: auto;
  // position: relative;
  // height: 500px;
}
</style>

