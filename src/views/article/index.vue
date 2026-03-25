<template>
  <div class="article-module">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'ArticlePage'
}
</script>

<style lang="less" scoped>
.article-module {
  min-height: 100%;
}
</style>
