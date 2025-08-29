<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiParam from '@/api/modules/param'

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
  configName: '',
  configKey: '',
  configValue: '',
  configDesc: '',
})
const formRules = ref<FormRules>({
  configName: [
    { required: true, message: '请输入参数名称', trigger: 'blur' },
  ],
  configKey: [
    { required: true, message: '请输入参数键名', trigger: 'blur' },
  ],
  configValue: [
    { required: true, message: '请输入参数键值', trigger: 'blur' },
  ],
  configDesc: [
    { required: true, message: '请输入参数描述', trigger: 'blur' },
  ],
})

onMounted(() => {
  if (form.value.id !== '') {
    getInfo()
  }
})

function getInfo() {
  loading.value = true
  apiParam.detail(form.value.id).then((res: any) => {
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
            apiParam.create(form.value).then(() => {
              toast.success('新增成功')
              resolve()
            })
          }
          else {
            apiParam.edit(form.value).then(() => {
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
    <ElForm ref="formRef" :model="form" :rules="formRules" label-width="100px" label-suffix="：">
      <ElFormItem label="参数名称" prop="configName">
        <ElInput v-model="form.configName" placeholder="请输入参数名称" />
      </ElFormItem>
      <ElFormItem label="参数键名" prop="configKey">
        <ElInput v-model="form.configKey" placeholder="请输入参数键名" />
      </ElFormItem>
      <ElFormItem label="参数键值" prop="configValue">
        <ElInput v-model="form.configValue" placeholder="请输入参数键值" />
      </ElFormItem>
      <ElFormItem label="参数描述" prop="configDesc">
        <ElInput v-model="form.configDesc" placeholder="请输入参数描述" type="textarea" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
