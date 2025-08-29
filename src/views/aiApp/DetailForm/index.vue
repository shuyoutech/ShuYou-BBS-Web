<script setup lang="ts">
import apiApp from '@/api/modules/aiApp'
import apiDatabase from '@/api/modules/database'

export interface Props {
  id?: number | string
  existList?: any[]
}
// const props = withDefaults(
//   defineProps<Props>(),
//   {
//     id: '',
//   },
// )

const loading = ref(false)
const route = useRoute()

onMounted(() => {
  getKonwledgeList()
  initSelectList()
})
const dataList = ref([])
const selectList = ref([])
const appId = ref(route.query.id ?? '')
function getKonwledgeList() {
  const params = {
    pageNum: '1',
    pageSize: '1000',
    sort: '',
    order: '',
    query: {
      name: '',
    },
  }
  apiDatabase.list(params).then((res: any) => {
    loading.value = false
    dataList.value = res.data.rows
  })
}
function initSelectList() {
  apiApp.detail({ id: appId.value }).then((res: any) => {
    selectList.value = [{ ...res.data.knowledge }]
  })
}

function handleAdd(item: any) {
  const index = selectList.value.findIndex((i: any) => i.id === item.id)
  if (index === -1) {
    selectList.value.push(item)
  }
}
function handleDel(item: any) {
  const index = selectList.value.findIndex((i: any) => i.id === item.id)
  if (index !== -1) {
    selectList.value.splice(index, 1)
  }
}
defineExpose({
  submit() {
    return new Promise<void>((resolve) => {
      resolve(JSON.stringify(selectList.value))
    })
  },
})
</script>

<template>
  <div v-loading="loading">
    <ElRow :gutter="12">
      <ElCol v-for="(item, i) in selectList" :key="item + i" :xl="8" :lg="12" :md="24">
        <div class="center relative h-64px flex border border-1 border-[#dfe2ea] rounded-6px border-solid bg-[#c5d7ff] p-12px" @click="handleDel(item)">
          <FaIcon name="i-ic:baseline-analytics" class="icon" />
          <div class="ml-4px h-40px overflow-hidden text-ellipsis whitespace-nowrap text-16px color-[#111824] leading-40px">
            {{ item.knowledgeName }}
          </div>
          <div class="absolute right-12px top-20px cursor-pointer">
            <FaIcon name="i-ic:twotone-delete" size="24px" />
          </div>
        </div>
      </ElCol>
    </ElRow>
    <ElDivider v-show="selectList.length > 0" />
    <div>
      <ElRow :gutter="12">
        <ElCol v-for="(item, i) in dataList" :key="item + i" :xl="8" :lg="12" :md="24">
          <div class="item-box mb-12px h-80px w-full cursor-pointer border border-1 border-[#dfe2ea] rounded-6px border-solid bg-white p-12px" @click="handleAdd(item)">
            <div class="center flex">
              <FaIcon name="i-ic:baseline-analytics" class="icon" />
              <div class="ml-4px h-40px overflow-hidden text-ellipsis whitespace-nowrap text-16px leading-40px">
                {{ item.knowledgeName }}
              </div>
            </div>
            <div class="mb-12px flex justify-end">
              <div class="flex items-center">
                <FaIcon name="i-ic:baseline-cruelty-free" class="key" />
                <div class="ml-5px leading-16px">
                  {{ item.embeddingModel.modelName }}
                </div>
              </div>
            </div>
          </div>
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  font-size: 40px;
  color: rgb(93 168 252);
}

.item-box {
  &:hover {
    border-color: rgb(24 125 241);
  }
}
</style>
