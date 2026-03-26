<template>
  <div class="article-panel">
    <div class="article-panel__header">
      <h2 class="article-panel__title">发表文章</h2>
    </div>
    <div class="article-panel__body">
      <article-form ref="articleForm" @success="handleSubmitSuccess" />
    </div>
  </div>
</template>

<script>
import ArticleForm from './components/article-form.vue'

export default {
  name: 'ArticleEditPage',
  components: {
    ArticleForm
  },
  mounted () {
    this.$refs.articleForm.initialize()
  },
  methods: {
    handleSubmitSuccess () {
      this.$router.push('/art-list')
    }
  }
}
</script>

<style lang="less" scoped>
.article-panel__body {
  padding-top: 18px;
}
</style>
