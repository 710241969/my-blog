<template>
  <div>{{md2}}
  </div>
</template>

<script>
import a from './1.md'
export default {
  data() {
    return {
      md: a,
      md2: require('./1.md')
    }
  }
}
</script>
<style lang="scss" scoped></style>
