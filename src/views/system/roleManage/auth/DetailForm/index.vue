<script setup lang="ts">
import { toast } from 'vue-sonner'
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
// 批量操作
const batch = ref({
  enable: true,
  selectionDataList: [],
})
onMounted(() => {
  getDataList()
})
const { pagination, getParams, onSizeChange, onCurrentChange, onSortChange } = usePagination()

const activeTab = ref('1')
const components = [
  { label: '未授权', value: '1' },
  { label: '已授权', value: '2' },
]
const dataList = ref([])
const search = ref({
  username: '',
})
function getDataList() {
  if (activeTab.value === '1') {
    getUnAuthDataList()
  }
  else {
    getAuthDataList()
  }
}
function getAuthDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    sort: 'createTime',
    order: 'desc',
    query: {
      username: search.value.username,
      roleId: props.id,
    },
  }
  apiRole.getAuthUserList(params).then((res: any) => {
    loading.value = false
    dataList.value = res.data.rows
    pagination.value.total = Number(res.data.total | 0)
  })
}
function getUnAuthDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    sort: 'createTime',
    order: 'desc',
    query: {
      username: search.value.username,
      neRoleId: props.id,
    },
  }
  apiRole.getUnAuthUserList(params).then((res: any) => {
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

function handleTab() {
  search.value.username = ''
  getDataList()
}
defineExpose({
  submit() {
    return new Promise<void>((resolve) => {
      if (batch.value.selectionDataList.length === 0) {
        if (activeTab.value === '1') {
          toast.error('请选择需要授权的用户')
        }
        else {
          toast.error('请选择需要取消授权的用户')
        }
        return
      }
      const param = {
        userIds: batch.value.selectionDataList.map((item: any) => item.id),
        roleId: props.id,
      }
      if (activeTab.value === '1') {
        apiRole.batchAuth(param).then(() => {
          toast.success('授权成功')
          resolve()
        })
      }
      else {
        apiRole.cancelBatchAuth(param).then(() => {
          toast.success('取消授权成功')
          resolve()
        })
      }
    })
  },
})
</script>

<template>
  <div>
    <div>
      <ElTabs v-model="activeTab" @tab-change="handleTab">
        <ElTabPane v-for="(item, key) in components" :key="key" :label="item.label" :name="item.value" />
      </ElTabs>
    </div>
    <div class="w-35%">
      <ElInput v-model="search.username" placeholder="请输入用户名" clearable @keydown.enter="currentChange()" @clear="currentChange()" />
    </div>
    <ElTable v-loading="loading" class="my-4" :data="dataList" stripe highlight-current-row border height="100%" @sort-change="sortChange" @selection-change="batch.selectionDataList = $event">
      <ElTableColumn v-if="batch.enable" type="selection" align="center" fixed />
      <ElTableColumn prop="username" sortable label="用户名称" />
      <ElTableColumn prop="realName" label="真实姓名" />
      <ElTableColumn label="已分配角色">
        <template #default="scope">
          {{ scope.row.roleNames.toString() }}
        </template>
      </ElTableColumn>
    </ElTable>
    <ElPagination :current-page="pagination.pageNum" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="pagination.sizes" :layout="pagination.layout" :hide-on-single-page="false" class="pagination" background @current-change="currentChange" @size-change="sizeChange" />
  </div>
</template>
