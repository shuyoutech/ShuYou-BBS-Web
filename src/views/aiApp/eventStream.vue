<script setup lang="ts">
import ClipboardJS from 'clipboard'
// import DOMPurify from 'dompurify'
// import { ElMessage } from 'element-plus'
import hljs from 'highlight.js'
import bash from 'highlight.js/lib/languages/bash'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
// 导入常用语言
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import nginx from 'highlight.js/lib/languages/nginx'
import php from 'highlight.js/lib/languages/php'
import plaintext from 'highlight.js/lib/languages/plaintext'
import powershell from 'highlight.js/lib/languages/powershell'
import python from 'highlight.js/lib/languages/python'
import ruby from 'highlight.js/lib/languages/ruby'
import scss from 'highlight.js/lib/languages/scss'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'
import { marked } from 'marked'
import 'highlight.js/styles/github-dark.css'

const props = defineProps({
  // 初始 Markdown 内容
  initialContent: {
    type: String,
    default: '',
  },
  // 接口是否结束
  interfaceFinish: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['updateHeight', 'noticeStop'])
// 注册你需要的语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('php', php)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('go', go)
hljs.registerLanguage('css', css)
hljs.registerLanguage('scss', scss)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('nginx', nginx)
hljs.registerLanguage('plaintext', plaintext)
hljs.registerLanguage('powershell', powershell)
// 配置 marked 解析器
marked.setOptions({
  gfm: true,
  breaks: true,
  highlight(code, lang) {
    // 如果未指定语言，尝试自动检测
    if (!lang) {
      return hljs.highlightAuto(code).value
    }
    try {
      // 检查语言是否可用
      if (hljs.getLanguage(lang)) {
        return hljs.highlight(lang, code).value
      }
      // 如果语言不可用，尝试自动检测
      return hljs.highlightAuto(code).value
    }
    catch (e) {
      console.warn(`Highlight.js error for language '${lang}':`, e)
      return hljs.highlightAuto(code).value
    }
  },
  // sanitize: true,
  langPrefix: 'hljs language-',
})
// const content = ref(props.initialContent)
// const parsedMarkdown = ref('')
// 打字机效果
const markdownContainer = ref(null)
let currentContent = ''
let typeInterval = null
let currentIndex = 0
let pendingContent = ''
async function typeWriterEffect() {
  if (currentIndex < pendingContent.length) {
    currentContent += pendingContent.charAt(currentIndex)
    const html = await marked.parse(currentContent || '')
    markdownContainer.value.innerHTML = html.replace(/<pre><code(.*?)>/g, (match, p1) => {
      return `<div class="code-block-wrapper"><pre><code${p1}>`
    }).replace(/<\/code><\/pre>/g, '</code></pre></div>')
    // 代码块添加复制按钮
    addCopyButtons()
    // 只在代码块完整闭合时才尝试高亮
    if (html.includes('</code></pre>')) {
      highlightCodeBlocks(markdownContainer.value)
    }

    currentIndex++
    // 通知父组件更新滚动条高度
    emit('updateHeight', { height: markdownContainer.value.scrollHeight })
  }
  else {
    if (currentIndex === pendingContent.length && currentIndex > 0 && props.interfaceFinish) {
      // 通知父组件已经结束了
      emit('noticeStop')
    }
    clearInterval(typeInterval)
    typeInterval = null
  }
}
// 处理新数据
function processNewData(newData) {
  pendingContent = newData
  if (!typeInterval) {
    typeInterval = setInterval(typeWriterEffect, 50) // 调整速度
  }
}
// 清除定时器
function clearAllTimers() {
  clearInterval(typeInterval)
  typeInterval = null
}
// // 处理文本
// const handleText = () => {
//   const html = marked.parse(content.value);
//   // 添加复制按钮容器
//   markdownContainer.value.innerHTML = html.replace(/<pre><code(.*?)>/g, (match, p1) => {
//     return `<div class="code-block-wrapper"><pre><code${p1}>`;
//   }).replace(/<\/code><\/pre>/g, '</code></pre></div>');

//   addCopyButtons();
// }
// 手动高亮 Vue 动态添加的元素
// const highlightBlocks = () => {
//   document.querySelectorAll('pre code').forEach((block) => {
//     if (block.dataset.highlighted) {
//       delete block.dataset.highlighted;
//     }
//     hljs.highlightElement(block);
//   });
// };
// 高亮代码块
function highlightCodeBlocks(container) {
  // 只处理完整的代码块
  const completeBlocks = container.querySelectorAll('pre code[class*="language-"]')
  completeBlocks.forEach((block) => {
    // 跳过已经高亮的块
    if (block.classList.contains('hljs')) {
      return
    }
    const lang = (block.className.match(/language-(\w+)/) || [null, ''])[1]
    if (lang && hljs.getLanguage(lang)) {
      try {
        hljs.highlightElement(block)
      }
      catch (e) {
        console.warn('Highlight failed:', e)
      }
    }
  })
  // if (markdownContainer.value) {
  //   markdownContainer.value.querySelectorAll('pre code').forEach((block) => {
  //     if (!block.dataset.highlighted) {
  //       try {
  //         hljs.highlightElement(block);
  //         block.dataset.highlighted = 'true';
  //       } catch (e) {
  //         //console.warn('Highlight failed:', e.message);
  //         // 保持原始代码显示，只是不高亮
  //         block.classList.add('no-highlight');
  //       }
  //     }
  //   });
  // }
}
// 添加复制按钮到代码块
// const contentRef = ref(null)
function addCopyButtons() {
  nextTick(() => {
    if (!markdownContainer.value.innerHTML) {
      return
    }
    // 清除旧的 Clipboard 实例
    if (window.clipboardInstance) {
      window.clipboardInstance.destroy()
    }
    // 添加复制按钮
    const codeBlocks = markdownContainer.value.querySelectorAll('pre code')
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentNode
      // 如果已经添加了复制按钮，则跳过
      if (pre.querySelector('.copy-button')) {
        return
      }

      const button = document.createElement('button')
      button.className = 'copy-button'
      button.textContent = '复制'
      button.dataset.clipboardText = codeBlock.textContent

      pre.style.position = 'relative'
      pre.insertBefore(button, codeBlock)

      // 代码块左上角添加语言类型
      const language = codeBlock.className.split(' ')[0]
      const lang = language.replace('language-', '')
      const span = document.createElement('span')
      span.className = 'lang-type'
      span.textContent = lang
      pre.insertBefore(span, codeBlock)
    })

    // 初始化 ClipboardJS
    window.clipboardInstance = new ClipboardJS('.copy-button', {
      text: trigger => trigger.dataset.clipboardText,
    })
    // 添加复制反馈
    window.clipboardInstance.on('success', (e) => {
      e.trigger.textContent = '复制成功'
      e.trigger.style.color = '#67C23A'
      setTimeout(() => {
        e.trigger.textContent = '复制'
        e.trigger.style.color = '#f5eded'
      }, 2000)
    })
  })
}
watch(() => props.initialContent, (newVal) => {
  if (newVal === '') {
    markdownContainer.value.innerHTML = ''
    currentContent = ''
    typeInterval = null
    currentIndex = 0
    pendingContent = ''
  }
  processNewData(newVal)
})
defineExpose({
  clearAllTimers,
})
</script>

<template>
  <div class="markdown-container">
    <!-- <div ref="contentRef" class="markdown-content" v-html="parsedMarkdown"></div> -->
    <div ref="markdownContainer" class="markdown-content" />
  </div>
</template>

<style>
.markdown-container {
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
  font-size: 14px !important;
}

.markdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.markdown-content {
  padding: 0 24px 0 0;
  line-height: 1.6;
  color: #1f2937;
  background-color: #fff;
  border-radius: 8px;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3 {
  margin-top: 1.5em !important;
  margin-bottom: 0.5em;
  font-weight: 600;
  color: #111827;
}

.markdown-content h1 {
  font-size: 20px;
}

.markdown-content h2 {
  font-size: 18px;
}

.markdown-content h3 {
  font-size: 16px;
}

.markdown-content p {
  margin-bottom: 1em;
}

/* 代码块样式 */
.markdown-content pre code.hljs {
  border-radius: 0;
}

.markdown-content a {
  color: #3b82f6;
}

.markdown-content pre {
  position: relative;
  padding: 34px 16px 16px;
  margin: 1em 0;
  overflow: auto;
  color: #c9d1d9;
  background-color: #000;
  border-radius: 10px !important;
}

.markdown-content code {
  font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 14px;
}

/* 模拟编辑器顶部栏 */

/* .markdown-content pre:before {
  content: '';
  position: absolute;
  top: 12px;
  left: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50% !important;
  background: #ff5f56;
  box-shadow: 20px 0 #ffbd2e, 40px 0 #27c93f;
} */
.lang-type {
  position: absolute;
  top: 3px;
  left: 15px;
  font-size: 14px;
  color: #f5eded;
}

/* 行号样式（可选） */
.markdown-content .hljs-ln {
  padding-right: 1em;
  color: #999;
  user-select: none;
}

.markdown-content blockquote {
  padding-left: 1em;
  margin-left: 0;
  font-style: italic;
  color: #6b7280;
  border-left: 4px solid #e5e7eb;
}

.markdown-content ul,
.markdown-content ol {
  padding-left: 2em;
  margin-bottom: 1em;
}

/* 全局表格样式 - 不受 scoped 限制 */
.markdown-container table {
  width: 100%;
  margin: 1em 0;
  border-collapse: collapse;
  box-shadow: 0 0 0 0 #ddd;
}

.markdown-container th,
.markdown-container td {
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.markdown-container th {
  font-weight: bold;
  background-color: #f5f5f5;
}

/* 使用深度选择器样式代码块 */
.copy-button {
  position: absolute;
  top: 0;
  right: 10px;
  padding: 5px;
  color: #f5eded; /* 或者其他颜色 */
  cursor: pointer;
  background: none;
  border: none;
}

.copy-button:hover {
  color: #3b82f6;
  background: none;
}
</style>
