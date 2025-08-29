<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiCommon from '@/api/modules/common'
import apiRole from '@/api/modules/role'

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
  roleCode: '',
  roleName: '',
  roleSort: '',
  roleDes: '',
  dataScope: '',
})
const formRules = ref<FormRules>({
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
  ],
  roleCode: [
    { required: true, message: '请输入权限字符', trigger: 'blur' },
  ],
  roleSort: [
    { required: true, message: '请输入角色顺序', trigger: 'blur' },
  ],
  dataScope: [
    { required: true, message: '请选择数据范围', trigger: 'blur' },
  ],
})

onMounted(() => {
  if (form.value.id !== '') {
    getInfo()
  }
})

const scopeOptions = ref([])
function getOptions() {
  apiCommon.getDictOptions('data_scope_type').then((res: any) => {
    scopeOptions.value = res.data
  })
}
getOptions()

function getInfo() {
  loading.value = true
  apiRole.detail(form.value.id).then((res: any) => {
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
            apiRole.create(form.value).then(() => {
              toast.success('新增成功')
              resolve()
            })
          }
          else {
            apiRole.edit(form.value).then(() => {
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
      <ElFormItem label="角色名称" prop="roleName">
        <ElInput v-model="form.roleName" placeholder="请输入角色名称" />
      </ElFormItem>
      <ElFormItem label="权限字符" prop="roleCode">
        <ElInput v-model="form.roleCode" placeholder="请输入权限字符" />
      </ElFormItem>
      <ElFormItem label="角色顺序" prop="roleSort">
        <el-input-number
          v-model="form.roleSort"
          :min="1"
          controls-position="right"
        />
      </ElFormItem>
      <ElFormItem label="权限范围" prop="dataScope">
        <el-select
          v-model="form.dataScope"
          placeholder="请选择数据权限范围"
        >
          <el-option
            v-for="item in scopeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </ElFormItem>
      <ElFormItem label="备注" prop="roleDes">
        <ElInput v-model="form.roleDes" placeholder="请输入备注" type="textarea" />
      </ElFormItem>
    </ElForm>
  </div>
</template>
