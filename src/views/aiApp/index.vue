<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { toast } from 'vue-sonner'
import aiApp from '@/api/modules/aiApp'
import FormMode from './addFormMode/index.vue'

const { pagination, getParams, onSizeChange, onCurrentChange } = usePagination()
const router = useRouter()
// 表单模式
const formMode = ref<'router' | 'dialog' | 'drawer'>('dialog')
// 详情
const formModeProps = ref({
  visible: false,
  id: '',
})

onMounted(() => {
  getDataList()
})
const search = ref({
  name: '',
})
const dataList = ref([])
const loading = ref(false)
function getDataList() {
  loading.value = true
  const params = {
    ...getParams(),
    sort: '',
    order: '',
    query: {
      appName: search.value.name,
    },
  }
  aiApp.list(params).then((res: any) => {
    loading.value = false
    dataList.value = res.data.rows
    dataList.value.forEach((item: any) => {
      item.isHovered = false
      item.showDropdown = false
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

function handleDetail(row) {
  router.push({
    name: 'aiAppDetail',
    query: {
      id: row.id,
    },
  })
}

function handleClear() {
  search.value.name = ''
  currentChange()
}

function onCreate() {
  formModeProps.value.id = ''
  formModeProps.value.visible = true
}

function onEdit(row) {
  formModeProps.value.id = row.id
  formModeProps.value.visible = true
}

function onDel(row: any) {
  ElMessageBox.confirm(`确认删除「${row.appName}」吗？`, '确认信息').then(() => {
    aiApp.delete([row.id]).then(() => {
      getDataList()
      toast.success('删除成功')
    })
  }).catch(() => {})
}

function handleAction(action: string, row: any) {
  switch (action) {
    case 'edit':
      onEdit(row)
      break
    case 'delete':
      onDel(row)
      break
    default:
      router.push({
        name: 'aiAppChatDetail',
        query: {
          id: row.id,
        },
      })
      break
  }
}
</script>

<template>
  <div class="p-20px">
    <ElInput v-model="search.name" class="mr-20px w-200px" placeholder="搜索应用" clearable @clear="handleClear" />
    <ElButton type="primary" @click="currentChange()">
      <template #icon>
        <FaIcon name="i-ep:search" />
      </template>
      筛选
    </ElButton>
    <ElButton type="primary" size="default" @click="onCreate()">
      <template #icon>
        <FaIcon name="i-ep:plus" />
      </template>
      新建
    </ElButton>
    <ElRow v-show="dataList.length > 0" :gutter="20" class="mt-20px">
      <ElCol v-for="(item, i) in dataList" :key="item + i" :xl="8" :lg="12" :md="12" @mouseenter="item.isHovered = true" @mouseleave="item.isHovered = false">
        <div class="relative mb-20px h-[150px] cursor-pointer border border-1 border-[#dfe2ea] rounded-6px border-solid bg-white p-20px" @click="handleDetail(item)">
          <div class="center mb-5px mt-5px flex">
            <FaIcon :name="item.appIcon ? item.appIcon : 'i-ic:baseline-analytics'" class="icon" />
            <div class="ml-4px h-45px overflow-hidden text-ellipsis whitespace-nowrap leading-45px">
              {{ item.appName }}
            </div>
          </div>
          <div class="overflow-hidden text-ellipsis whitespace-nowrap pl-5px text-sm c-[#667085]">
            {{ item.appDesc }}
          </div>
          <div class="mt-20px flex items-start justify-between pl-5px text-sm c-[#667085]">
            <div class="flex items-start">
              <FaIcon name="i-ic:baseline-access-time" class="person" />
              <div class="ml-5px mr-10px whitespace-nowrap leading-16px">
                {{ item.createTime }}
              </div>
            </div>
            <div class="flex items-start">
              <FaIcon v-show="!item.isHovered" name="i-ic:baseline-cruelty-free" class="key" />
              <div v-show="!item.isHovered" class="ml-5px whitespace-nowrap leading-16px">
                {{ item.knowledge.embeddingModel.modelName }}
              </div>
              <div v-show="item.isHovered" class="mt-[-4px]" @mouseover="item.showDropdown = true">
                <FaIcon name="i-ic:baseline-more-horiz" size="20px" @click.stop />
              </div>
              <transition name="el-fade-in">
                <div
                  v-show="item.showDropdown"
                  class="dropdown-menu"
                  @mouseleave="item.showDropdown = false"
                  @click.stop
                >
                  <div class="dropdown-item" @click="handleAction('chat', item)">
                    去对话
                  </div>
                  <div class="dropdown-item" @click="handleAction('edit', item)">
                    编辑
                  </div>
                  <div class="dropdown-item" @click="handleAction('delete', item)">
                    删除
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <div class="absolute right-0 top-10px bg-[#f4f4f7] pb-1px pl-8px pr-8px pt-1px text-sm c-[#485264]">
            {{ item.appTypeName }}
          </div>
        </div>
      </ElCol>
    </ElRow>
    <ElPagination v-show="dataList.length > 0" :current-page="pagination.pageNum" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="pagination.sizes" :layout="pagination.layout" :hide-on-single-page="false" class="pagination" background @current-change="currentChange" @size-change="sizeChange" />
    <el-empty v-show="dataList.length === 0" description="没有数据" />
    <FormMode v-if="formMode === 'dialog' || formMode === 'drawer'" :id="formModeProps.id" v-model="formModeProps.visible" :mode="formMode" @success="getDataList" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-size: 45px;
  color: rgb(93 168 252);
}

.person {
  font-size: 16px;
  color: #1890ff;
}

.key {
  font-size: 16px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 60px;
  padding: 6px 0;
  margin: 5px 0;
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.dropdown-item {
  padding: 8px 16px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
}

.dropdown-item:hover {
  color: #409eff;
  background-color: #f5f7fa;
}
</style>
