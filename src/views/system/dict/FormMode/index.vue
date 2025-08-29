<script setup lang="ts">
import type { Props } from '../DetailForm/index.vue'
import DetailForm from '../DetailForm/index.vue'
import DictDataForm from '../DictDataForm/index.vue'

const props = defineProps<{
  mode: 'dialog' | 'drawer'
  type: 'dictList' | 'dictDataList'
} & Props>()

const emits = defineEmits<{
  success: []
}>()

const visible = defineModel<boolean>({
  default: false,
})

const formRef = useTemplateRef('formRef')

const title = computed(() => props.id === '' ? (props.type === 'dictList' ? '新增字典' : '添加字典数据') : (props.type === 'dictList' ? '编辑字典' : '编辑字典数据'))

function onSubmit() {
  // submit() 为组件内部方法
  formRef.value?.submit().then(() => {
    emits('success')
    onCancel()
  })
}

function onCancel() {
  visible.value = false
}
</script>

<template>
  <div>
    <ElDialog v-if="props.mode === 'dialog'" v-model="visible" :title="title" width="400px" :close-on-click-modal="false" append-to-body destroy-on-close>
      <DetailForm v-if="props.type === 'dictList'" ref="formRef" v-bind="$props" />
      <DictDataForm v-else ref="formRef" v-bind="$props" />
      <template #footer>
        <ElButton size="large" @click="onCancel">
          取 消
        </ElButton>
        <ElButton type="primary" size="large" @click="onSubmit">
          确 定
        </ElButton>
      </template>
    </ElDialog>
    <ElDrawer v-else-if="props.mode === 'drawer'" v-model="visible" :title="title" size="400px" :close-on-click-modal="false" destroy-on-close>
      <DetailForm v-if="props.type === 'dictList'" ref="formRef" v-bind="$props" />
      <DictDataForm v-else ref="formRef" v-bind="$props" />
      <div class="buttons">
        <ElButton size="large" @click="onCancel">
          取 消
        </ElButton>
        <ElButton type="primary" size="large" @click="onSubmit">
          确 定
        </ElButton>
      </div>
    </ElDrawer>
  </div>
</template>
