<script setup lang="ts">
import { toast } from 'vue-sonner'
import apiApp from '@/api/modules/aiApp'
import apiModel from '@/api/modules/model'
import ChatItem from './chat.vue'
import FormMode from './FormMode/index.vue'

const route = useRoute()
const title = ref('')

const formModeProps = ref({
  visible: false,
  id: '',
})
const components = [
  { label: '应用配置', value: 1 },
  { label: '发布渠道', value: 2 },
  { label: '对话日志', value: 3 },
]
const activeTab = ref(1)
const activeNames = ref(['1', '2'])
const search = ref({
  model: '',
  promptText: '',
})
const form = ref({})
const appId = ref(route.query.id ?? '')
onMounted(() => {
  getInfo()
  getOptions()
})
const knowledgeList = ref([])
const knowledgeId = ref('')
const options = ref([])
function getOptions() {
  const params = {
    pageSize: '1000',
    pageNum: '1',
    query: {
      modelType: 'TG',
      modelName: '',
    },
  }
  apiModel.list(params).then((res: any) => {
    options.value = res.data.rows
  })
}
function getInfo() {
  apiApp.detail({ id: appId.value }).then((res: any) => {
    form.value = res.data
    title.value = res.data.appName
    search.value.model = res.data.chatModel.id
    search.value.promptText = res.data.promptText
    knowledgeList.value = [{ ...res.data.knowledge }]
    knowledgeId.value = res.data.knowledge.id
  })
}
function addKnowledge() {
  formModeProps.value.id = ''
  formModeProps.value.visible = true
}
function handleSuccess(res: any) {
  knowledgeList.value = JSON.parse(res)
  knowledgeId.value = knowledgeList.value[0].id
}
function handleDel(row: any) {
  const index = knowledgeList.value.findIndex((item: any) => item.id === row.id)
  if (index > -1) {
    knowledgeList.value.splice(index, 1)
  }
}
function onSubmit() {
  const params = JSON.parse(JSON.stringify(form.value))
  params.promptText = search.value.promptText
  params.knowledge = knowledgeList.value[0]
  const index = options.value.findIndex((ele) => {
    return ele.id === search.value.model
  })
  if (index > -1) {
    params.chatModel = options.value[index]
  }
  apiApp.edit({ ...params }).then(() => {
    toast.success('保存成功')
  })
}
</script>

<template>
  <div class="absolute size-full flex flex-col">
    <FaPageHeader :title="title" class="mb-0">
      <div class="pr-30px">
        <ElTabs v-model="activeTab">
          <ElTabPane v-for="(item, key) in components" :key="key" :label="item.label" :name="item.value" />
        </ElTabs>
      </div>
    </FaPageHeader>
    <div class="relative flex flex-1 flex-col overflow-auto">
      <FaLayoutContainer hide-left-side-toggle class="static" left-side-class="h-full gap-4" default-class="flex-col-center p-0 size-full">
        <template #leftSide>
          <el-collapse v-model="activeNames" expand-icon-position="left">
            <el-collapse-item title="基础配置" name="1">
              <ElRow>
                <ElCol :span="6">
                  <div class="h-32px leading-32px">
                    对话模型：
                  </div>
                </ElCol>
                <ElCol :span="18">
                  <ElSelect v-model="search.model" placeholder="请选择" clearable>
                    <ElOption v-for="item in options" :key="item.id" :label="item.modelAlias" :value="item.id" />
                  </ElSelect>
                </ElCol>
              </ElRow>
              <ElRow>
                <ElCol :span="24">
                  <div class="h-32px leading-32px">
                    提示词：
                  </div>
                </ElCol>
                <ElCol :span="24">
                  <ElInput v-model="search.promptText" type="textarea" :rows="4" resize="none" placeholder="请输入提示词" />
                </ElCol>
              </ElRow>
            </el-collapse-item>
            <el-collapse-item title="知识库" name="2" class="relative">
              <div class="absolute right-10px top-15px mb-20px flex-center" @click="addKnowledge()">
                <FaIcon name="i-ic:baseline-add-circle-outline" class="icon" />
              </div>
              <div v-for="(item, i) in knowledgeList" :key="(item + i)" class="mt-8px flex-center justify-between">
                <div class="flex-center-start">
                  <FaIcon name="i-ic:baseline-file-copy" size="24px" color="#1890ff" />
                  <div class="ml-4px">
                    {{ item.knowledgeName }}
                  </div>
                </div>
                <div class="cursor-pointer" @click="handleDel(item)">
                  <FaIcon name="i-ic:baseline-delete-outline" size="18px" />
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <ElButton class="mt-10px" @click="onSubmit">
            保存
          </ElButton>
        </template>
        <div class="relative h-full w-full p-20px pt-40px text-sm">
          <div class="absolute top-10px text-lg font-bold">
            调试预览
          </div>
          <ChatItem :model="search.model" :prompt-text="search.promptText" :knowledge-id="knowledgeId" />
        </div>
      </FaLayoutContainer>
    </div>
    <FormMode :id="formModeProps.id" v-model="formModeProps.visible" mode="dialog" @success="handleSuccess" />
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-size: 18px;
  color: rgb(93 168 252);
  cursor: pointer;
}

.operate {
  font-size: 18px;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #fff;
}
</style>
