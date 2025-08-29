<script setup lang="ts">
import { toast } from 'vue-sonner'
import apiMenu from '@/api/modules/menu'
import apiRole from '@/api/modules/role'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const treeRef = ref()
interface Tree {
  label: string
  children?: Tree[]
}
const defaultProps = {
  children: 'children',
  label: 'label',
}
const data: Tree[] = ref([])

onMounted(() => {
  getTree()
  getDetail()
})

function getTree() {
  apiMenu.list({ menuName: '' }).then((res: any) => {
    data.value = res.data
  })
}

const selectNode = ref([])
function getDetail() {
  apiRole.detail(route.query.id).then((res: any) => {
    if (res.code === 0) {
      selectNode.value = res.data.menuIds
    }
  })
}
// 全选
function selectAll() {
  // 获取所有节点
  const allNodes = treeRef.value.store._getAllNodes()
  // 设置所有节点为选中状态
  treeRef.value.setCheckedNodes(allNodes.map(node => node.data))
}

// 取消全选
function clearAll() {
  treeRef.value.setCheckedKeys([])
}

function handleSave() {
  // 如果需要包括半选状态的父节点的key
  const selectedKeysWithHalfChecked = treeRef.value.getCheckedKeys()
  if (selectedKeysWithHalfChecked.length === 0) {
    toast.error('请选择需要授权的菜单')
    return
  }
  const param = {
    menuIds: selectedKeysWithHalfChecked,
    roleId: route.query.id,
  }
  apiRole.roleBindMenu(param).then((res: any) => {
    if (res.code === 0) {
      toast.success('保存成功')
    }
  })
}

function cancel() {
  router.go(-1)
}
</script>

<template>
  <div v-loading="loading">
    <FaPageMain>
      <div class="mb-20px">
        <ElButton type="primary" @click="selectAll">
          全选
        </ElButton>
        <ElButton @click="clearAll">
          取消全选
        </ElButton>
      </div>
      <el-tree
        ref="treeRef"
        :data="data"
        :props="defaultProps"
        :default-checked-keys="selectNode"
        node-key="value"

        show-checkbox default-expand-all
      />
      <div class="mt-20px">
        <ElButton @click="cancel">
          取消
        </ElButton>
        <ElButton type="primary" @click="handleSave">
          保存
        </ElButton>
      </div>
    </FaPageMain>
  </div>
</template>
