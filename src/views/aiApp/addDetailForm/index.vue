<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiApp from '@/api/modules/aiApp'
import apiCommon from '@/api/modules/common'
import apiDatabase from '@/api/modules/database'
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
  appType: '',
  appName: '',
  appIcon: '',
  appDesc: '',
  chatModelId: '',
  knowledgeId: '',
})
const formRules = ref<FormRules>({
  appName: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
  ],
  appType: [
    { required: true, message: '请选择应用类型', trigger: 'blur' },
  ],
  chatModelId: [
    { required: true, message: '请选择关联模型', trigger: 'blur' },
  ],
  knowledgeId: [
    { required: true, message: '请选择关联知识库', trigger: 'blur' },
  ],
})

onMounted(() => {
  getOptions()
  if (form.value.id !== '') {
    getInfo()
  }
})

const options = ref([])
const knowledgeOptions = ref([])
const modelOptions = ref([])
function getOptions() {
  apiCommon.getDictOptions('ai_app_type').then((res: any) => {
    options.value = res.data
  })
  // 知识库
  const params = {
    pageNum: '1',
    pageSize: '1000',
    sort: '',
    order: '',
    query: {
      knowledgeName: '',
    },
  }
  apiDatabase.list(params).then((res: any) => {
    knowledgeOptions.value = res.data.rows
  })
  // 模型
  const params1 = {
    pageNum: '1',
    pageSize: '1000',
    sort: '',
    order: '',
    query: {
      modelType: 'TG',
      modelName: '',
    },
  }
  apiModel.list(params1).then((res: any) => {
    modelOptions.value = res.data.rows
  })
}
function getInfo() {
  loading.value = true
  apiApp.detail({ id: form.value.id }).then((res: any) => {
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
            apiApp.add(form.value).then(() => {
              toast.success('新增应用成功')
              resolve()
            })
          }
          else {
            apiApp.edit(form.value).then(() => {
              toast.success('编辑应用成功')
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
    <ElForm ref="formRef" :model="form" :rules="formRules" label-width="110px" label-suffix="：">
      <ElFormItem label="应用封面">
        <FaIconPicker v-model="form.appIcon" />
      </ElFormItem>
      <ElFormItem label="应用名称" prop="appName">
        <ElInput v-model="form.appName" placeholder="请输入应用名称" />
      </ElFormItem>
      <ElFormItem label="应用类型" prop="appType">
        <ElSelect v-model="form.appType" placeholder="请选择应用类型">
          <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="关联模型" prop="chatModelId">
        <ElSelect v-model="form.chatModelId" placeholder="请选择关联模型">
          <ElOption v-for="item in modelOptions" :key="item.id" :label="item.modelAlias" :value="item.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="关联知识库" prop="knowledgeId">
        <ElSelect v-model="form.knowledgeId" placeholder="请选择关联知识库">
          <ElOption v-for="item in knowledgeOptions" :key="item.id" :label="item.knowledgeName" :value="item.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="应用描述" prop="appDesc">
        <ElInput v-model="form.appDesc" placeholder="请输入应用描述" type="textarea" resize="none" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
