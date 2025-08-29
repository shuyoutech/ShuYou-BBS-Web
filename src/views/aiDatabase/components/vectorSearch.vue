<script setup lang="ts">
import { toast } from 'vue-sonner'
import apiDatabase from '@/api/modules/database'

const route = useRoute()
const knowledgeId = ref(route.query.id ?? '')
const search = ref({
  knowledgeId: knowledgeId.value,
  text: '',
})
const dataList = ref([])
function onSubmit() {
  if (search.value.text === '') {
    toast.error('请输入关键词查询向量文本')
    return false
  }
  apiDatabase.search(search.value).then((res: any) => {
    toast.success('搜索成功')
    dataList.value = res.data
  })
}
function clear() {
  search.value.text = ''
  dataList.value = []
}
</script>

<template>
  <div>
    <ElInput v-model="search.text" type="textarea" rows="5" placeholder="请输入关键词查询向量文本" />
    <div class="mt-10px flex justify-end">
      <ElButton plain @click="clear">
        清空
      </ElButton>
      <ElButton type="primary" plain @click="onSubmit">
        向量搜索
      </ElButton>
    </div>
    <ElTable class="my-4" :data="dataList" stripe highlight-current-row border height="100%">
      <ElTableColumn prop="text" label="文本内容" />
      <ElTableColumn prop="score" label="匹配度" />
    </ElTable>
  </div>
</template>
