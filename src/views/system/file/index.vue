<script setup lang="ts">
import axios from 'axios'
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import apiFile from '@/api/modules/file'
import FormMode from './FormMode/index.vue'

defineOptions({
  name: 'PagesFileList',
})

const { pagination, getParams, onSizeChange, onCurrentChange, onSortChange } = usePagination()

// 表格是否自适应高度
const tableAutoHeight = ref(false)
// 列表
const loading = ref(false)
const dataList = ref([])
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
  type: '',
})
// 搜索
const searchDefault = {
  fileName: '',
}
const search = ref({ ...searchDefault })
function searchReset() {
  Object.assign(search.value, searchDefault)
}
onMounted(() => {
  getDataList()
})

function getDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    sort: 'createTime',
    order: 'desc',
    query: {
      originalFileName: search.value.fileName,
    },
  }
  apiFile.list(params).then((res: any) => {
    loading.value = false
    dataList.value = res.data.rows
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
  formModeProps.value.type = 'file'
  formModeProps.value.visible = true
}

function onCreateImage() {
  formModeProps.value.type = 'image'
  formModeProps.value.visible = true
}

function handleExport(row: any) {
  const baseURL = (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL
  axios.post(`${baseURL}file/download/${row.id}`, {
    id: row.id,
  }, {
    responseType: 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url

    const fileName = row.originalFileName
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('文件下载成功')
  })
}

function onDel(row: any) {
  ElMessageBox.confirm(`确认删除「${row.originalFileName}」吗？`, '确认信息').then(() => {
    apiFile.delete({ id: row.id }).then(() => {
      getDataList()
      toast.success('删除成功')
    })
  }).catch(() => {})
}
</script>

<template>
  <div :class="{ 'absolute-container': tableAutoHeight }">
    <FaPageMain :class="{ 'flex-1 overflow-auto': tableAutoHeight }" :main-class="{ 'flex-1 flex flex-col overflow-auto': tableAutoHeight }">
      <FaSearchBar :show-toggle="false">
        <ElForm :model="search" size="default" label-width="100px" inline-message inline class="search-form">
          <ElFormItem label="文件名称">
            <ElInput v-model="search.fileName" placeholder="请输入文件名称" clearable @keydown.enter="currentChange()" @clear="currentChange()" />
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
          </ElFormItem>
        </ElForm>
      </FaSearchBar>
      <ElDivider border-style="dashed" />
      <ElSpace wrap>
        <ElButton type="primary" size="default" @click="onCreate">
          <template #icon>
            <FaIcon name="i-ep:upload" />
          </template>
          上传文件
        </ElButton>
        <ElButton type="primary" size="default" @click="onCreateImage">
          <template #icon>
            <FaIcon name="i-ep:upload" />
          </template>
          上传图片
        </ElButton>
      </ElSpace>
      <ElTable v-loading="loading" class="my-4" :data="dataList" stripe highlight-current-row border height="100%" @sort-change="sortChange">
        <ElTableColumn prop="originalFileName" label="文件名" />
        <ElTableColumn prop="fileType" label="文件类型" />
        <ElTableColumn prop="fileSize" label="文件大小" />
        <ElTableColumn prop="fileHash" label="文件Hash" />
        <ElTableColumn label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <ElSpace>
              <ElButton type="primary" size="small" plain @click="handleExport(scope.row)">
                下载
              </ElButton>
              <ElButton type="danger" size="small" plain @click="onDel(scope.row)">
                删除
              </ElButton>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElPagination :current-page="pagination.pageNum" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="pagination.sizes" :layout="pagination.layout" :hide-on-single-page="false" class="pagination" background @current-change="currentChange" @size-change="sizeChange" />
    </FaPageMain>
    <FormMode v-if="formMode === 'dialog' || formMode === 'drawer'" v-model="formModeProps.visible" :type="formModeProps.type" :mode="formMode" @success="getDataList" />
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

.click-btn {
  color: #1890ff;
  cursor: pointer;
}
</style>
