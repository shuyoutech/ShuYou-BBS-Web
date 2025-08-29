<script setup lang="ts">
import { toast } from 'vue-sonner'
import apiRole from '@/api/modules/role'
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
// 批量操作
const batch = ref({
  enable: true,
  selectionDataList: [],
})
onMounted(() => {
  getDataList()
})
const { pagination, getParams, onSizeChange, onCurrentChange, onSortChange } = usePagination()

const dataList = ref([])
function getDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    sort: 'roleSort',
    order: 'asc',
    query: {
      roleCode: '',
      roleName: '',
    },
  }
  apiRole.list(params).then((res: any) => {
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

defineExpose({
  submit() {
    return new Promise<void>((resolve) => {
      if (batch.value.selectionDataList.length === 0) {
        toast.error('请选择角色')
        return
      }
      const param = {
        roleIds: batch.value.selectionDataList.map((item: any) => item.id),
        userId: props.id,
      }
      apiManager.auth(param).then(() => {
        toast.success('授权成功')
        resolve()
      })
    })
  },
})
</script>

<template>
  <div v-loading="loading">
    <ElTable v-loading="loading" class="my-4" :data="dataList" stripe highlight-current-row border height="100%" @sort-change="sortChange" @selection-change="batch.selectionDataList = $event">
      <ElTableColumn v-if="batch.enable" type="selection" align="center" fixed />
      <ElTableColumn prop="roleName" sortable label="角色名称" />
      <ElTableColumn prop="roleCode" label="权限字符" />
      <ElTableColumn prop="roleSort" label="显示顺序" />
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
      <ElTableColumn prop="createTime" label="创建时间" />
    </ElTable>
    <ElPagination :current-page="pagination.pageNum" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="pagination.sizes" :layout="pagination.layout" :hide-on-single-page="false" class="pagination" background @current-change="currentChange" @size-change="sizeChange" />
  </div>
</template>
