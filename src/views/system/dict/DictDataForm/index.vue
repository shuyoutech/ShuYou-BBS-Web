<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiDict from '@/api/modules/dictionary'

export interface Props {
  id?: number | string
}
const props = withDefaults(
  defineProps<Props>(),
  {
    id: '',
  },
)
const route = useRoute()
const loading = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')
const form = ref({
  id: props.id,
  dictTypeId: route.query.id as string ?? '',
  dictLabel: '',
  dictValue: '',
  dictSort: 0,
})
const formRules = ref<FormRules>({
  dictLabel: [
    { required: true, message: '请输入数据标签', trigger: 'blur' },
  ],
  dictValue: [
    { required: true, message: '请输入数据键值', trigger: 'blur' },
  ],
  dictSort: [
    { required: true, message: '请输入显示排序', trigger: 'blur' },
  ],
})
const dictTypeName = ref(route.query.name as string ?? '')
onMounted(() => {
  if (form.value.id) {
    getInfo()
  }
})

function getInfo() {
  loading.value = true
  apiDict.itemDetail(form.value.id).then((res: any) => {
    loading.value = false
    form.value.dictLabel = res.data.dictLabel
    form.value.dictValue = res.data.dictValue
    form.value.dictSort = res.data.dictSort
  })
}

defineExpose({
  submit() {
    return new Promise<void>((resolve) => {
      formRef.value?.validate((valid) => {
        if (valid) {
          if (form.value.id) {
            apiDict.itemEdit(form.value).then(() => {
              toast.success('编辑字典数据成功')
              resolve()
            })
          }
          else {
            apiDict.itemCreate(form.value).then(() => {
              toast.success('新增字典数据成功')
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
      <ElFormItem label="字典类型" prop="dictName">
        <ElInput v-model="dictTypeName" disabled />
      </ElFormItem>
      <ElFormItem label="数据标签" prop="dictLabel">
        <ElInput v-model="form.dictLabel" placeholder="请输入数据标签" />
      </ElFormItem>
      <ElFormItem label="数据键值" prop="dictValue">
        <ElInput v-model="form.dictValue" placeholder="请输入数据键值" />
      </ElFormItem>
      <ElFormItem label="显示排序" prop="dictSort">
        <el-input-number
          v-model="form.dictSort"
          :min="1"
          :max="1000"
          controls-position="right"
        />
      </ElFormItem>
    </ElForm>
  </div>
</template>
