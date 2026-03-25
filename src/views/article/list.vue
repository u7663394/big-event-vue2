<template>
  <div class="article-panel">
    <div class="article-panel__header">
      <h2 class="article-panel__title">文章列表</h2>
    </div>

    <div class="article-panel__body">
      <div class="filter-bar">
        <el-form :inline="true" size="small" class="filter-form">
          <el-form-item label="文章分类">
            <el-select v-model="filterForm.cate" placeholder="请选择分类" class="filter-select">
              <el-option
                v-for="item in cateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态">
            <el-select v-model="filterForm.state" placeholder="请选择状态" class="filter-select">
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary">筛选</el-button>
            <el-button>重置</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="small">发表文章</el-button>
      </div>

      <el-table :data="articleList" border>
        <el-table-column prop="title" label="文章标题" min-width="280" />
        <el-table-column prop="cate" label="分类" width="120" />
        <el-table-column prop="pubDate" label="发布时间" width="210" />
        <el-table-column prop="state" label="状态" width="150" />
        <el-table-column label="操作" width="150">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-bar">
        <span>共4条</span>
        <el-select value="2" size="small" class="page-size">
          <el-option label="2条/页" value="2" />
          <el-option label="4条/页" value="4" />
        </el-select>
        <el-pagination
          small
          layout="prev, pager, next"
          :total="4"
          :page-size="2"
          :current-page="1"
        />
        <div class="jump-box">
          <span>跳至</span>
          <el-input v-model="jumpPage" size="small" class="jump-input" />
          <span>页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleListPage',
  data () {
    return {
      filterForm: {
        cate: '',
        state: ''
      },
      jumpPage: '1',
      cateOptions: [
        { label: '运动', value: '运动' },
        { label: '地理', value: '地理' },
        { label: '科技', value: '科技' }
      ],
      stateOptions: [
        { label: '已发布', value: '已发布' },
        { label: '草稿', value: '草稿' }
      ],
      articleList: [
        { id: 1, title: '这是一个标题', cate: '运动', pubDate: '2020-05-20 14:30:00', state: '已发布' },
        { id: 2, title: '这是一个标题', cate: '地理', pubDate: '2020-05-20 14:30:00', state: '已发布' },
        { id: 3, title: '这是一个标题', cate: '科技', pubDate: '2020-05-20 14:30:00', state: '已发布' },
        { id: 4, title: '这是一个标题', cate: '科技', pubDate: '2020-05-20 14:30:00', state: '草稿' }
      ]
    }
  },
  methods: {
    handleEdit (row) {
      return row
    },
    handleDelete (row) {
      return row
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
  align-items: center;
  margin-top: 30px;
  color: #303133;
}

.page-size {
  width: 90px;
  margin: 0 18px 0 14px;
}

.jump-box {
  display: flex;
  align-items: center;
  margin-left: 16px;
}

.jump-input {
  width: 50px;
  margin: 0 8px;
}
</style>
