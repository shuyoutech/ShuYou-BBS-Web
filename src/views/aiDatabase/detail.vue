<script setup lang="ts">
import { toast } from 'vue-sonner'
import apiDatabase from '@/api/modules/database'
import apiModel from '@/api/modules/model'
import apiVector from '@/api/modules/vector'
import docManage from './components/docManage.vue'
import importData from './components/importData.vue'
import sliceManage from './components/sliceManage.vue'
import vectorSearch from './components/vectorSearch.vue'

const route = useRoute()
const form = ref({})
const components = [
  { label: '数据导入', value: 1 },
  { label: '文档管理', value: 2 },
  { label: '切片管理', value: 3 },
  { label: '向量搜索', value: 4 },
]
const activeTab = ref(1)
onMounted(() => {
  getInfo()
  getOptions()
})
const title = ref('')
const options = ref([])
const modelOptions = ref([])
const knowledgeId = ref(route.query.id ?? '')

function getInfo() {
  apiDatabase.detail({ id: knowledgeId.value }).then((res: any) => {
    form.value = res.data
    title.value = res.data.knowledgeName
  })
}
function getOptions() {
  // 向量库
  const params = {
    pageNum: '1',
    pageSize: '1000',
    sort: '',
    order: '',
    query: {
      type: '',
      name: '',
    },
  }
  apiVector.list(params).then((res: any) => {
    options.value = res.data.rows
  })
  // 向量模型
  const params1 = {
    pageNum: '1',
    pageSize: '1000',
    sort: '',
    order: '',
    query: {
      modelType: 'TE',
      modelName: '',
    },
  }
  apiModel.list(params1).then((res: any) => {
    modelOptions.value = res.data.rows
  })
}

function handleChange() {
  apiDatabase.editKnowledge(form.value).then((res: any) => {
    if (res.code === 0) {
      toast.success('更新成功')
    }
  })
}
</script>

<template>
  <div class="absolute size-full flex flex-col">
    <div class="relative flex flex-1 flex-col overflow-auto">
      <FaLayoutContainer hide-left-side-toggle class="static" left-side-class="h-full gap-4" default-class="flex-col-center p-0 size-full">
        <template #rightSide>
          <div class="mb-8px flex-center">
            <FaIcon name="i-ic:baseline-analytics" class="icon" />
            <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap pl-5px text-16px">
              {{ form.knowledgeName }}
            </div>
          </div>
          <ElTag type="info">
            通用知识库
          </ElTag>
          <div class="mt-10px text-12px c-[#667085]">
            {{ form.knowledgeDesc }}
          </div>
          <ElDivider />
          <div class="mb-3px mt-6px text-12px font-700">
            知识库ID
          </div>
          <div class="text-12px font-500">
            {{ form.id }}
          </div>
          <div class="mb-6px mt-20px flex-center justify-between">
            <div class="text-12px font-700">
              关联向量数据库
            </div>
            <!-- <div class="text-12px c-[#485264]">
              分块上限：800
            </div> -->
          </div>
          <div class="mb-20px">
            <ElSelect v-model="form.vectorStoreId" placeholder="请选择" @change="handleChange">
              <ElOption v-for="item in options" :key="item.id" :label="item.databaseName" :value="item.id" />
            </ElSelect>
          </div>
          <div class="mb-6px mt-6px text-12px font-700">
            关联向量化模型
          </div>
          <ElSelect v-model="form.embeddingModelId" placeholder="请选择" @change="handleChange">
            <ElOption v-for="item in modelOptions" :key="item.id" :label="item.modelName" :value="item.id" />
          </ElSelect>
          <!-- <ElDivider />
          <div class="mb-6px mt-20px flex-center justify-between">
            <div class="text-12px font-700">
              协作者
            </div>
            <div class="text-12px c-[#485264]">
              <FaIcon name="i-ic:sharp-settings" class="operate mr-5px cursor-pointer" />
              <FaIcon name="i-ic:baseline-group-add" class="operate cursor-pointer" />
            </div>
          </div> -->
        </template>
        <div class="h-full w-full p-20px pt-20px text-sm">
          <ElTabs v-model="activeTab">
            <ElTabPane v-for="(item, key) in components" :key="key" :label="item.label" :name="item.value" />
          </ElTabs>
          <div v-show="activeTab === 1">
            <import-data />
          </div>
          <div v-show="activeTab === 2" class="h-full w-full pt-10px">
            <doc-manage />
          </div>
          <div v-show="activeTab === 3" class="h-full w-full pt-10px">
            <slice-manage />
          </div>
          <div v-show="activeTab === 4" class="h-full w-full pt-10px">
            <vector-search />
          </div>
        </div>
      </FaLayoutContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-size: 35px;
  color: rgb(93 168 252);
}

.operate {
  font-size: 18px;
}
</style>
