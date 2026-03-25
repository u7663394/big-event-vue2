<template>
  <div class="article-panel">
    <div class="article-panel__header">
      <h2 class="article-panel__title">文章分类</h2>
      <el-button type="primary" size="small" @click="openAddDialog">添加分类</el-button>
    </div>

    <div class="article-panel__body">
      <el-table v-loading="loading" :data="cateList" border>
        <el-table-column label="序号" type="index" width="120" />
        <el-table-column prop="cate_name" label="分类名称" />
        <el-table-column prop="cate_alias" label="分类别名" />
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
      @closed="resetAddForm"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="cateRules"
        label-width="78px"
        class="dialog-form"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model.trim="addForm.cate_name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model.trim="addForm.cate_alias" placeholder="请输入别名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" :loading="addSubmitting" @click="submitAdd">
          添加
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改文章分类"
      :visible.sync="editDialogVisible"
      width="420px"
      append-to-body
      @closed="resetEditForm"
    >
      <el-form
        ref="editFormRef"
        v-loading="editLoading"
        :model="editForm"
        :rules="cateRules"
        label-width="78px"
        class="dialog-form"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model.trim="editForm.cate_name" />
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model.trim="editForm.cate_alias" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" :loading="editSubmitting" @click="submitEdit">
          确认修改
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="420px"
      append-to-body
    >
      <div class="delete-dialog-text">
        确定要删除“{{ currentCate.cate_name || '这条信息' }}”吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" :loading="deleteSubmitting" @click="submitDelete">
          确认删除
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import {
  addArticleCateAPI,
  deleteArticleCateAPI,
  getArticleCateInfoAPI,
  getArticleCateListAPI,
  updateArticleCateAPI
} from '@/api/article'

const defaultCateForm = () => ({
  cate_name: '',
  cate_alias: ''
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

const getCateInfo = (response) => {
  const candidates = [response, response?.data]

  for (const item of candidates) {
    if (item?.id) {
      return item
    }
    if (item?.data?.id) {
      return item.data
    }
  }

  return {}
}

export default {
  name: 'ArticleCatePage',
  data () {
    return {
      loading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      deleteDialogVisible: false,
      addSubmitting: false,
      editSubmitting: false,
      deleteSubmitting: false,
      editLoading: false,
      currentCate: {},
      addForm: defaultCateForm(),
      editForm: {
        id: '',
        ...defaultCateForm()
      },
      cateList: [],
      cateRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 15, message: '分类名称长度在 1 到 15 个字符之间', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { min: 1, max: 15, message: '分类别名长度在 1 到 15 个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.fetchCateList()
  },
  methods: {
    async fetchCateList () {
      this.loading = true
      try {
        const res = await getArticleCateListAPI()
        this.cateList = getCateList(res)
      } finally {
        this.loading = false
      }
    },
    openAddDialog () {
      this.addDialogVisible = true
    },
    async openEditDialog (row) {
      this.currentCate = row
      this.editDialogVisible = true
      this.editLoading = true

      try {
        const res = await getArticleCateInfoAPI(row.id)
        const detail = getCateInfo(res)
        this.editForm = {
          id: detail.id,
          cate_name: detail.cate_name || '',
          cate_alias: detail.cate_alias || ''
        }
      } finally {
        this.editLoading = false
      }
    },
    openDeleteDialog (row) {
      this.currentCate = row
      this.deleteDialogVisible = true
    },
    submitAdd () {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid || this.addSubmitting) {
          return
        }

        this.addSubmitting = true
        try {
          await addArticleCateAPI(this.addForm)
          Message.success('添加分类成功')
          this.addDialogVisible = false
          await this.fetchCateList()
        } finally {
          this.addSubmitting = false
        }
      })
    },
    submitEdit () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid || this.editSubmitting) {
          return
        }

        this.editSubmitting = true
        try {
          await updateArticleCateAPI(this.editForm)
          Message.success('修改分类成功')
          this.editDialogVisible = false
          await this.fetchCateList()
        } finally {
          this.editSubmitting = false
        }
      })
    },
    async submitDelete () {
      if (this.deleteSubmitting || !this.currentCate.id) {
        return
      }

      this.deleteSubmitting = true
      try {
        await deleteArticleCateAPI(this.currentCate.id)
        Message.success('删除分类成功')
        this.deleteDialogVisible = false
        await this.fetchCateList()
      } finally {
        this.deleteSubmitting = false
      }
    },
    resetAddForm () {
      this.addForm = defaultCateForm()
      this.$refs.addFormRef && this.$refs.addFormRef.resetFields()
    },
    resetEditForm () {
      this.editForm = {
        id: '',
        ...defaultCateForm()
      }
      this.currentCate = {}
      this.$refs.editFormRef && this.$refs.editFormRef.resetFields()
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
