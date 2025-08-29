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

const loading = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')
const form = ref({
  id: props.id,
  dictCode: '',
  dictName: '',
  dictDesc: '',
})
const formRules = ref<FormRules>({
  dictCode: [
    { required: true, message: '请输入字典类型', trigger: 'blur' },
  ],
  dictName: [
    { required: true, message: '请输入字典名称', trigger: 'blur' },
  ],
})

onMounted(() => {
  if (form.value.id !== '') {
    getInfo()
  }
})

function getInfo() {
  loading.value = true
  apiDict.detail(form.value.id).then((res: any) => {
    loading.value = false
    form.value.dictCode = res.data.dictCode
    form.value.dictName = res.data.dictName
    form.value.dictDesc = res.data.dictDesc
  })
}

defineExpose({
  submit() {
    return new Promise<void>((resolve) => {
      formRef.value?.validate((valid) => {
        if (valid) {
          if (form.value.id === '') {
            apiDict.create(form.value).then(() => {
              toast.success('新增字典成功')
              resolve()
            })
          }
          else {
            apiDict.edit(form.value).then(() => {
              toast.success('编辑字典成功')
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
      <ElFormItem label="字典名称" prop="dictName">
        <ElInput v-model="form.dictName" placeholder="请输入角色名称" />
      </ElFormItem>
      <ElFormItem label="字典类型" prop="dictCode">
        <ElInput v-model="form.dictCode" placeholder="请输入字典类型" />
      </ElFormItem>
      <ElFormItem label="字典描述" prop="dictDesc">
        <ElInput v-model="form.dictDesc" placeholder="请输入字典描述" type="textarea" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
