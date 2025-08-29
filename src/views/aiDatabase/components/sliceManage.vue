<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import apiDatabase from '@/api/modules/database'
import FormMode from './FormMode/index.vue'

const { pagination, getParams, onSizeChange, onCurrentChange } = usePagination()
const loading = ref(false)
const route = useRoute()
onMounted(() => {
  getDataList()
  getDocOptions()
})
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
const dataList = ref([])
const knowledgeId = ref(route.query.id ?? '')
// 搜索
const searchDefault = {
  docId: '',
}
const search = ref({ ...searchDefault })
function searchReset() {
  Object.assign(search.value, searchDefault)
}
const docOptions = ref([])
function getDocOptions() {
  const params = {
    pageNum: '1',
    pageSize: '1000',
    sort: '',
    order: '',
    query: {
      knowledgeId: knowledgeId.value,
      docName: '',
    },
  }
  apiDatabase.knowledgeDocList(params).then((res: any) => {
    docOptions.value = res.data.rows
  })
}
function getDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    sort: '',
    order: '',
    query: {
      knowledgeId: knowledgeId.value,
      docId: search.value.docId,
    },
  }
  apiDatabase.knowledgeSliceList(params).then((res: any) => {
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

function onDel(row: any) {
  ElMessageBox.confirm(`确认删除「${row.docName}」该切片内容吗？`, '确认信息').then(() => {
    apiDatabase.deleteSlice([row.id]).then(() => {
      getDataList()
      toast.success('删除成功')
    })
  }).catch(() => {})
}
const currentContent = ref('')
function onEdit(row: any) {
  currentContent.value = JSON.stringify(row)
  formModeProps.value.id = row.id
  formModeProps.value.visible = true
}
</script>

<template>
  <div class="w-full">
    <FaSearchBar :show-toggle="false">
      <ElForm :model="search" size="default" label-width="100px" inline-message inline class="search-form">
        <ElFormItem label="文件名称">
          <ElSelect v-model="search.docId" placeholder="请选择文档查询" clearable>
            <ElOption v-for="item in docOptions" :key="item.id" :label="item.docName" :value="item.id" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem>
          <ElButton @click="searchReset(); getDataList()">
            重置
          </ElButton>
          <ElButton type="primary" @click="getDataList()">
            <template #icon>
              <FaIcon name="i-ep:search" />
            </template>
            筛选
          </ElButton>
        </ElFormItem>
      </ElForm>
    </FaSearchBar>
    <ElDivider border-style="dashed" />
    <ElTable class="my-4" :data="dataList" stripe highlight-current-row border height="100%" @sort-change="sortChange">
      <ElTableColumn prop="docName" label="文档名称" />
      <ElTableColumn prop="content" label="切片内容" />
      <ElTableColumn prop="createTime" label="创建时间" />
      <ElTableColumn prop="vectorId" label="向量ID" />
      <ElTableColumn label="操作" width="200" align="center" fixed="right">
        <template #default="scope">
          <ElSpace>
            <ElButton type="primary" size="small" plain @click="onEdit(scope.row)">
              编辑
            </ElButton>
            <ElButton type="danger" size="small" plain @click="onDel(scope.row)">
              删除
            </ElButton>
          </ElSpace>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElPagination :current-page="pagination.pageNum" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="pagination.sizes" :layout="pagination.layout" :hide-on-single-page="false" class="pagination" background @current-change="currentChange" @size-change="sizeChange" />
    <FormMode v-if="formMode === 'dialog' || formMode === 'drawer'" :id="formModeProps.id" v-model="formModeProps.visible" :content="currentContent" :mode="formMode" @success="getDataList" />
  </div>
</template>

<style lang="scss" scoped>
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
</style>
