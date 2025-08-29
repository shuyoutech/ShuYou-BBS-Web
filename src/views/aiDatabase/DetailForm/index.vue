<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiDatabase from '@/api/modules/database'
import apiModel from '@/api/modules/model'
import apiVector from '@/api/modules/vector'

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
  knowledgeName: '',
  vectorStoreId: '',
  embeddingModelId: '',
  knowledgeDesc: '',
})
const formRules = ref<FormRules>({
  knowledgeName: [
    { required: true, message: '请输入知识库名称', trigger: 'blur' },
  ],
  vectorStoreId: [
    { required: true, message: '请选择关联向量数据库', trigger: 'blur' },
  ],
  embeddingModelId: [
    { required: true, message: '请选择关联向量化模型', trigger: 'blur' },
  ],
  knowledgeDesc: [
    { required: true, message: '请输入知识库描述', trigger: 'blur' },
  ],
})

onMounted(() => {
  getOptions()
  if (form.value.id !== '') {
    getInfo()
  }
})

const options = ref([])
const modelOptions = ref([])
function getOptions() {
  // 向量库
  const params = {
    pageNum: '1',
    pageSize: '1000',
    sort: '',
    order: '',
    query: {
      type: '',
      name: '',
    },
  }
  apiVector.list(params).then((res: any) => {
    options.value = res.data.rows
  })
  // 向量模型
  const params1 = {
    pageNum: '1',
    pageSize: '1000',
    sort: '',
    order: '',
    query: {
      modelType: 'TE',
      modelName: '',
    },
  }
  apiModel.list(params1).then((res: any) => {
    modelOptions.value = res.data.rows
  })
}
function getInfo() {
  loading.value = true
  apiDatabase.detail({ id: form.value.id }).then((res: any) => {
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
            apiDatabase.addKnowledge(form.value).then(() => {
              toast.success('新增知识库成功')
              resolve()
            })
          }
          else {
            apiDatabase.editKnowledge(form.value).then(() => {
              toast.success('编辑知识库成功')
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
      <ElFormItem label="知识库名称" prop="knowledgeName">
        <ElInput v-model="form.knowledgeName" placeholder="请输入知识库名称" />
      </ElFormItem>
      <ElFormItem label="向量数据库" prop="vectorStoreId">
        <ElSelect v-model="form.vectorStoreId" placeholder="请选择" clearable>
          <ElOption v-for="item in options" :key="item.id" :label="item.databaseName" :value="item.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="向量模型" prop="embeddingModelId">
        <ElSelect v-model="form.embeddingModelId" placeholder="请选择" clearable>
          <ElOption v-for="item in modelOptions" :key="item.id" :label="item.modelName" :value="item.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="知识库描述" prop="knowledgeDesc">
        <ElInput v-model="form.knowledgeDesc" placeholder="请输入知识库描述" type="textarea" resize="none" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
