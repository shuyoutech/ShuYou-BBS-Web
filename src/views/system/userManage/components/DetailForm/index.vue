<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiCommon from '@/api/modules/common'
import apiOrg from '@/api/modules/org'
import apiManager from '@/api/modules/userManager'

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
  username: '',
  realName: '',
  nickname: '',
  phone: '',
  email: '',
  sex: 'female',
  address: '',
  orgId: '',
  status: '1',
})
function validatePhone(rule, value, callback) {
  if (!value) {
    return callback(new Error('手机号不能为空'))
  }
  if (!/^1[3-9]\d{9}$/.test(value)) {
    return callback(new Error('请输入正确的手机号'))
  }
  callback()
}
// 邮箱校验规则
function validateEmail(rule, value, callback) {
  // 邮箱正则表达式
  const reg = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  if (!reg.test(value)) {
    return callback(new Error('请输入正确的邮箱格式'))
  }
  callback()
}
const formRules = ref<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
  ],
  sex: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  orgId: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      validator: validatePhone,
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator: validateEmail,
      trigger: 'blur',
    },
  ],
  address: [
    { required: true, message: '请输入地址', trigger: 'blur' },
  ],
})

onMounted(() => {
  getOptions()
  if (form.value.id !== '') {
    getInfo()
  }
})

function getInfo() {
  loading.value = true
  apiManager.detail({ userId: form.value.id }).then((res: any) => {
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
const sexOptions = ref([])
const orgList = ref([])
const statusOptions = ref([])
function getOptions() {
  apiCommon.getDictOptions('sex_type').then((res: any) => {
    sexOptions.value = res.data
  })
  apiCommon.getDictOptions('status_type').then((res: any) => {
    statusOptions.value = res.data
  })
  const params = {
    pageSize: '1000',
    pageNum: '1',
    query: {
      orgName: '',
    },
  }
  apiOrg.list(params).then((res: any) => {
    orgList.value = res.data.rows
  })
}
defineExpose({
  submit() {
    return new Promise<void>((resolve) => {
      formRef.value?.validate((valid) => {
        if (valid) {
          if (form.value.id === '') {
            apiManager.create(form.value).then(() => {
              toast.success('新增成功')
              resolve()
            })
          }
          else {
            apiManager.edit(form.value).then(() => {
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
    <ElForm ref="formRef" :model="form" :rules="formRules" label-width="120px" label-suffix="：">
      <ElFormItem label="用户名" prop="username">
        <ElInput v-model="form.username" placeholder="请输入用户名" />
      </ElFormItem>
      <ElFormItem label="昵称" prop="nickname">
        <ElInput v-model="form.nickname" placeholder="请输入昵称" />
      </ElFormItem>
      <ElFormItem label="真实姓名" prop="realName">
        <ElInput v-model="form.realName" placeholder="请输入真实姓名" />
      </ElFormItem>
      <ElFormItem label="性别" prop="sex">
        <ElRadioGroup v-model="form.sex">
          <ElRadioButton v-for="(item, i) in sexOptions" :key="item + i" :value="item.value">
            {{ item.label }}
          </ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="手机号" prop="phone">
        <ElInput v-model="form.phone" placeholder="请输入手机号" />
      </ElFormItem>
      <ElFormItem label="所属机构" prop="orgId">
        <ElSelect v-model="form.orgId" placeholder="请选择机构" clearable>
          <ElOption v-for="item in orgList" :key="item.id" :label="item.orgName" :value="item.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="邮箱" prop="email">
        <ElInput v-model="form.email" placeholder="请输入邮箱" />
      </ElFormItem>
      <ElFormItem label="地址" prop="address">
        <ElInput v-model="form.address" placeholder="请输入地址" />
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio v-for="(item, i) in statusOptions" :key="item + i" :value="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </ElFormItem>
    </ElForm>
  </div>
</template>
