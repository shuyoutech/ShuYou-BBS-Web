<script setup lang="ts">

import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {fileUploadApi} from "@/api/system/file";
import {postSaveApi} from "@/api/bbs/post";
import type {PostSaveBo} from "@/api/bbs/post/types.ts";
import {toast} from "vue-sonner";
import {dictOptionsApi} from "@/api/common";

const router = useRouter()

const editorInit = ref({
  language_url: 'tinymce/langs/zh-Hans.js',
  language: 'zh-Hans',
  skin_url: 'tinymce/skins/ui/oxide',
  content_css: 'tinymce/skins/content/default/content.min.css',
  min_height: 500,
  max_height: 800,
  selector: 'textarea',
  plugins: 'autolink autoresize fullscreen image insertdatetime link lists media preview table wordcount code searchreplace',
  toolbar: 'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor removeformat | link image media table insertdatetime searchreplace | preview code fullscreen',
  images_file_types: 'svg,jpeg,jpg,jpe,jfi,jif,jfif,png,gif,bmp,webp',
  branding: false,
  menubar: false,
  toolbar_mode: 'sliding',
  insertdatetime_formats: [
    '%Y年%m月%d日',
    '%H点%M分%S秒',
    '%Y-%m-%d',
    '%H:%M:%S',
  ],
  // https://www.tiny.cloud/docs/tinymce/6/file-image-upload/#images_upload_handler
  images_upload_handler: (blobInfo: any, _progress: any) => new Promise((resolve, _reject) => {
    fileUploadApi(blobInfo).then(({data}) => {
      resolve(data.fileUrl);
    });
  }),
});

const formRef = useTemplateRef<FormInstance>('formRef')
const formRules = ref<FormRules>({
  title: [
    {required: true, message: '请输入标题', trigger: 'blur'},
  ],
  content: [
    {required: true, message: '请输入内容', trigger: 'blur'},
  ],
  coverImg: [
    {required: true, message: '请上传封面', trigger: 'blur'},
  ]
})
const form = reactive({
  title: '',
  content: '',
  coverImg: [],
})

const data = reactive<PostSaveBo>({
  plate: '1',
  title: '',
  content: '',
  coverImgUrl: '',
})

const onSubmit = () => {
  formRef.value?.validate((valid) => {
    alert(valid)
    if (valid) {
      data.title = form.title
      data.content = form.content
      data.coverImgUrl = form.coverImg[0]
      alert(JSON.stringify(data))
      postSaveApi(data).then(() => {
        toast.success('发布成功')
      })
    }
  })
}

const goBack = () => {
  router.back()
}

onMounted(() => {
})
</script>

<template>
  <div class="face-upload-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <FaIcon name="i-mdi:file-document-edit" class="header-icon"/>
          <h1 class="page-title">发布帖子</h1>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="goBack">返回</button>
        </div>
      </div>
    </div>
    <!-- 主要内容区域 -->
    <div class="main-content">
      <ElForm ref="formRef" :model="form" :rules="formRules">
        <div class="form-container">
          <!-- 标题输入 -->
          <div class="form-section">
            <ElFormItem label="标题" prop="title">
              <ElInput v-model="form.title" maxlength="30" placeholder="填写合适标题可以获得更多曝光哦"/>
            </ElFormItem>
          </div>

          <!-- 捏脸封面上传 -->
          <div class="form-section">
            <ElFormItem label="捏脸封面" prop="coverImg">
              <div class="cover-upload-wrapper">
                <div class="upload-instructions">
                  <p>1. 封面需清晰并契合捏脸角色主题,好的封面有利于获得更多曝光;</p>
                  <p>2. 封面图支持JPG、JPEG、PNG; 200kb以内,建议图片尺寸:524×446或262×223;</p>
                </div>
                <FaImageUpload
                  v-model="form.coverImg"
                  action="/file/upload"
                  :width="524"
                  :height="446"
                  :dimension="{width: 524, height: 446}"
                  :ext="['jpg', 'png', 'gif', 'bmp']"
                  :after-upload="(response) => response.fileUrl"
                />
              </div>
            </ElFormItem>
          </div>

          <!-- 内容编辑器 -->
          <div class="form-section">
            <ElFormItem label="内容" prop="content">
              <FaPageMain>
                <div class="min-w-full prose">
                  <TinyMCE api-key="yaqateu3ygrcimjd5431nbkeun90laoifukj05jn1utl7g3g" v-model="form.content"
                           :init="editorInit"/>
                </div>
              </FaPageMain>
            </ElFormItem>
          </div>
        </div>
      </ElForm>
      <!-- 发布按钮 -->
      <div class="form-actions">
        <button class="btn btn-primary" @click="onSubmit">
          发布帖子
        </button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.face-upload-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
  color: #409eff;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.title-input-wrapper {
  position: relative;
}

.title-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.title-input:focus {
  outline: none;
  border-color: #409eff;
  background: white;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.char-counter {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #909399;
}

.editor-container {
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  flex-wrap: wrap;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #dcdfe6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #606266;
}

.toolbar-btn:hover {
  background: #f5f7fa;
  border-color: #409eff;
  color: #409eff;
}

.toolbar-btn.active {
  background: #409eff;
  border-color: #409eff;
  color: white;
}

.font-size-selector {
  position: relative;
}

.font-size-select {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

.editor-content {
  min-height: 200px;
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  outline: none;
}

.editor-content:empty:before {
  content: attr(data-placeholder);
  color: #c0c4cc;
  pointer-events: none;
}

.section-selector {
  position: relative;
}

.section-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  font-size: 16px;
  background: #fafafa;
  cursor: pointer;
  appearance: none;
  transition: all 0.3s ease;
}

.section-select:focus {
  outline: none;
  border-color: #409eff;
  background: white;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  pointer-events: none;
}

.file-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.file-select-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.file-select-btn:hover {
  background: #337ecc;
  transform: translateY(-1px);
}

.file-status {
  color: #606266;
  font-size: 14px;
}

.file-instructions {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.file-instructions p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 14px;
}

.file-path {
  font-family: 'Courier New', monospace;
  background: #e9ecef;
  padding: 8px 12px;
  border-radius: 4px;
  color: #495057;
}

.cover-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-instructions {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #67c23a;
}

.upload-instructions p {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.cover-upload-area {
  width: 100%;
  height: 200px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cover-upload-area:hover {
  border-color: #409eff;
  background: #f0f9ff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #909399;
}

.upload-icon {
  font-size: 48px;
  color: #c0c4cc;
}

.cover-preview {
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.remove-cover {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-cover:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #409eff, #337ecc);
  color: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.btn-primary:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: white;
  color: #606266;
  border: 2px solid #dcdfe6;
}

.btn-secondary:hover {
  background: #f5f7fa;
  border-color: #c0c4cc;
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }

  .form-container {
    padding: 20px;
  }

  .header-content {
    padding: 0 10px;
  }

  .page-title {
    font-size: 18px;
  }

  .editor-toolbar {
    gap: 4px;
    padding: 8px 12px;
  }

  .toolbar-btn {
    width: 32px;
    height: 32px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
