<template>
  <el-form
    ref="articleFormRef"
    v-loading="loading"
    :model="articleForm"
    :rules="articleRules"
    label-width="96px"
    class="article-form"
  >
    <el-form-item label="文章标题" prop="title">
      <el-input
        v-model.trim="articleForm.title"
        maxlength="100"
        show-word-limit
        placeholder="请输入标题"
      />
    </el-form-item>

    <el-form-item label="文章分类" prop="cate_id">
      <el-select
        v-model="articleForm.cate_id"
        placeholder="请选择分类"
        class="article-form__select"
      >
        <el-option
          v-for="item in cateOptions"
          :key="item.id"
          :label="item.cate_name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="文章内容" prop="content">
      <quill-editor
        v-model="articleForm.content"
        class="article-editor"
        :options="editorOptions"
        @blur="handleEditorBlur"
      />
    </el-form-item>

    <el-form-item label="文章封面" prop="cover_img">
      <div class="cover-picker">
        <input
          ref="coverInput"
          class="cover-picker__input"
          type="file"
          accept="image/*"
          @change="handleCoverChange"
        />
        <div class="cover-picker__preview" @click="triggerCoverSelect">
          <img
            v-if="coverPreviewUrl"
            :src="coverPreviewUrl"
            alt="文章封面预览"
            class="cover-picker__image"
          />
          <div v-else class="cover-picker__placeholder">请选择封面</div>
        </div>
        <div class="cover-picker__actions">
          <el-button type="text" @click="triggerCoverSelect">+ 选择封面</el-button>
          <div class="cover-picker__tip">支持常见图片格式，建议上传清晰封面</div>
        </div>
      </div>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :loading="submitting && submitState === '已发布'"
        @click="submitArticle('已发布')"
      >
        发布
      </el-button>
      <el-button
        :loading="submitting && submitState === '草稿'"
        @click="submitArticle('草稿')"
      >
        存为草稿
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { Message } from 'element-ui'
import { addArticleAPI, getArticleCateListAPI } from '@/api/article'

const defaultArticleForm = () => ({
  title: '',
  cate_id: '',
  content: '',
  cover_img: null
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

const getPlainContent = (value) => {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, '')
    .replace(/\s+/g, '')
    .trim()
}

export default {
  name: 'ArticleForm',
  data () {
    const validateContent = (rule, value, callback) => {
      if (!getPlainContent(value)) {
        callback(new Error('请输入文章内容'))
        return
      }

      callback()
    }

    const validateCover = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择文章封面'))
        return
      }

      callback()
    }

    return {
      loading: false,
      submitting: false,
      submitState: '',
      cateOptions: [],
      coverPreviewUrl: '',
      articleForm: defaultArticleForm(),
      editorOptions: {
        theme: 'snow',
        placeholder: '这里可以填写内容'
      },
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        cate_id: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        content: [
          { required: true, validator: validateContent, trigger: 'blur' }
        ],
        cover_img: [
          { required: true, validator: validateCover, trigger: 'change' }
        ]
      }
    }
  },
  beforeDestroy () {
    this.clearCoverPreview()
  },
  methods: {
    async initialize () {
      this.resetForm()

      if (!this.cateOptions.length) {
        await this.fetchCateList()
      }
    },
    async fetchCateList () {
      this.loading = true
      try {
        const res = await getArticleCateListAPI()
        this.cateOptions = getCateList(res)
      } finally {
        this.loading = false
      }
    },
    handleEditorBlur () {
      this.$refs.articleFormRef.validateField('content')
    },
    triggerCoverSelect () {
      this.$refs.coverInput.click()
    },
    handleCoverChange (event) {
      const [file] = event.target.files || []

      if (!file) {
        return
      }

      this.articleForm.cover_img = file
      this.createCoverPreview(file)
      this.$refs.articleFormRef.validateField('cover_img')
      event.target.value = ''
    },
    createCoverPreview (file) {
      this.clearCoverPreview()
      this.coverPreviewUrl = URL.createObjectURL(file)
    },
    clearCoverPreview () {
      if (this.coverPreviewUrl) {
        URL.revokeObjectURL(this.coverPreviewUrl)
        this.coverPreviewUrl = ''
      }
    },
    buildFormData (state) {
      const formData = new FormData()

      formData.append('title', this.articleForm.title)
      formData.append('cate_id', this.articleForm.cate_id)
      formData.append('content', this.articleForm.content)
      formData.append('state', state)
      formData.append('cover_img', this.articleForm.cover_img)

      return formData
    },
    hasUnsavedChanges () {
      return Boolean(
        this.articleForm.title ||
        this.articleForm.cate_id ||
        getPlainContent(this.articleForm.content) ||
        this.articleForm.cover_img
      )
    },
    resetForm () {
      this.articleForm = defaultArticleForm()
      this.clearCoverPreview()

      if (this.$refs.articleFormRef) {
        this.$refs.articleFormRef.resetFields()
        this.$refs.articleFormRef.clearValidate()
      }
    },
    submitArticle (state) {
      this.$refs.articleFormRef.validate(async (valid) => {
        if (!valid || this.submitting) {
          return
        }

        this.submitting = true
        this.submitState = state

        try {
          await addArticleAPI(this.buildFormData(state))
          Message.success(state === '已发布' ? '发布文章成功' : '保存草稿成功')
          this.$emit('success', { state })
          this.resetForm()
        } finally {
          this.submitting = false
          this.submitState = ''
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.article-form {
  max-width: 980px;
}

.article-form__select {
  width: 100%;
}

.article-editor /deep/ .ql-toolbar.ql-snow {
  border-radius: 4px 4px 0 0;
}

.article-editor /deep/ .ql-container.ql-snow {
  min-height: 280px;
  border-radius: 0 0 4px 4px;
}

.article-editor /deep/ .ql-editor {
  min-height: 240px;
}

.cover-picker__input {
  display: none;
}

.cover-picker__preview {
  width: 400px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  background-color: #f8f8f8;
  cursor: pointer;
}

.cover-picker__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-picker__placeholder {
  font-size: 18px;
  color: #909399;
}

.cover-picker__actions {
  margin-top: 12px;
}

.cover-picker__tip {
  font-size: 12px;
  line-height: 1.5;
  color: #909399;
}
</style>
