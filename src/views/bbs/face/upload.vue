<script setup lang="ts">

import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import type {FormInstance, FormRules} from 'element-plus'
import {fileUploadApi} from "@/api/system/file";
import {postSaveApi} from "@/api/bbs/post";
import type {PostSaveBo} from "@/api/bbs/post/types.ts";
import {toast} from "vue-sonner";

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
    if (valid) {
      data.title = form.title
      data.content = form.content
      data.coverImgUrl = form.coverImg[0]
      postSaveApi(data).then(() => {
        toast.success('发布成功')
        router.push('/')
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
      <div class="form-container">
        <ElForm ref="formRef" :model="form" :rules="formRules">

          <!-- 标题输入 -->
          <div class="form-section">
            <ElFormItem label="标题" prop="title">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <textarea
                v-model="form.title"
                maxlength="30"
                class="title-textarea"
                placeholder="请输入标题"
              />
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
                  :width="500"
                  :height="400"
                  :dimension="{width: 500, height: 400}"
                  :ext="['jpg', 'png', 'gif', 'bmp']"
                  :after-upload="(response) => response.fileUrl"
                />
              </div>
            </ElFormItem>
          </div>

          <!-- 内容编辑器 -->
          <div class="form-section">
            <ElFormItem label="内容" prop="content">
              <div class="content-editor-wrapper">
                <TinyMCE api-key="yaqateu3ygrcimjd5431nbkeun90laoifukj05jn1utl7g3g" v-model="form.content"
                         :init="editorInit"/>
              </div>
            </ElFormItem>
          </div>
         </ElForm>
         <div class="submit-button-container">
           <button class="btn btn-primary" @click="onSubmit">发布帖子</button>
         </div>
       </div>
    </div>
  </div>
</template>


<style scoped>
.face-upload-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  position: relative;
}

.face-upload-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
  pointer-events: none;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
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
  height: 80px;
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
  gap: 16px;
  align-items: center;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  position: relative;
  z-index: 1;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  max-width: 1000px;
  margin: 0 auto;
}

.form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
  border-radius: 12px 12px 0 0;
}

.form-section {
  margin-bottom: 35px;
  position: relative;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.title-input {
  max-width: 600px;
}

.title-input :deep(.el-input__wrapper) {
  height: 48px;
  border-radius: 8px;
  box-shadow: none;
  border: none;
  background: transparent;
  transition: all 0.3s ease;
}

.title-input :deep(.el-input__wrapper:hover) {
  box-shadow: none;
  border: none;
}

.title-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border: none;
}

.title-input :deep(.el-input__inner) {
  background: transparent;
  border: none;
  box-shadow: none;
  font-size: 16px;
  font-weight: 500;
}

.title-input :deep(.el-input__inner:focus) {
  box-shadow: none;
  border: none;
}

.title-textarea {
  width: 100%;
  max-width: 600px;
  height: 60px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  font-family: inherit;
  resize: none;
  outline: none;
  transition: all 0.3s ease;
  background: white;
}

.title-textarea:hover {
  border-color: #c0c4cc;
}

.title-textarea:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.title-textarea::placeholder {
  color: #c0c4cc;
  font-size: 14px;
}

.content-editor-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: white;
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  margin-bottom: 20px;
  position: relative;
}

.upload-instructions::before {
  content: '💡';
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 18px;
}

.upload-instructions p {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  padding-left: 30px;
}

.upload-instructions p:last-child {
  margin-bottom: 0;
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

.submit-button-container {
  display: flex;
  justify-content: center;
  padding: 25px 0;
  margin-top: 15px;
  border-top: 1px solid rgba(220, 223, 230, 0.3);
}


.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid rgba(220, 223, 230, 0.3);
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
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  min-width: 150px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
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
  border: 1px solid #dcdfe6;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
  min-width: 80px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
}

.btn-secondary:hover {
  border-color: #409eff;
  color: #409eff;
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
