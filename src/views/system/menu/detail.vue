<route lang="yaml">
meta:
  enabled: false
</route>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { toast } from 'vue-sonner'
import apiMenu from '@/api/modules/menu'

defineOptions({
  name: 'PagesExampleMenuDetail',
})

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')
const form = ref({
  id: route.params.id as string ?? '',
  parentId: route.query.parentId ?? '0',
  component: '',
  menuType: 'M',
  menuName: '',
  menuPath: '',
  menuSort: 1,
  menuDesc: '',
  perms: '',
  icon: '',
  beenExt: false,
  beenKeepalive: false,
  beenVisible: true,
  status: '1',
})
const formRules = ref<FormRules>({
  'path': [
    { required: true, message: '请输入路由地址', trigger: 'blur' },
  ],
  'meta.title': [
    { required: true, message: '请输入显示名称', trigger: 'blur' },
  ],
})

onMounted(() => {
  if (form.value.id !== '') {
    getInfo()
  }
})

function getInfo() {
  loading.value = true
  apiMenu.detail({ id: form.value.id }).then((res: any) => {
    loading.value = false
    const keys = Object.keys(form.value)
    keys.map((key) => {
      if (res.data[key] !== undefined) {
        form.value[key] = res.data[key]
      }
      return res.data[key]
    })
  })
}

function onSubmit() {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (form.value.id === '') {
        apiMenu.create(form.value).then(() => {
          toast.success('新增菜单成功')
          onCancel()
        })
      }
      else {
        apiMenu.edit(form.value).then(() => {
          toast.success('编辑菜单成功')
          onCancel()
        })
      }
    }
  })
}

function onCancel() {
  router.close({ name: 'menuIndex' })
}
</script>

<template>
  <div class="absolute size-full flex flex-col">
    <FaPageHeader :title="route.name === 'pagesExampleGeneralMenuCreate' ? '新增导航' : '编辑导航'" class="mb-0">
      <ElButton size="default" round @click="onCancel">
        <template #icon>
          <FaIcon name="i-ep:arrow-left" />
        </template>
        返回
      </ElButton>
    </FaPageHeader>
    <ElForm ref="formRef" v-loading="loading" :model="form" :rules="formRules" label-position="top">
      <FaLayoutContainer hide-right-side-toggle class="static" right-side-class="flex flex-col">
        <ElRow :gutter="30" style="padding: 20px;">
          <ElCol :xl="12" :lg="24">
            <ElFormItem label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio value="M">
                  菜单
                </el-radio>
                <el-radio value="B" :disabled="form.parentId === '0'">
                  按钮
                </el-radio>
              </el-radio-group>
            </ElFormItem>
          </ElCol>
          <ElCol :xl="12" :lg="24">
            <ElFormItem label="菜单名称" prop="menuName">
              <ElInput v-model="form.menuName" clearable placeholder="请输入显示名称" />
            </ElFormItem>
          </ElCol>
          <ElCol v-show="form.menuType === 'M'" :xl="12" :lg="24">
            <ElFormItem label="图标" prop="icon">
              <FaIconPicker v-model="form.icon" />
            </ElFormItem>
          </ElCol>
          <ElCol :xl="12" :lg="24">
            <ElFormItem label="显示排序" prop="menuSort">
              <el-input-number
                v-model="form.menuSort"
                :min="1"
                :max="1000"
                controls-position="right"
              />
            </ElFormItem>
          </ElCol>
          <ElCol v-show="form.menuType === 'M'" :xl="12" :lg="24">
            <ElFormItem label="是否外链" prop="beenExt">
              <el-radio-group v-model="form.beenExt">
                <el-radio :value="true">
                  是
                </el-radio>
                <el-radio :value="false">
                  否
                </el-radio>
              </el-radio-group>
            </ElFormItem>
          </ElCol>
          <ElCol v-show="form.menuType === 'M'" :xl="12" :lg="24">
            <ElFormItem prop="beenKeepalive">
              <template #label>
                是否缓存
                <ElTooltip content="选择是则会被`keep-alive`缓存" placement="top">
                  <FaIcon name="i-ri:question-line" />
                </ElTooltip>
              </template>
              <el-radio-group v-model="form.beenKeepalive">
                <el-radio :value="true">
                  是
                </el-radio>
                <el-radio :value="false">
                  否
                </el-radio>
              </el-radio-group>
            </ElFormItem>
          </ElCol>
          <ElCol v-show="form.menuType === 'M'" :xl="12" :lg="24">
            <ElFormItem prop="menuPath">
              <template #label>
                路由地址
                <ElTooltip content="访问的路由地址，如‘/user’" placement="top">
                  <FaIcon name="i-ri:question-line" />
                </ElTooltip>
              </template>
              <ElInput v-model="form.menuPath" clearable placeholder="请输入路由地址" />
            </ElFormItem>
          </ElCol>
          <ElCol v-show="form.menuType === 'M'" :xl="12" :lg="24">
            <ElFormItem prop="component">
              <template #label>
                组件路径
                <ElTooltip content="访问组件的路径，如‘system/user/index，默认在views目录下’" placement="top">
                  <FaIcon name="i-ri:question-line" />
                </ElTooltip>
              </template>
              <ElInput v-model="form.component" clearable placeholder="请输入组件路径" />
            </ElFormItem>
          </ElCol>
          <ElCol v-show="form.menuType === 'M'" :xl="12" :lg="24">
            <ElFormItem prop="beenVisible">
              <template #label>
                显示状态
                <ElTooltip content="选择隐藏则路由不会出现在侧边栏，但任可以访问" placement="top">
                  <FaIcon name="i-ri:question-line" />
                </ElTooltip>
              </template>
              <el-radio-group v-model="form.beenVisible">
                <el-radio :value="true">
                  显示
                </el-radio>
                <el-radio :value="false">
                  隐藏
                </el-radio>
              </el-radio-group>
            </ElFormItem>
          </ElCol>
          <ElCol :xl="12" :lg="24">
            <ElFormItem prop="perms">
              <template #label>
                权限字符
                <ElTooltip content="控制器中定义的权限字符" placement="top">
                  <FaIcon name="i-ri:question-line" />
                </ElTooltip>
              </template>
              <ElInput v-model="form.perms" clearable placeholder="请输入权限字符" />
            </ElFormItem>
          </ElCol>
          <ElCol :xl="12" :lg="24">
            <ElFormItem prop="status">
              <template #label>
                菜单状态
                <ElTooltip content="选择停用则路由不会出现在侧边栏，也不能被访问" placement="top">
                  <FaIcon name="i-ri:question-line" />
                </ElTooltip>
              </template>
              <el-radio-group v-model="form.status">
                <el-radio value="1">
                  正常
                </el-radio>
                <el-radio value="0">
                  禁用
                </el-radio>
              </el-radio-group>
            </ElFormItem>
          </ElCol>
          <ElCol :xl="12" :lg="24">
            <ElFormItem label="菜单描述" prop="menuDesc">
              <ElInput v-model="form.menuDesc" clearable placeholder="请输入菜单描述" />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </FaLayoutContainer>
    </ElForm>
    <FaFixedActionBar>
      <ElButton type="primary" size="large" @click="onSubmit">
        提交
      </ElButton>
      <ElButton size="large" @click="onCancel">
        取消
      </ElButton>
    </FaFixedActionBar>
  </div>
</template>

<style scoped>
.el-form {
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: auto;
}

.label-tip {
  display: inline-flex;
  margin-left: 10px;
  color: var(--el-text-color-disabled);
}

:deep(.el-table) {
  height: 100%;
  margin-top: 15px;

  .el-table__row {
    &.ghost {
      opacity: 0;
    }

    .index {
      display: inline-block;
    }

    .delete {
      display: none;
    }

    &:hover {
      .index {
        display: none;
      }

      .delete {
        display: inline-block;
      }
    }

    .el-tag.sortable,
    .el-tag.sortable .icon {
      cursor: ns-resize;
    }
  }
}
</style>
