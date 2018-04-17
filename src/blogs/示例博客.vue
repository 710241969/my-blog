<template>
  <pre>
    <textarea>


    </textarea>
  </pre>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    markDownHtml: {
      type: String
      // default: 0,
      // required: true,
      // validator: () => {}
    }
  },
  computed: {
    markDownText() {
      return MARKDOWN_CONVERTER.makeHtml()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
