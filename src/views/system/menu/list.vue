<route lang="yaml">
meta:
  enabled: false
</route>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import apiMenu from '@/api/modules/menu'

defineOptions({
  name: 'PagesExampleMenuList',
})

const router = useRouter()
const { getParams } = usePagination()
// 表格是否自适应高度
const tableAutoHeight = ref(false)

// 列表
const loading = ref(false)
const dataList = ref([])

onMounted(() => {
  getDataList()
})

// 搜索
const searchDefault = {
  menuName: '',
}
const search = ref({ ...searchDefault })
function searchReset() {
  Object.assign(search.value, searchDefault)
}

function getDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    menuName: search.value.menuName,
  }
  apiMenu.list(params).then((res: any) => {
    loading.value = false
    dataList.value = res.data
  })
}

function onCreate(row?: any) {
  router.push({
    name: 'pagesExampleGeneralMenuCreate',
    query: {
      parentId: row.value,
    },
  })
}

function onEdit(row: any) {
  router.push({
    name: 'pagesExampleGeneralMenuEdit',
    params: {
      id: row.value,
    },
  })
}

function onDel(row: any) {
  ElMessageBox.confirm(`确认删除「${row.label}」吗？`, '确认信息').then(() => {
    apiMenu.delete([row.value]).then(() => {
      getDataList()
      toast.success('删除成功')
    })
  }).catch(() => {})
}

function handleMoreOperating(command: string, row: any) {
  switch (command) {
    case 'edit':
      onEdit(row)
      break
    case 'delete':
      onDel(row)
      break
  }
}
</script>

<template>
  <div :class="{ 'absolute-container': tableAutoHeight }">
    <FaPageMain :class="{ 'flex-1 overflow-auto': tableAutoHeight }" :main-class="{ 'flex-1 flex flex-col overflow-auto': tableAutoHeight }">
      <FaSearchBar :show-toggle="false">
        <ElForm :model="search" size="default" label-width="100px" inline-message inline class="search-form">
          <ElFormItem label="菜单名称">
            <ElInput v-model="search.menuName" placeholder="请输入菜单名称" clearable @keydown.enter="getDataList()" @clear="currentChange()" />
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
      <ElSpace wrap>
        <ElButton type="primary" size="default" @click="onCreate">
          <template #icon>
            <FaIcon name="i-ep:plus" />
          </template>
          新增主导航
        </ElButton>
      </ElSpace>
      <ElTable v-loading="loading" class="mt-4" :data="dataList" row-key="value" stripe highlight-current-row default-expand-all border height="100%">
        <ElTableColumn prop="label" label="菜单名称" min-width="150" fixed="left" />
        <ElTableColumn label="路由" width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span :title="row.menu.menuPath">{{ row.menu.menuPath }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="类型" width="80" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.menu.menuType === 'M' ? '菜单' : '按钮' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="perms" min-width="100" label="权限标识">
          <template #default="{ row }">
            <span :title="row.menu.perms">{{ row.menu.perms }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="页面组件" width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <ElTag v-if="row.menu.component === 'Layout'">
              Layout
            </ElTag>
            <span v-else :title="row.menu.component">{{ row.menu.component }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="图标" width="90" align="center">
          <template #default="{ row }">
            <div style="display: flex; justify-content: center;">
              <FaIcon v-if="row.menu.icon" :name="row.menu.icon" class="size-6" />
              <span v-else>--</span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="状态" width="100" align="center">
          <template #default="scope">
            <!-- <ElSwitch v-model="scope.row.menu.status" active-value="1" inactive-value="0" inline-prompt active-text="启用" inactive-text="禁用" :before-change="() => onChangeStatus(scope.row)" /> -->
            <ElTag v-if="scope.row.menu.status === '1'" type="success">
              启用
            </ElTag>
            <ElTag v-else type="danger">
              禁用
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="操作" width="200" align="center" fixed="right">
          <template #default="scope">
            <ElSpace>
              <ElButton type="primary" size="small" plain @click="onCreate(scope.row)">
                新增导航
              </ElButton>
              <ElDropdown @command="handleMoreOperating($event, scope.row)">
                <ElButton size="small">
                  更多操作
                  <FaIcon name="i-ep:arrow-down" class="el-icon--right" />
                </ElButton>
                <template #dropdown>
                  <ElDropdownMenu>
                    <ElDropdownItem command="edit">
                      编辑
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
    </FaPageMain>
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
