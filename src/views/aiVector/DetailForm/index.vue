<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { toast } from 'vue-sonner'
import apiCommon from '@/api/modules/common'
import apiVector from '@/api/modules/vector'

export interface Props {
  id?: number | string
  type?: string
}
const props = withDefaults(
  defineProps<Props>(),
  {
    id: '',
    type: '',
  },
)

const loading = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')
const form = ref({
  id: props.id,
  type: props.type,
  name: '',
  type: '',
  host: '',
  port: '',
  username: '',
  password: '',
  databaseName: '',
  tableName: '',
  dimension: '',
})

const formRules = computed(() => {
  const rules = {
    name: [{ required: true, message: '请输入数据库别名', trigger: 'blur' }],
    type: [{ required: true, message: '请选择供应商', trigger: 'blur' }],
    host: [{ required: true, message: '请输入数据库地址', trigger: 'blur' }],
    port: [{ required: true, message: '请输入数据库端口', trigger: 'blur' }],
    databaseName: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
  }
  if (props.type === '1') {
    rules.tableName = [
      { required: true, message: '请输入表名称', trigger: 'blur' },
    ]
    rules.dimension = [
      { required: true, message: '请输入向量维度', trigger: 'blur' },
    ]
    rules.username = [
      { required: true, message: '请输入数据库用户名', trigger: 'blur' },
    ]
    rules.password = [
      { required: true, message: '请输入数据库密码', trigger: 'blur' },
    ]
  }
  if (props.type === '2') {
    rules.tableName = [
      { required: true, message: '请输入表名称', trigger: 'blur' },
    ]
    rules.dimension = [
      { required: true, message: '请输入向量维度', trigger: 'blur' },
    ]
  }
  return rules
})
onMounted(() => {
  getOptions()
  if (form.value.id !== '') {
    getInfo()
  }
})
const providerOptions = ref([])
function getOptions() {
  apiCommon.getDictOptions('vector_store_type').then((res: any) => {
    providerOptions.value = res.data
  })
  form.value.type = props.type
}
function getInfo() {
  apiVector.detail({ id: form.value.id }).then((res: any) => {
    const keys = Object.keys(form.value)
    keys.map((key) => {
      if (res.data[key] !== undefined && key !== 'type') {
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
            apiVector.add(form.value).then(() => {
              toast.success('新增成功')
              resolve()
            })
          }
          else {
            apiVector.edit(form.value).then(() => {
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
    <ElAlert class="mb-20px" title="注意：请慎重修改模型的向量纬度参数（Dimension），此参数需要和向量库匹配（错误修改可能将影响已有的向量数据）" type="primary" show-icon :closable="false" />
    <ElForm ref="formRef" :model="form" :rules="formRules" label-width="130px" label-suffix="：">
      <ElRow>
        <ElCol :xl="12" :lg="24" :md="24">
          <ElFormItem label="数据库别名" prop="name">
            <ElInput v-model="form.name" placeholder="请输入数据库别名" />
          </ElFormItem>
        </ElCol>
        <ElCol :xl="12" :lg="24" :md="24">
          <ElFormItem label="供应商" prop="type">
            <ElSelect v-model="form.type" placeholder="请选择" clearable disabled>
              <ElOption v-for="item in providerOptions" :key="item.value" :label="item.label" :value="item.value" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :xl="12" :lg="24" :md="24">
          <ElFormItem label="数据库地址" prop="host">
            <ElInput v-model="form.host" placeholder="请输入数据库地址" />
          </ElFormItem>
        </ElCol>
        <ElCol :xl="12" :lg="24" :md="24">
          <ElFormItem label="数据库端口" prop="port">
            <ElInput v-model="form.port" placeholder="请输入数据库端口" :min="0" type="number" />
          </ElFormItem>
        </ElCol>
        <ElCol :xl="12" :lg="24" :md="24">
          <ElFormItem label="数据库名" prop="databaseName">
            <ElInput v-model="form.databaseName" placeholder="请输入数据库名" />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="$props.type !== '3'" :xl="12" :lg="24" :md="24">
          <ElFormItem label="表名称" prop="tableName">
            <ElInput v-model="form.tableName" placeholder="请输入表名称" />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="$props.type === '1'" :xl="12" :lg="24" :md="24">
          <ElFormItem label="数据库用户名" prop="username">
            <ElInput v-model="form.username" placeholder="请输入数据库用户名" />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="$props.type === '1'" :xl="12" :lg="24" :md="24">
          <ElFormItem label="数据库密码" prop="password">
            <ElInput v-model="form.password" placeholder="请输入数据库密码" type="password" />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="$props.type !== '3'" :xl="12" :lg="24" :md="24">
          <ElFormItem prop="dimension">
            <template #label>
              向量纬度
              <ElTooltip content="慎重修改此参数，纬度高会消耗更多的算力，但纬度高并不代表搜索更准确" placement="top">
                <FaIcon name="i-ri:question-line" />
              </ElTooltip>
            </template>
            <ElInput v-model="form.dimension" placeholder="请输入向量纬度" />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
  </div>
</template>
