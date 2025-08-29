<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiCommon from '@/api/modules/common'
import apiNotice from '@/api/modules/notice'

export interface Props {
  id?: number | string
}
const props = withDefaults(
  defineProps<Props>(),
  {
    id: '',
  },
)

const loading = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')
const form = ref({
  id: props.id,
  noticeType: '',
  noticeTitle: '',
  noticeDesc: '',
  noticeContent: '',
  status: '1',
})
const formRules = ref<FormRules>({
  noticeType: [
    { required: true, message: '请选择公告类型', trigger: 'blur' },
  ],
  noticeTitle: [
    { required: true, message: '请输入公告名称', trigger: 'blur' },
  ],
  noticeDesc: [
    { required: true, message: '请输入公告描述', trigger: 'blur' },
  ],
  noticeContent: [
    { required: true, message: '请输入公告内容', trigger: 'blur' },
  ],
})

onMounted(() => {
  getOptions()
  if (form.value.id !== '') {
    getInfo()
  }
})
const options = ref([])
function getOptions() {
  apiCommon.getDictOptions('notice_type').then((res: any) => {
    options.value = res.data
  })
}
function getInfo() {
  loading.value = true
  apiNotice.detail(form.value.id).then((res: any) => {
    loading.value = false
    const keys = Object.keys(form.value)
    keys.map((key) => {
      if (res.data[key] !== undefined) {
        form.value[key] = String(res.data[key])
      }
      return res.data[key]
    })
  })
}

defineExpose({
  submit() {
    return new Promise<void>((resolve) => {
      formRef.value?.validate((valid) => {
        if (valid) {
          if (form.value.id === '') {
            apiNotice.create(form.value).then(() => {
              toast.success('新增成功')
              resolve()
            })
          }
          else {
            apiNotice.edit(form.value).then(() => {
              toast.success('编辑成功')
              resolve()
            })
          }
        }
      })
    })
  },
})
</script>

<template>
  <div v-loading="loading">
    <ElForm ref="formRef" :model="form" :rules="formRules" label-width="70px" label-suffix="：">
      <ElFormItem label="标题" prop="noticeTitle">
        <ElInput v-model="form.noticeTitle" placeholder="请输入标题" />
      </ElFormItem>
      <ElFormItem label="类型" prop="noticeType">
        <ElSelect v-model="form.noticeType" placeholder="请选择类型">
          <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="描述" prop="noticeDesc">
        <ElInput v-model="form.noticeDesc" placeholder="请输入描述" />
      </ElFormItem>
      <ElFormItem label="内容" prop="noticeContent">
        <ElInput v-model="form.noticeContent" placeholder="请输入内容" type="textarea" :rows="4" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
