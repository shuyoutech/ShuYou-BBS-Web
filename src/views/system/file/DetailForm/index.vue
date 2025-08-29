<script setup lang="ts">
import { toast } from 'vue-sonner'

export interface Props {
  type?: string
}
const props = withDefaults(
  defineProps<Props>(),
  {
    type: '',
  },
)

const emits = defineEmits<{
  success: []
}>()
const files = ref([])
const images = ref([])
const baseURL = `${(import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL}file/upload`
const loading = ref(false)

function handleSuccess(res: any) {
  if (res.code === 0 && res.data) {
    emits('success')
    toast.success('导入成功')
  }
}
function removeFile() {
  files.value = []
  images.value = []
}
</script>

<template>
  <div v-loading="loading">
    <FileUpload v-if="props.type === 'file'" :files="files" :size="5" :max="1" :ext="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'pdf']" :action="baseURL" @on-remove="removeFile" @on-success="handleSuccess" />
    <ImageUpload v-if="props.type === 'image'" :files="files" :size="5" :max="1" :ext="['png', 'jpg', 'jpeg']" :action="baseURL" @on-remove="removeFile" @on-success="handleSuccess" />
  </div>
</template>
