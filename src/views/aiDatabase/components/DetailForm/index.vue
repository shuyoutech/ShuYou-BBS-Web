<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiDatabase from '@/api/modules/database'

export interface Props {
  id?: number | string
  content?: string
}
const props = withDefaults(
  defineProps<Props>(),
  {
    id: '',
    content: '',
  },
)

const loading = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')
const form = ref({
  id: props.id,
  ...JSON.parse(props.content),
})
const formRules = ref<FormRules>({
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ],
})

defineExpose({
  submit() {
    return new Promise<void>((resolve) => {
      formRef.value?.validate((valid) => {
        if (valid) {
          apiDatabase.editSlice(form.value).then(() => {
            toast.success('编辑切片成功')
            resolve()
          })
        }
      })
    })
  },
})
</script>

<template>
  <div v-loading="loading">
    <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px" label-suffix="：">
      <ElFormItem label="切片内容" prop="content">
        <ElInput v-model="form.content" placeholder="请输入内容" type="textarea" rows="10" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
