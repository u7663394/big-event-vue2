<template>
  <div class="article-panel">
    <div class="article-panel__header">
      <h2 class="article-panel__title">文章分类</h2>
      <el-button type="primary" size="small" @click="openAddDialog">添加分类</el-button>
    </div>

    <div class="article-panel__body">
      <el-table :data="cateList" border>
        <el-table-column label="序号" type="index" width="120" />
        <el-table-column prop="name" label="项目名称" />
        <el-table-column prop="alias" label="分类别名" />
        <el-table-column label="操作" width="164">
          <template slot-scope="{ row }">
            <el-button type="primary" size="mini" @click="openEditDialog(row)">修改</el-button>
            <el-button type="danger" size="mini" @click="openDeleteDialog(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="420px"
      append-to-body
    >
      <el-form label-width="78px" class="dialog-form">
        <el-form-item label="分类名称">
          <el-input placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="分类别名">
          <el-input placeholder="请输入别名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="addDialogVisible = false">添加</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改文章分类"
      :visible.sync="editDialogVisible"
      width="420px"
      append-to-body
    >
      <el-form label-width="78px" class="dialog-form">
        <el-form-item label="分类名称">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="分类别名">
          <el-input v-model="editForm.alias" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="editDialogVisible = false">确认修改</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="420px"
      append-to-body
    >
      <div class="delete-dialog-text">确定要删除“{{ currentCate.name || '这条信息' }}”吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="deleteDialogVisible = false">确认删除</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const defaultEditForm = () => ({
  name: '',
  alias: ''
})

export default {
  name: 'ArticleCatePage',
  data () {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      currentCate: {},
      editForm: defaultEditForm(),
      cateList: [
        { id: 1, name: '运动', alias: 'yundong' },
        { id: 2, name: '地理', alias: 'dili' },
        { id: 3, name: '科技', alias: 'shuxue' },
        { id: 4, name: '科技', alias: 'keji' }
      ]
    }
  },
  methods: {
    openAddDialog () {
      this.addDialogVisible = true
    },
    openEditDialog (row) {
      this.currentCate = row
      this.editForm = {
        name: row.name,
        alias: row.alias
      }
      this.editDialogVisible = true
    },
    openDeleteDialog (row) {
      this.currentCate = row
      this.deleteDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-form {
  padding-top: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

.delete-dialog-text {
  padding: 18px 0 10px;
  font-size: 14px;
  color: #606266;
}
</style>
