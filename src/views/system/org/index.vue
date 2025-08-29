<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import apiOrg from '@/api/modules/org'
import FormMode from './FormMode/index.vue'

defineOptions({
  name: 'PagesOrgList',
})

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
  orgName: '',
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
    orgName: search.value.orgName,
  }
  apiOrg.tree(params).then((res: any) => {
    loading.value = false
    dataList.value = res.data
  })
}

function onCreate() {
  formModeProps.value.id = ''
  formModeProps.value.visible = true
}

function onEdit(row) {
  formModeProps.value.id = row.value
  formModeProps.value.visible = true
}

function onDel(row: any) {
  ElMessageBox.confirm(`确认删除「${row.label}」吗？`, '确认信息').then(() => {
    apiOrg.delete([row.value]).then(() => {
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
          <ElFormItem label="机构名称">
            <ElInput v-model="search.orgName" placeholder="请输入机构名称" clearable @keydown.enter="getDataList()" @clear="getDataList()" />
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
          新增
        </ElButton>
      </ElSpace>
      <ElTable v-loading="loading" class="my-4" :data="dataList" row-key="value" stripe highlight-current-row default-expand-all border height="100%">
        <ElTableColumn prop="label" label="机构名称" />
        <ElTableColumn prop="noticeType" label="机构类型">
          <template #default="scope">
            {{ scope.row.org.orgTypeName }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="noticeType" label="机构排序">
          <template #default="scope">
            {{ scope.row.org.orgSort }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="noticeType" label="状态" width="80">
          <template #default="scope">
            <ElTag v-if="scope.row.org.status === '1'" type="success" size="small">
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
              <ElButton type="danger" size="small" plain @click="onDel(scope.row)">
                删除
              </ElButton>
            </ElSpace>
          </template>
        </ElTableColumn>
      </ElTable>
    </FaPageMain>
    <FormMode v-if="formMode === 'dialog' || formMode === 'drawer'" :id="formModeProps.id" v-model="formModeProps.visible" :mode="formMode" type="dictList" @success="getDataList" />
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
