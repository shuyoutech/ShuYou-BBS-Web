<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import apiApp from '@/api/modules/aiApp'
import chatItem from './chatComponent/index.vue'

const route = useRoute()
const appId = ref(route.query.id ?? '')
const form = ref({})
onMounted(() => {
  getInfo()
  getChatList()
})
function getInfo() {
  apiApp.detail({ id: appId.value }).then((res: any) => {
    form.value = res.data
  })
}
const chatList = ref([])
function getChatList() {
  const params = {
    pageNum: '1',
    pageSize: '1000',
    sort: 'createTime',
    order: 'desc',
    query: {
      appId: appId.value,
      source: '',
      title: '',
      startDate: '',
      endDate: '',
    },
  }
  apiApp.chatList(params).then((res: any) => {
    chatList.value = res.data.rows
    chatList.value.forEach((item: any) => {
      item.isHovered = false
      item.showDropdown = false
    })
  })
}
function clearRecord() {
  ElMessageBox.confirm(`确认清空该应用的在线聊天记录？分享和API调用的记录不会被清空`, '确认信息').then(() => {
    chatList.value = []
  }).catch(() => {})
}

const currentSelect = ref('')
function handleClick(item) {
  currentSelect.value = item.id
}

function handleNew() {
  currentSelect.value = '0'
  chatList.value.unshift({
    appId: appId.value,
    conversationId: '',
    title: '新对话',
    createTime: '刚刚',
    id: '0',
  })
}
</script>

<template>
  <div class="absolute size-full flex flex-col">
    <div class="relative flex flex-1 flex-col overflow-auto">
      <FaLayoutContainer hide-left-side-toggle class="static" left-side-class="h-full gap-4" default-class="flex-col-center p-0 size-full">
        <template #leftSide>
          <div class="mb-20px flex">
            <FaIcon :name="form.appIcon ? form.appIcon : 'i-ic:baseline-analytics'" size="45px" color="blue" />
            <ElTooltip :content="form.appName" placement="top">
              <div class="ml-4px h-45px overflow-hidden text-ellipsis whitespace-nowrap leading-45px">
                {{ form.appName }}
              </div>
            </ElTooltip>
          </div>
          <div class="mb-20px flex">
            <ElButton size="default" round plain class="w-80% color-[#3370ff]" @click="handleNew()">
              <template #icon>
                <FaIcon name="i-solar:chat-dots-line-duotone" color="#3370ff" />
              </template>
              新对话
            </ElButton>
            <ElButton size="default" round plain class="w-20%" @click="clearRecord()">
              <template #icon>
                <FaIcon name="i-solar:broom-broken" size="14px" />
              </template>
            </ElButton>
          </div>
          <div v-for="(item, i) in chatList" :key="item.id + i" :style="{ background: currentSelect === item.id ? '#f0f4ff' : '#fff' }" class="mb-8px list-item h-44px flex cursor-pointer rounded-6px pl-16px pr-16px text-sm color-[#485264]" @click="handleClick(item)">
            <div class="w-100% pt-7px">
              <div class="flex">
                <FaIcon name="i-solar:chat-dots-line-duotone" color="#3370ff" class="mr-5px mt-1px" />
                <div class="h-16px overflow-hidden text-ellipsis whitespace-nowrap leading-16px">
                  {{ item.title }}
                </div>
              </div>
              <div class="pl-20px text-12px color-[#0000005c]">
                {{ item.createTime }}
              </div>
            </div>
          </div>
        </template>
        <div class="h-full w-full p-20px pt-40px text-sm">
          <chat-item :conversation-id="currentSelect" @update-list="getChatList()" />
        </div>
      </FaLayoutContainer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .list-item {
    &:hover {
      background-color: #f0f4ff;
    }
  }
</style>
