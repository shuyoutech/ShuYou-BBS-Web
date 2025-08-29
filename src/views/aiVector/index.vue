<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import apiCommon from '@/api/modules/common'
import apiVector from '@/api/modules/vector'
import FormMode from './FormMode/index.vue'

defineOptions({
  name: 'PagesDictList',
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
  id: '',
})
// 搜索
const searchDefault = {
  type: '',
  name: '',
}
const search = ref({ ...searchDefault })
function searchReset() {
  Object.assign(search.value, searchDefault)
}
const addType = ref('1')
onMounted(() => {
  getOptions()
  getDataList()
})

const options = ref([])
function getOptions() {
  apiCommon.getDictOptions('vector_store_type').then((res: any) => {
    options.value = res.data
  })
}

function getDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    sort: '',
    order: '',
    query: {
      type: search.value.type,
      name: search.value.name,
    },
  }
  apiVector.list(params).then((res: any) => {
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
  formModeProps.value.id = ''
  formModeProps.value.visible = true
}

function onEdit(row) {
  addType.value = row.type
  formModeProps.value.id = row.id
  formModeProps.value.visible = true
}

function onDel(row: any) {
  ElMessageBox.confirm(`确认删除「${row.name}」吗？`, '确认信息').then(() => {
    apiVector.delete([row.id]).then(() => {
      getDataList()
      toast.success('删除成功')
    })
  }).catch(() => {})
}

function handleMoreOperating(command: string) {
  addType.value = command
  onCreate(command)
}
</script>

<template>
  <div :class="{ 'absolute-container': tableAutoHeight }">
    <FaPageMain :class="{ 'flex-1 overflow-auto': tableAutoHeight }" :main-class="{ 'flex-1 flex flex-col overflow-auto': tableAutoHeight }">
      <FaSearchBar :show-toggle="false">
        <ElForm :model="search" size="default" label-width="100px" inline-message inline class="search-form">
          <ElFormItem label="数据库名">
            <ElInput v-model="search.name" placeholder="请输入数据库名" clearable @keydown.enter="currentChange()" @clear="currentChange()" />
          </ElFormItem>
          <ElFormItem label="数据库类型">
            <el-select
              v-model="search.type"
              placeholder="请选择类型"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        <ElDropdown @command="handleMoreOperating($event)">
          <ElButton type="primary" size="default">
            <template #icon>
              <FaIcon name="i-ep:plus" />
            </template>
            新增
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem v-for="(item, i) in options" :key="item + i" :command="item.value">
                {{ item.label }}
              </ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </ElSpace>
      <ElTable v-loading="loading" class="my-4" :data="dataList" stripe highlight-current-row border height="100%" @sort-change="sortChange">
        <ElTableColumn prop="name" label="数据库别名" />
        <ElTableColumn label="供应商" width="100" align="center">
          <template #default="scope">
            <ElTag type="success">
              {{ scope.row.typeName }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="向量纬度" width="100" align="center">
          <template #default="scope">
            <ElTag type="danger">
              {{ scope.row.dimension }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="host" label="数据库地址" />
        <ElTableColumn prop="port" label="数据库端口" />
        <ElTableColumn prop="username" label="数据库用户名" />
        <ElTableColumn prop="password" label="数据库密码" />
        <ElTableColumn prop="databaseName" label="数据库名" />
        <ElTableColumn prop="tableName" label="表名称" />
        <ElTableColumn prop="dimension" label="向量纬度" />
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
    </FaPageMain>
    <FormMode v-if="formMode === 'dialog' || formMode === 'drawer'" :id="formModeProps.id" v-model="formModeProps.visible" :type="addType" :mode="formMode" @success="getDataList" />
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
