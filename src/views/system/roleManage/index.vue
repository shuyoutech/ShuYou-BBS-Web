<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import apiRole from '@/api/modules/role'
import AuthMode from './auth/FormMode/index.vue'
import FormMode from './FormMode/index.vue'

defineOptions({
  name: 'PagesRoleList',
})

const { pagination, getParams, onSizeChange, onCurrentChange, onSortChange } = usePagination()
const router = useRouter()
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
const authFormModeProps = ref({
  visible: false,
  id: '',
})
// 搜索
const searchDefault = {
  roleCode: '',
  roleName: '',
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
    sort: 'roleSort',
    order: 'asc',
    query: {
      roleCode: search.value.roleCode,
      roleName: search.value.roleName,
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

function onCreate() {
  formModeProps.value.id = ''
  formModeProps.value.visible = true
}

function onChangeStatus(row: any) {
  return new Promise<boolean>((resolve) => {
    ElMessageBox.confirm(`确认${row.status === '1' ? '禁用' : '启用'}「${row.roleName}」吗？`, '确认信息').then(() => {
      row.statusLoading = true
      apiRole.changeStatus({
        id: row.id,
        status: row.status === '1' ? '0' : '1',
      }).then(() => {
        row.statusLoading = false
        toast.success(`${row.roleName}角色${row.status === '1' ? '禁用' : '启用'}成功`)
        return resolve(true)
      }).catch(() => {
        row.statusLoading = false
        return resolve(false)
      })
    }).catch(() => {
      return resolve(false)
    })
  })
}

function onEdit(row: any) {
  formModeProps.value.id = row.id
  formModeProps.value.visible = true
}

function onDel(row: any) {
  ElMessageBox.confirm(`确认删除「${row.roleName}」吗？`, '确认信息').then(() => {
    apiRole.delete([row.id]).then(() => {
      getDataList()
      toast.success('删除成功')
    })
  }).catch(() => {})
}

function handleMoreOperating(command: string, row: any) {
  switch (command) {
    case 'user':
      authFormModeProps.value.id = row.id
      authFormModeProps.value.visible = true
      break
    case 'delete':
      onDel(row)
      break
    case 'menu':
      router.push({
        name: 'pagesRoleAuthMenu',
        query: {
          id: row.id,
        },
      })
      break
  }
}
</script>

<template>
  <div :class="{ 'absolute-container': tableAutoHeight }">
    <FaPageMain :class="{ 'flex-1 overflow-auto': tableAutoHeight }" :main-class="{ 'flex-1 flex flex-col overflow-auto': tableAutoHeight }">
      <FaSearchBar :show-toggle="false">
        <ElForm :model="search" size="default" label-width="100px" inline-message inline class="search-form">
          <ElFormItem label="角色名称">
            <ElInput v-model="search.roleName" placeholder="请输入角色名称" clearable @keydown.enter="currentChange()" @clear="currentChange()" />
          </ElFormItem>
          <ElFormItem label="权限字符">
            <ElInput v-model="search.roleCode" placeholder="请输入权限字符" clearable @keydown.enter="currentChange()" @clear="currentChange()" />
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
            <FaIcon name="i-ep:plus" />
          </template>
          新增
        </ElButton>
      </ElSpace>
      <ElTable v-loading="loading" class="my-4" :data="dataList" stripe highlight-current-row border height="100%" @sort-change="sortChange">
        <ElTableColumn prop="roleName" sortable label="角色名称" />
        <ElTableColumn prop="roleCode" label="权限字符" />
        <ElTableColumn prop="roleSort" label="显示顺序" />
        <ElTableColumn label="状态" width="100" align="center">
          <template #default="scope">
            <ElSwitch v-model="scope.row.status" active-value="1" inactive-value="0" :loading="scope.row.statusLoading" inline-prompt active-text="启用" inactive-text="禁用" :before-change="() => onChangeStatus(scope.row)" />
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createTime" label="创建时间" />
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
                    <ElDropdownItem command="user">
                      分配用户
                    </ElDropdownItem>
                    <ElDropdownItem command="menu">
                      菜单授权
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
