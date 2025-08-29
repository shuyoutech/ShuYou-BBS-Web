<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiCommon from '@/api/modules/common'
import apiModel from '@/api/modules/model'

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
  modelName: '',
  modelAlias: '',
  baseUrl: '',
  apiKey: '',
  modelDesc: '',
  status: '',
  provider: '',
  modelTypes: [],
})
const formRules = ref<FormRules>({
  modelName: [
    { required: true, message: '请输入模型名称', trigger: 'blur' },
  ],
  modelAlias: [
    { required: true, message: '请输入模型别名', trigger: 'blur' },
  ],
  modelTypes: [
    { required: true, message: '请选择模型名称', trigger: 'blur' },
  ],
  baseUrl: [
    { required: true, message: '请输入请求地址', trigger: 'blur' },
  ],
  apiKey: [
    { required: true, message: '请输入apiKey', trigger: 'blur' },
  ],
  modelDesc: [
    { required: true, message: '请输入模型描述', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请输入请求地址', trigger: 'blur' },
  ],
  provider: [
    { required: true, message: '请输入请求地址', trigger: 'blur' },
  ],
})

onMounted(() => {
  getOptions()
  if (form.value.id !== '') {
    getInfo()
  }
})

const options = ref([])
const statusOptions = ref([])
const providerOptions = ref([])
function getOptions() {
  apiCommon.getDictOptions('model_type').then((res: any) => {
    options.value = res.data
  })
  apiCommon.getDictOptions('status_type').then((res: any) => {
    statusOptions.value = res.data
  })
  apiCommon.getDictOptions('provider_type').then((res: any) => {
    providerOptions.value = res.data
  })
}
function getInfo() {
  loading.value = true
  apiModel.detail({ id: form.value.id }).then((res: any) => {
    loading.value = false
    const keys = Object.keys(form.value)
    keys.map((key) => {
      if (res.data[key] !== undefined) {
        form.value[key] = res.data[key]
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
            apiModel.create(form.value).then(() => {
              toast.success('新增模型成功')
              resolve()
            })
          }
          else {
            apiModel.update(form.value).then(() => {
              toast.success('编辑模型成功')
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
      <ElFormItem label="模型名称" prop="modelName">
        <ElInput v-model="form.modelName" placeholder="请输入模型名称" />
      </ElFormItem>
      <ElFormItem label="模型别名" prop="modelAlias">
        <ElInput v-model="form.modelAlias" placeholder="请输入模型别名" />
      </ElFormItem>
      <ElFormItem label="模型类型" prop="modelTypes">
        <ElSelect v-model="form.modelTypes" placeholder="请选择" clearable collapse-tags collapse-tags-tooltip multiple>
          <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="请求地址" prop="baseUrl">
        <ElInput v-model="form.baseUrl" placeholder="请输入请求地址" />
      </ElFormItem>
      <ElFormItem label="apiKey" prop="apiKey">
        <ElInput v-model="form.apiKey" placeholder="请输入apiKey" />
      </ElFormItem>
      <ElFormItem label="模型描述" prop="modelDesc">
        <ElInput v-model="form.modelDesc" placeholder="请输入模型描述" type="textarea" resize="none" />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElSelect v-model="form.status" placeholder="请选择" clearable>
          <ElOption v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="提供商" prop="provider">
        <ElSelect v-model="form.provider" placeholder="请选择" clearable>
          <ElOption v-for="item in providerOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
    </ElForm>
  </div>
</template>
