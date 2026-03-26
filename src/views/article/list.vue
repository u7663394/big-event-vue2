<template>
  <div class="article-panel">
    <div class="article-panel__header">
      <h2 class="article-panel__title">文章列表</h2>
    </div>

    <div class="article-panel__body">
      <div class="filter-bar">
        <el-form :inline="true" size="small" class="filter-form">
          <el-form-item label="文章分类">
            <el-select
              v-model="filterForm.cate_id"
              clearable
              placeholder="请选择分类"
              class="filter-select"
            >
              <el-option
                v-for="item in cateOptions"
                :key="item.id"
                :label="item.cate_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select
              v-model="filterForm.state"
              clearable
              placeholder="请选择状态"
              class="filter-select"
            >
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" @click="handleSearch">筛选</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="handlePublish">发表文章</el-button>
      </div>

      <el-table v-loading="loading" :data="articleList" border>
        <el-table-column prop="title" label="文章标题" min-width="280" />
        <el-table-column prop="cate_name" label="分类" width="120" />
        <el-table-column label="发布时间" width="180">
          <template slot-scope="{ row }">
            {{ formatDate(row.pub_date) }}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" width="120" />
        <el-table-column label="操作" width="150">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-bar">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="queryParams.pagenum"
          :page-size="queryParams.pagesize"
          :page-sizes="[2, 5, 10, 20]"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <el-dialog
      title="发表文章"
      :visible.sync="publishDialogVisible"
      width="980px"
      top="6vh"
      destroy-on-close
      :close-on-click-modal="false"
      :before-close="handlePublishDialogBeforeClose"
      @opened="handlePublishDialogOpened"
    >
      <article-form
        v-if="publishDialogVisible"
        ref="publishArticleForm"
        @success="handlePublishSuccess"
      />
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { Message, MessageBox } from 'element-ui'
import { deleteArticleAPI, getArticleCateListAPI, getArticleListAPI } from '@/api/article'
import ArticleForm from './components/article-form.vue'

const defaultFilterForm = () => ({
  cate_id: '',
  state: ''
})

const getCateList = (response) => {
  const candidates = [response, response?.data]

  for (const item of candidates) {
    if (Array.isArray(item)) {
      return item
    }
    if (Array.isArray(item?.data)) {
      return item.data
    }
  }

  return []
}

const getArticleListPayload = (response) => {
  const candidates = [response, response?.data]

  for (const item of candidates) {
    if (item && (Array.isArray(item) || Array.isArray(item.data) || Array.isArray(item.articles))) {
      return item
    }
  }

  return response || {}
}

const getArticleList = (payload) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload.data)) {
    return payload.data
  }

  if (Array.isArray(payload.articles)) {
    return payload.articles
  }

  return []
}

const getArticleTotal = (payload, listLength) => {
  const total = payload.total || payload.total_count || payload.count || payload.length

  if (typeof total === 'number') {
    return total
  }

  return listLength
}

export default {
  name: 'ArticleListPage',
  components: {
    ArticleForm
  },
  data () {
    return {
      loading: false,
      publishDialogVisible: false,
      total: 0,
      filterForm: defaultFilterForm(),
      queryParams: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      cateOptions: [],
      stateOptions: [
        { label: '已发布', value: '已发布' },
        { label: '草稿', value: '草稿' }
      ],
      articleList: []
    }
  },
  created () {
    this.initPageData()
  },
  methods: {
    async initPageData () {
      this.loading = true

      try {
        const [cateRes, articleRes] = await Promise.all([
          getArticleCateListAPI(),
          getArticleListAPI(this.queryParams)
        ])

        this.cateOptions = getCateList(cateRes)
        this.updateArticleList(articleRes)
      } finally {
        this.loading = false
      }
    },
    async fetchArticleList () {
      this.loading = true

      try {
        const res = await getArticleListAPI(this.queryParams)
        this.updateArticleList(res)
      } finally {
        this.loading = false
      }
    },
    updateArticleList (response) {
      const payload = getArticleListPayload(response)
      const list = getArticleList(payload)

      this.articleList = list
      this.total = getArticleTotal(payload, list.length)
    },
    formatDate (value) {
      if (!value) {
        return ''
      }

      return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
    },
    async handleSearch () {
      this.queryParams = {
        ...this.queryParams,
        ...this.filterForm,
        pagenum: 1
      }
      await this.fetchArticleList()
    },
    async handleReset () {
      this.filterForm = defaultFilterForm()
      this.queryParams = {
        pagenum: 1,
        pagesize: this.queryParams.pagesize,
        ...defaultFilterForm()
      }
      await this.fetchArticleList()
    },
    handlePublish () {
      this.publishDialogVisible = true
    },
    handleEdit (row) {
      this.$router.push(`/article/edit/${row.id}`)
    },
    async handlePublishDialogOpened () {
      await this.$nextTick()
      if (this.$refs.publishArticleForm) {
        await this.$refs.publishArticleForm.initialize()
      }
    },
    async handlePublishDialogBeforeClose (done) {
      const formRef = this.$refs.publishArticleForm

      if (!formRef || !formRef.hasUnsavedChanges()) {
        done()
        return
      }

      try {
        await MessageBox.confirm('此操作将导致文章信息丢失，是否继续？', '提示', {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
        done()
      } catch (error) {}
    },
    async handlePublishSuccess () {
      this.publishDialogVisible = false
      await this.fetchArticleList()
    },
    async handleDelete (row) {
      try {
        await MessageBox.confirm(`确定删除文章“${row.title}”吗？`, '提示', {
          type: 'warning'
        })
      } catch (error) {
        return
      }

      await deleteArticleAPI(row.id)
      Message.success('删除文章成功')

      const isLastItemOnPage = this.articleList.length === 1 && this.queryParams.pagenum > 1
      if (isLastItemOnPage) {
        this.queryParams.pagenum -= 1
      }

      await this.fetchArticleList()
    },
    async handleSizeChange (pagesize) {
      this.queryParams = {
        ...this.queryParams,
        pagesize,
        pagenum: 1
      }
      await this.fetchArticleList()
    },
    async handleCurrentChange (pagenum) {
      this.queryParams = {
        ...this.queryParams,
        pagenum
      }
      await this.fetchArticleList()
    }
  }
}
</script>

<style lang="less" scoped>
.article-panel__body {
  padding-top: 18px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
}

.filter-select {
  width: 240px;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

/deep/ .el-dialog__body {
  padding-top: 10px;
}
</style>
