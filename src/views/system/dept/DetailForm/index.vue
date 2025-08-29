<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiDept from '@/api/modules/dept'

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
  postCode: '',
  postName: '',
  postDesc: '',
  postSort: '0',
})
const formRules = ref<FormRules>({
  postCode: [
    { required: true, message: '请输入岗位编码', trigger: 'blur' },
  ],
  postName: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' },
  ],
  postDesc: [
    { required: true, message: '请输入岗位描述', trigger: 'blur' },
  ],
  postSort: [
    { required: true, message: '请输入岗位排序', trigger: 'blur' },
  ],
})

onMounted(() => {
  if (form.value.id !== '') {
    getInfo()
  }
})

function getInfo() {
  loading.value = true
  apiDept.detail(form.value.id).then((res: any) => {
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
            apiDept.create(form.value).then(() => {
              toast.success('新增成功')
              resolve()
            })
          }
          else {
            apiDept.edit(form.value).then(() => {
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
      <ElFormItem label="岗位名称" prop="postName">
        <ElInput v-model="form.postName" placeholder="请输入岗位名称" />
      </ElFormItem>
      <ElFormItem label="岗位编码" prop="postCode">
        <ElInput v-model="form.postCode" placeholder="请输入岗位编码" />
      </ElFormItem>
      <ElFormItem label="岗位排序" prop="postSort">
        <el-input-number
          v-model="form.postSort"
          :min="1"
          :max="1000"
          controls-position="right"
        />
      </ElFormItem>
      <ElFormItem label="岗位描述" prop="postDesc">
        <ElInput v-model="form.postDesc" placeholder="请输入岗位描述" type="textarea" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
