<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import apiDatabase from '@/api/modules/database'

const { pagination, getParams, onSizeChange, onCurrentChange } = usePagination()
const loading = ref(false)
const route = useRoute()
onMounted(() => {
  getDataList()
})
const dataList = ref([])
const knowledgeId = ref(route.query.id ?? '')
// 搜索
const searchDefault = {
  docName: '',
}
const search = ref({ ...searchDefault })
function searchReset() {
  Object.assign(search.value, searchDefault)
}
function getDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    sort: '',
    order: '',
    query: {
      knowledgeId: knowledgeId.value,
      docName: search.value.docName,
    },
  }
  apiDatabase.knowledgeDocList(params).then((res: any) => {
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
  ElMessageBox.confirm(`确认删除「${row.docName}」吗？`, '确认信息').then(() => {
    apiDatabase.deleteDoc([row.id]).then(() => {
      getDataList()
      toast.success('删除成功')
    })
  }).catch(() => {})
}
// function handleMoreOperating(command: string, row: any) {
//   switch (command) {
//     case 'edit':
//       row.id = '123'
//       break
//     case 'delete':
//       break
//   }
// }
</script>

<template>
  <div>
    <FaSearchBar :show-toggle="false">
      <ElForm :model="search" size="default" label-width="100px" inline-message inline class="search-form">
        <ElFormItem label="文件名称">
          <ElInput v-model="search.docName" placeholder="请输入名称" @keydown.enter="getDataList()" @clear="getDataList()" />
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
    <div>
      <ElTable class="my-4" :data="dataList" stripe highlight-current-row border height="100%" @sort-change="sortChange">
        <ElTableColumn prop="docName" label="文档名称" />
        <ElTableColumn prop="sliceNum" label="分块存储">
          <span>分块存储</span>
        </ElTableColumn>
        <ElTableColumn prop="sliceNum" label="切片数量" />
        <ElTableColumn prop="createTime" label="创建时间" />
        <ElTableColumn prop="sliceStatus" label="状态">
          <template #default="scope">
            <span v-if="scope.row.sliceStatus">已就绪</span>
            <span v-else>进行中</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <ElSpace>
              <ElButton type="danger" size="small" plain @click="onDel(scope.row)">
                删除
              </ElButton>
              <!-- <ElDropdown @command="handleMoreOperating($event, scope.row)">
                <ElButton size="small">
                  更多操作
                  <FaIcon name="i-ep:arrow-down" class="el-icon--right" />
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="edit">
                      重命名
                    </ElDropdownItem>
                    <ElDropdownItem command="delete" divided>
                      删除
                    </ElDropdownItem>
                  </ElDropdownMenu>
                </template>
              </ElDropdown> -->
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
      <ElPagination :current-page="pagination.pageNum" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="pagination.sizes" :layout="pagination.layout" :hide-on-single-page="false" class="pagination" background @current-change="currentChange" @size-change="sizeChange" />
    </div>
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
