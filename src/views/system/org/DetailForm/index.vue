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
  status: '1',
  parentId: '',
  orgType: '',
  orgName: '',
  orgSort: '',
  directorId: '',
})
const formRules = ref<FormRules>({
  parentId: [
    { required: true, message: '请选择上级部门', trigger: 'blur' },
  ],
  orgName: [
    { required: true, message: '请输入机构名称', trigger: 'blur' },
  ],
  orgSort: [
    { required: true, message: '请输入排序', trigger: 'blur' },
  ],
  orgType: [
    { required: true, message: '请选择类别编号', trigger: 'blur' },
  ],
  directorId: [
    { required: true, message: '请选择负责人', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' },
  ],

})

onMounted(() => {
  getOptions()
  if (form.value.id !== '') {
    getInfo()
  }
})

const options = ref([])
const userList = ref([])
const statusOptions = ref([])
const dataList = ref([])
function getOptions() {
  apiCommon.getDictOptions('org_type').then((res: any) => {
    options.value = res.data
  })
  apiCommon.getDictOptions('status_type').then((res: any) => {
    statusOptions.value = res.data
  })
  const params = {
    pageNum: '1',
    pageSize: '1000',
    sort: 'createTime',
    order: 'desc',
    query: {
      username: '',
      phone: '',
      email: '',
    },
  }
  apiManager.list(params).then((res: any) => {
    userList.value = res.data.rows
  })
  apiOrg.tree({}).then((res: any) => {
    dataList.value = res.data
  })
}
function getInfo() {
  loading.value = true
  apiOrg.detail(form.value.id).then((res: any) => {
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
            apiOrg.create(form.value).then(() => {
              toast.success('新增成功')
              resolve()
            })
          }
          else {
            apiOrg.edit(form.value).then(() => {
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
      <ElFormItem label="上级机构" prop="parentId">
        <el-tree-select
          v-model="form.parentId"
          :data="dataList"
          :render-after-expand="false"
          :check-strictly="true"
        />
      </ElFormItem>
      <ElFormItem label="机构名称" prop="orgName">
        <ElInput v-model="form.orgName" placeholder="请输入机构名称" />
      </ElFormItem>
      <ElFormItem label="显示排序" prop="orgSort">
        <el-input-number
          v-model="form.orgSort"
          :min="1"
          :max="1000"
          controls-position="right"
        />
      </ElFormItem>
      <ElFormItem label="机构类型" prop="orgType">
        <ElSelect v-model="form.orgType" placeholder="请选择类型">
          <ElOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="负责人" prop="directorId">
        <ElSelect v-model="form.directorId" placeholder="请选择">
          <ElOption v-for="item in userList" :key="item.id" :label="item.username" :value="item.id" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElRadioGroup v-model="form.status">
          <ElRadioButton v-for="(item, i) in statusOptions" :key="item + i" :value="item.value">
            {{ item.label }}
          </ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>
  </div>
</template>
