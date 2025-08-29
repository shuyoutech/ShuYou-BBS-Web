<script setup>
import { CopyDocument, EditPen, RefreshRight, VideoPause } from '@element-plus/icons-vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { debounce } from 'lodash-es'
import { toast } from 'vue-sonner'
import MarkdownEventStream from './eventStream.vue'

const props = defineProps({
  model: String,
  promptText: String,
  knowledgeId: String,
})
const tempId = Date.now() + 1
// 初始化消息列表
const messages = reactive([
  // 可以添加一些初始消息
])

// 初始化问题输入框的值
const question = ref('')
const answerRef = ref(null)
// 发送问题的函数
// const isProgress = ref(false);
// 是否在问答过程中 true 表示不在问答中，false 表示在问答中
const isFinish = ref(true)
function sendQuestion(question) {
  if (question.trim() === '') {
    return
  }
  if (props.model === '') {
    toast.warning('请选择模型')
    return
  }
  // if (props.promptText === '') {
  //   toast.warning('请输入提示词')
  //   return
  // }
  if (props.knowledgeId === '') {
    toast.warning('请选择知识库')
    return
  }
  // 添加用户的问题到消息列表
  messages.push({ sender: 'user', content: question.trimEnd(), editContent: question.trimEnd(), isEdit: false, id: tempId })
  // AI 回答
  nextTick().then(() => {
    handleAnswer(question.trimEnd())
  })
}
const route = useRoute()
// 处理 AI 回答
// 可以根据需要对回答进行格式化或处理
const interfaceFinish = ref(false) // true表示接口返回完成 false未完成
const controller = new AbortController()
const { signal } = controller
function handleAnswer(msg, repeat = false) {
  const content = ref('')
  const baseURL = (import.meta.env.DEV && import.meta.env.VITE_OPEN_PROXY) ? '/proxy/' : import.meta.env.VITE_APP_API_BASEURL
  const params = {
    appId: route.query.id,
    conversationId: '',
    chatModelId: props.model,
    promptText: props.promptText,
    knowledgeId: props.knowledgeId,
    role: 'user',
    messages: [
      {
        type: 'text',
        content: msg,
      },
    ],
  }
  // 清空输入框
  question.value = ''
  // 占位消息
  if (!repeat) {
    messages.push(reactive({ sender: 'ai', content: content.value, id: tempId }))
  }
  isFinish.value = false
  fetchEventSource(`${baseURL}app/chatTest?t=${Date.now()}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify(params),
    openWhenHidden: true, // 在调用失败时禁止重复调用
    signal,
    onmessage(event) {
      if (event.data) {
        const parseData = JSON.parse(event.data)
        if (parseData.type && parseData.type === 'text') {
          content.value += parseData.value
          // 更新最后一条消息内容
          updateLastMessage(content.value, tempId)
        }
      }
    },
    onclose() {
      interfaceFinish.value = true
      console.warn('Connection closed')
    },
    onerror(error) {
      isFinish.value = true
      interfaceFinish.value = true
      console.error('Error:', error)
    },
  })
}
// 暂停回答
function handlePause() {
  const lastIndex = answerRef.value.length - 1
  answerRef.value[lastIndex].clearAllTimers()
  isFinish.value = true
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
}
// 替代每次都map整个数组的方式
function updateLastMessage(content, tempId) {
  const lastIndex = messages.length - 1
  if (lastIndex >= 0 && messages[lastIndex].id === tempId) {
    messages[lastIndex] = Object.assign({}, messages[lastIndex], { content })
  }
}
const chatContainer = ref(null)
// 滚动到底部的函数
const scrollToBottom = debounce(() => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}, 30)
// 复制发送的消息
function handleCopy(content) {
  navigator.clipboard.writeText(content).then(() => {
    toast.success('复制成功')
  })
}
// 发送的消息编辑
const inputRefs = ref([])
// 设置 refs
function setRefs(el, index) {
  if (el) {
    inputRefs.value[index] = el // 将每个输入框存储到数组中
  }
}
function handleEdit(msg) {
  // 修改当前消息isEdit状态
  const index = messages.findIndex(item => item.id === msg.id)
  if (index >= 0) {
    messages[index] = Object.assign({}, messages[index], { isEdit: !msg.isEdit, editContent: msg.content })
    if (!msg.isEdit) {
      // 当前隐藏状态，显示后需要focus
      if (inputRefs.value[index]) {
        setTimeout(() => {
          inputRefs.value[index].focus() // 调用 focus 方法
        }, 0)
      }
    }
  }
}
// 重新发送消息处理
function handleReSend(msg) {
  if (msg.editContent.trim() === '' || msg.editContent.trim() === msg.content.trim()) {
    return
  }
  sendQuestion(msg.editContent)
  handleEdit(msg)
}
// 重新生成消息处理
function handleRefresh() {
  // 处理最后一条
  const lastIndex = messages.length - 1
  messages[lastIndex] = { ...messages[lastIndex], content: '' }
  // 重新发送
  const question = messages[lastIndex - 1].content
  handleAnswer(question, true)
}
</script>

<template>
  <div class="h-full">
    <div class="qa-page">
      <!-- 问题列表 -->
      <div ref="chatContainer" class="question-list">
        <div v-for="(message, index) in messages" :key="index" class="message" :class="[message.sender === 'ai' ? 'ai' : 'user']">
          <div v-show="message.sender === 'ai'" class="sender-ai">
            <div>
              <FaIcon name="i-material-symbols:deployed-code-sharp" class="icon" />
            </div>
          </div>
          <div :class="{ 'ai-message': message.sender === 'ai', 'full-width': message.isEdit }">
            <div v-if="message.sender === 'user'">
              <div v-show="!message.isEdit" class="user-message">
                {{ message.content }}
              </div>
              <div v-show="!message.isEdit" class="user-operate">
                <el-icon @click="handleCopy(message.content)">
                  <CopyDocument />
                </el-icon>
                <el-icon @click="handleEdit(message)">
                  <EditPen />
                </el-icon>
              </div>
              <div v-show="message.isEdit" class="edit-msg-box">
                <el-input :id="`input-${index}`" :ref="(el) => setRefs(el, index)" v-model="message.editContent" type="textarea" resize="none" :rows="3" />
                <div class="operate-btn">
                  <el-button type="info" @click="handleEdit(message)">
                    取消
                  </el-button>
                  <el-button type="primary" @click="handleReSend(message)">
                    发送
                  </el-button>
                </div>
              </div>
            </div>
            <div v-else>
              <MarkdownEventStream ref="answerRef" :initial-content="message.content" :interface-finish="interfaceFinish" @update-height="scrollToBottom" @notice-stop="isFinish = true" />
              <div v-show="(isFinish && message.content) || index < messages.length - 1" class="user-operate answer-operate">
                <el-tooltip
                  class="box-item"
                  effect="light"
                  content="复制"
                  placement="top-start"
                >
                  <el-icon @click="handleCopy(message.content)">
                    <CopyDocument />
                  </el-icon>
                </el-tooltip>
                <el-tooltip
                  class="box-item"
                  effect="light"
                  content="重新生成"
                  placement="top-start"
                >
                  <el-icon v-show="index === messages.length - 1" @click="handleRefresh(message)">
                    <RefreshRight />
                  </el-icon>
                </el-tooltip>
              </div>
              <!-- <MarkdownEventStream ref="answerRef" :content="message.content" /> -->
            </div>
          </div>
          <div v-show="message.sender === 'user'" class="sender-user">
            <div>
              <FaIcon name="i-ic:baseline-account-box" class="icon" />
            </div>
          </div>
        </div>
      </div>
      <!-- 输入框和发送按钮 -->
      <div class="input-container">
        <el-input v-model="question" type="textarea" placeholder="请输入问题" :rows="2" resize="none" @keyup.enter.prevent="sendQuestion(question)" />
        <div class="send-btn">
          <el-button v-if="isFinish" class="sure-btn" @click="sendQuestion(question)">
            发送
          </el-button>
          <el-icon v-else class="stop-icon" @click="handlePause">
            <VideoPause />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.qa-page {
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 100%;
  margin: auto;
}

.question-list {
  height: 100%;
  // min-height: calc(100% - 200px);
  padding: 20px 10px 20px 0;
  overflow-y: auto;
}

.ai {
  justify-content: flex-start;
}

.user {
  justify-content: flex-end;
}

.message {
  display: flex;
  width: 100%;
  margin-bottom: 5px;
  font-size: 14px;

  .sender-ai {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    padding: 2px; /* 边框宽度 */
    margin-right: 10px;
    background: #1890ff;
    border: 1px solid #fff;
    border-radius: 8px;
  }

  .sender-ai div {
    width: 100%;
    height: 100%;
    padding-top: 4px;
    font-family: DingTalk;
    font-size: 18px;
    text-align: center;
    border-radius: 18px;

    .icon {
      font-size: 24px;
      color: #fff;
    }
  }

  .sender-user {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    padding: 2px; /* 边框宽度 */
    margin-left: 10px;
    background: #fff;
    border: 1px solid #1890ff;
    border-radius: 8px;

    .icon {
      padding-top: 6px;
      padding-left: 6px;
      font-size: 24px;
      color: #1890ff;
    }
  }
}

.user-message {
  padding: 8px 20px;
  margin-left: 36px;
  background-color: rgb(221 233 254 / 100%);
  border-radius: 8px;
}

.user-operate {
  padding-right: 0;
  margin-top: 5px;
  font-size: 18px;
  color: rgb(144 144 144 / 100%);
  text-align: right;

  .el-icon {
    margin: 0 5px;
    cursor: pointer;

    &:hover {
      color: #1890ff;
    }
  }
}

.answer-operate {
  text-align: left;
}

.edit-msg-box {
  box-sizing: border-box;
  width: 100%;
  padding-left: 102px;

  .operate-btn {
    margin-top: 10px;
    text-align: right;
  }
}

.ai-message {
  width: calc(100% - 54px);
  padding: 0 0 8px;
  overflow: hidden;
  font-size: 14px;
  line-height: 21px;
  border-radius: 8px;
}

.full-width {
  width: 100%;
}

.input-container {
  box-sizing: border-box;
  width: 100%;
  max-width: 900px;
  height: 140px;
  padding: 24px;
  margin: auto;
  background: rgb(245 246 250 / 100%);
  border: 1px solid rgb(235 235 235 / 100%);
  border-radius: 12px;

  .send-btn {
    margin-top: 13px;
    text-align: right;

    .stop-icon {
      font-size: 32px;
      color: #1890ff;
      cursor: pointer;
    }
  }

  :deep(.el-textarea__inner) {
    border-radius: 12px;
    box-shadow: 0 0 0 1px rgb(235 235 235 / 100%);
  }
}
</style>
