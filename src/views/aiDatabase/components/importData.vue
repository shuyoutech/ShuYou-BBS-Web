<script setup lang="ts">
import { toast } from 'vue-sonner'
import apiDatabase from '@/api/modules/database'

const route = useRoute()
const selectList = [
  { label: '导入文档', value: '1', icon: 'i-ic:outline-cloud-upload', desc: '支持导入word、txt、pdf、markdown等文本文件' },
  { label: '手动录入文档', value: '2', icon: 'i-ic:outline-edit-note', desc: '手动输入文本文档内容，文档内容过多时请上传文件' },
]
const activeTab = ref('1')
const files = ref([])
const baseURL = `${(import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL}file/upload`
const fileId = ref('')
const form = ref({
  knowledgeId: route.query.id ?? '',
  docFileIds: [],
})
const formTextRef = useTemplateRef<FormInstance>('formTextRef')
const formText = ref({
  knowledgeId: route.query.id ?? '',
  docContent: '',
  docName: '',
})
const formTextRules = ref<FormRules>({
  docName: [
    { required: true, message: '请输入文件名称', trigger: 'blur' },
  ],
  docContent: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ],
})
function handleSuccess(res: any) {
  if (res.code === 0 && res.data) {
    fileId.value = res.data.id
    apiDatabase.importFile({
      knowledgeId: form.value.knowledgeId,
      docFileIds: [fileId.value],
    }).then((res: any) => {
      if (res.code === 0) {
        toast.success('文档导入成功')
      }
    })
  }
}
function removeFile() {
  fileId.value = ''
}
function onSubmit() {
  formTextRef.value?.validate((valid) => {
    if (valid) {
      apiDatabase.importText(formText.value).then(() => {
        toast.success('手动录入文档成功')
        resolve()
      })
    }
  })
}
</script>

<template>
  <div>
    <ElRow :gutter="20">
      <ElCol v-for="(item, i) in selectList" :key="item + i" :xl="8" :lg="12" :md="24" @click="activeTab = item.value">
        <div class="mb-20px min-h-96px flex-start cursor-pointer border border-1 rounded-6px border-solid p-15px" :style="{ borderColor: activeTab === item.value ? '#18a058' : '#dfe2ea' }">
          <div class="mr-20px w-28px">
            <FaIcon :name="item.icon" size="36px" class="icon" />
          </div>
          <div class="flex-1 pr-5px">
            <div class="mb-8px text-16px color-[#1f2225]">
              {{ item.label }}
            </div>
            <div class="color-[#767c82]">
              {{ item.desc }}
            </div>
          </div>
          <div class="h-full w-20px flex-center">
            <div v-if="activeTab === item.value" class="i-ic:baseline-check-circle" color="#18a058" size="20px" />
            <div v-else class="i-ic:baseline-check-circle" color="#dfe2ea" size="20px" />
          </div>
        </div>
      </ElCol>
    </ElRow>
    <div v-show="activeTab === '1'" class="h-400px w-full">
      <FileUpload :files="files" :size="5" :max="1" :ext="['doc', 'docx', 'txt', 'pdf', 'md', 'csv']" :action="baseURL" @on-remove="removeFile" @on-success="handleSuccess" />
    </div>
    <div v-show="activeTab === '2'" class="min-h-300px border border-1 border-[#dfe2ea] rounded-6px border-solid p-20px">
      <ElButton type="primary" class="mb-20px" @click="onSubmit()">
        提交到知识库学习
      </ElButton>
      <ElForm ref="formTextRef" :model="formText" :rules="formTextRules" label-width="100px" label-suffix="：">
        <ElFormItem label="文件名称" prop="docName">
          <ElInput v-model="formText.docName" placeholder="请输入" />
        </ElFormItem>
        <ElFormItem label="文档内容" prop="docContent">
          <ElInput v-model="formText.docContent" placeholder="请输入需要录入的文档内容" type="textarea" :rows="10" />
        </ElFormItem>
      </ElForm>
    </div>
  </div>
</template>
