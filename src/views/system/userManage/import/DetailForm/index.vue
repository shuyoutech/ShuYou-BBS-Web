<script setup lang="ts">
import { toast } from 'vue-sonner'

export interface Props {
  id?: number | string
}
// const props = withDefaults(
//   defineProps<Props>(),
//   {
//     id: '',
//   },
// )
const emits = defineEmits<{
  success: []
}>()
const files = ref([])
const baseURL = `${(import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL}user/import`
const loading = ref(false)

const failReason = ref('')
function handleSuccess(res: any) {
  if (res.code === 0 && res.data) {
    if (res.data.failCount > 0) {
      failReason.value = res.data.message
      toast.error(`导入失败${res.data.failCount}条`)
    }
    else {
      emits('success')
      toast.success('导入成功')
    }
  }
}
function removeFile() {
  files.value = []
}
</script>

<template>
  <div v-loading="loading">
    <FileUpload v-show="failReason === ''" :files="files" :size="5" :max="1" :ext="['xlsx', 'xls']" :action="baseURL" @on-remove="removeFile" @on-success="handleSuccess" />
    <pre v-show="failReason !== ''" class="text-sm">{{ failReason }}</pre>
  </div>
</template>
