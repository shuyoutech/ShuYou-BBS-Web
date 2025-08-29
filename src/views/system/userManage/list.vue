<route lang="yaml">
meta:
  enabled: false
</route>

<script setup lang="ts">
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import apiManager from '@/api/modules/userManager'
import eventBus from '@/utils/eventBus'
import AuthMode from './auth/FormMode/index.vue'
import FormMode from './components/FormMode/index.vue'
import ImportMode from './import/FormMode/index.vue'

defineOptions({
  name: 'PagesUserList',
})

const router = useRouter()
const { pagination, getParams, onSizeChange, onCurrentChange, onSortChange } = usePagination()

// 表格是否自适应高度
const tableAutoHeight = ref(false)

/**
 * 详情展示模式
 * router 路由跳转
 * dialog 对话框
 * drawer 抽屉
 */
const formMode = ref<'router' | 'dialog' | 'drawer'>('dialog')

// 详情
const formModeProps = ref({
  visible: false,
  id: '',
})
const authFormModeProps = ref({
  visible: false,
  id: '',
})
const importFormModeProps = ref({
  visible: false,
  id: '',
})
// 搜索
const searchDefault = {
  username: '',
  phone: '',
  email: '',
}
const search = ref({ ...searchDefault })
function searchReset() {
  Object.assign(search.value, searchDefault)
}

// 批量操作
const batch = ref({
  enable: true,
  selectionDataList: [],
})

// 列表
const loading = ref(false)
const dataList = ref([])

onMounted(() => {
  getDataList()
  if (formMode.value === 'router') {
    eventBus.on('get-data-list', () => {
      getDataList()
    })
  }
})

onBeforeUnmount(() => {
  if (formMode.value === 'router') {
    eventBus.off('get-data-list')
  }
})

function getDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    sort: 'createTime',
    order: 'desc',
    query: {
      username: '',
      phone: '',
      email: '',
    },
  }
  apiManager.list(params).then((res: any) => {
    loading.value = false
    dataList.value = res.data.rows
    dataList.value.forEach((item: any) => {
      item.statusLoading = false
    })
    pagination.value.total = Number(res.data.total | 0)
  })
}

// 每页数量切换
function sizeChange(size: number) {
  onSizeChange(size).then(() => getDataList())
}

// 当前页码切换（翻页）
function currentChange(page = 1) {
  onCurrentChange(page).then(() => getDataList())
}

// 字段排序
function sortChange({ prop, order }: { prop: string, order: string }) {
  onSortChange(prop, order).then(() => getDataList())
}

function onCreate() {
  if (formMode.value === 'router') {
    router.push({
      name: 'pagesExampleUserCreate',
    })
  }
  else {
    formModeProps.value.id = ''
    formModeProps.value.visible = true
  }
}

function onEdit(row: any) {
  if (formMode.value === 'router') {
    router.push({
      name: 'pagesExampleUserEdit',
      params: {
        id: row.id,
      },
    })
  }
  else {
    formModeProps.value.id = row.id
    formModeProps.value.visible = true
  }
}

function onResetPassword(row: any) {
  ElMessageBox.confirm(`确认将「${row.username}」的密码重置为 “123456” 吗？`, '确认信息').then(() => {
    apiManager.passwordReset({ userId: row.id, password: '123456' }).then(() => {
      toast.success('密码重置成功')
    })
  }).catch(() => {})
}

function onDel(row: any) {
  ElMessageBox.confirm(`确认删除「${row.username}」吗？`, '确认信息').then(() => {
    apiManager.delete([row.id]).then(() => {
      getDataList()
      toast.success('删除成功')
    })
  }).catch(() => {})
}
function onAuth(row: any) {
  authFormModeProps.value.id = row.id
  authFormModeProps.value.visible = true
}
function handleMoreOperating(command: string, row: any) {
  switch (command) {
    case 'resetPassword':
      onResetPassword(row)
      break
    case 'delete':
      onDel(row)
      break
    default:
      onAuth(row)
      break
  }
}

function handleBatcDel() {
  ElMessageBox.confirm(`确认批量删除这些用户吗？`, '确认信息').then(() => {
    const ids = batch.value.selectionDataList.map((item: any) => item.id)
    apiManager.delete(ids).then(() => {
      getDataList()
      toast.success('删除成功')
    })
  }).catch(() => {})
}
function decodeDownloadFilename(contentDisposition) {
  if (!contentDisposition) {
    return 'download'
  }

  // 1. 处理 RFC 5987 编码 (filename*=UTF-8'')
  const utf8Match = contentDisposition.match(/filename\*=(?:UTF-8| utf-8)''([^;]+)/i)
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1])
    }
    catch {
      return utf8Match[1]
    }
  }

  // 2. 处理 ISO-8859-1 编码 (filename=)
  let filenameMatch = contentDisposition.match(/filename="([^"]+)"/i)
  if (!filenameMatch) {
    filenameMatch = contentDisposition.match(/filename=([^;]+)/i)
  }

  if (filenameMatch && filenameMatch[1]) {
    let filename = filenameMatch[1].trim()
    // 处理可能的百分号编码（非标准但常见）
    if (filename.includes('%')) {
      try {
        filename = decodeURIComponent(filename)
      }
      catch {
        // 如果解码失败，保持原样
      }
    }
    // 处理引号和分号
    return filename.replace(/^"+|"+$/g, '').replace(/;$/, '')
  }

  // 3. 默认文件名
  return 'download'
}
function handleExport() {
  const baseURL = (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL
  axios.post(`${baseURL}user/export`, {
    ...search.value,
  }, {
    responseType: 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    // 从响应头获取文件名
    const contentDisposition = response.headers['content-disposition']
    let fileName = 'default_filename'
    if (contentDisposition) {
      fileName = decodeDownloadFilename(contentDisposition)
    }
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('导出成功')
  })
}
function handleImport() {
  importFormModeProps.value.id = ''
  importFormModeProps.value.visible = true
}
function handleDownload() {
  const baseURL = (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL
  axios.post(`${baseURL}/common/templateFile`, {
    templateType: 'user',
  }, {
    responseType: 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    // 从响应头获取文件名
    const contentDisposition = response.headers['content-disposition']
    let fileName = 'template'
    if (contentDisposition) {
      fileName = decodeDownloadFilename(contentDisposition)
    }
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('下载成功')
  })
}
</script>

<template>
  <div :class="{ 'absolute-container': tableAutoHeight }">
    <FaPageMain :class="{ 'flex-1 overflow-auto': tableAutoHeight }" :main-class="{ 'flex-1 flex flex-col overflow-auto': tableAutoHeight }">
      <FaSearchBar :show-toggle="false">
        <template #default="{ fold, toggle }">
          <ElForm :model="search" size="default" label-width="100px" inline-message inline class="search-form">
            <ElFormItem label="用户名">
              <ElInput v-model="search.username" placeholder="请输入用户名" clearable @keydown.enter="currentChange()" @clear="currentChange()" />
            </ElFormItem>
            <ElFormItem label="手机号">
              <ElInput v-model="search.phone" placeholder="请输入手机号" clearable @keydown.enter="currentChange()" @clear="currentChange()" />
            </ElFormItem>
            <ElFormItem v-show="!fold" label="邮箱">
              <ElInput v-model="search.email" placeholder="请输入邮箱" clearable @keydown.enter="currentChange()" @clear="currentChange()" />
            </ElFormItem>
            <ElFormItem>
              <ElButton @click="searchReset(); currentChange()">
                重置
              </ElButton>
              <ElButton type="primary" @click="currentChange()">
                <template #icon>
                  <FaIcon name="i-ep:search" />
                </template>
                筛选
              </ElButton>
              <ElButton link @click="toggle">
                <template #icon>
                  <FaIcon :name="fold ? 'i-ep:caret-bottom' : 'i-ep:caret-top' " />
                </template>
                {{ fold ? '展开' : '收起' }}
              </ElButton>
            </ElFormItem>
          </ElForm>
        </template>
      </FaSearchBar>
      <ElDivider border-style="dashed" />
      <ElSpace wrap>
        <ElButton type="primary" size="default" @click="onCreate">
          <template #icon>
            <FaIcon name="i-ep:plus" />
          </template>
          新增用户
        </ElButton>
        <ElButton size="default" @click="handleDownload">
          下载模板
        </ElButton>
        <ElButton size="default" @click="handleImport">
          导入用户
        </ElButton>
        <ElButton size="default" @click="handleExport">
          导出用户
        </ElButton>
        <ElButton v-if="batch.enable" size="default" :disabled="!batch.selectionDataList.length" @click="handleBatcDel">
          批量删除
        </ElButton>
      </ElSpace>
      <ElTable v-loading="loading" class="my-4" :data="dataList" stripe highlight-current-row border height="100%" @sort-change="sortChange" @selection-change="batch.selectionDataList = $event">
        <ElTableColumn v-if="batch.enable" type="selection" align="center" fixed />
        <ElTableColumn prop="username" sortable label="用户名" />
        <ElTableColumn prop="nickname" label="昵称" width="100" align="center" />
        <ElTableColumn prop="sex" label="性别" width="100" align="center">
          <template #default="scope">
            <ElTag v-if="scope.row.sex === 'male'" type="success" size="small">
              男
            </ElTag>
            <ElTag v-else type="warning" size="small">
              女
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="phone" label="手机号" width="150" align="center" />
        <ElTableColumn prop="email" label="邮箱" align="center" />
        <ElTableColumn prop="address" label="地址" align="center" />
        <ElTableColumn label="状态" width="100" align="center">
          <template #default="scope">
            <ElTag v-if="scope.row.status === '1'" type="success" size="small">
              启用
            </ElTag>
            <ElTag v-else type="danger" size="small">
              禁用
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <ElSpace>
              <ElButton type="primary" size="small" plain @click="onEdit(scope.row)">
                编辑
              </ElButton>
              <ElDropdown @command="handleMoreOperating($event, scope.row)">
                <ElButton size="small">
                  更多操作
                  <FaIcon name="i-ep:arrow-down" class="el-icon--right" />
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="auth">
                      角色授权
                    </ElDropdownItem>
                    <ElDropdownItem command="resetPassword">
                      重置密码
                    </ElDropdownItem>
                    <ElDropdownItem command="delete" divided>
                      删除
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElPagination :current-page="pagination.pageNum" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="pagination.sizes" :layout="pagination.layout" :hide-on-single-page="false" class="pagination" background @current-change="currentChange" @size-change="sizeChange" />
    </FaPageMain>
    <FormMode v-if="formMode === 'dialog' || formMode === 'drawer'" :id="formModeProps.id" v-model="formModeProps.visible" :mode="formMode" @success="getDataList" />
    <AuthMode v-if="formMode === 'dialog' || formMode === 'drawer'" :id="authFormModeProps.id" v-model="authFormModeProps.visible" :mode="formMode" @success="getDataList" />
    <ImportMode v-if="formMode === 'dialog' || formMode === 'drawer'" :id="importFormModeProps.id" v-model="importFormModeProps.visible" :mode="formMode" @success="getDataList" />
  </div>
</template>

<style scoped>
.absolute-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.search-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  margin-bottom: -18px;

  :deep(.el-form-item) {
    grid-column: auto / span 1;

    &:last-child {
      grid-column-end: -1;

      .el-form-item__content {
        justify-content: flex-end;
      }
    }
  }
}

.el-divider {
  width: calc(100% + 40px);
  margin-inline: -20px;
}
</style>
