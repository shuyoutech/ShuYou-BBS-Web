<template>
  <div class="forum-container">
    <!-- 公共头部导航 -->
    <AppHeader
      ref="appHeaderRef"
      @go-to-login="goToLogin"
      @go-to-profile="goToProfile"
    />

    <!-- 主要内容区域 -->
    <div class="forum-content">


      <!-- 论坛导航 -->
      <div class="forum-nav">
        <div class="nav-tabs">
          <div
            v-for="tab in forumTabs"
            :key="tab.key"
            :class="['nav-tab', { active: activeTab === tab.key }]"
            @click="activeTab = tab.key"
          >
            <FaIcon :name="tab.icon" class="tab-icon"/>
            <span>{{ tab.name }}</span>
          </div>
        </div>
      </div>

      <!-- 论坛内容区域 -->
      <div class="forum-main">
        <!-- 左侧内容 -->
        <div class="forum-left">
          <!-- 热门话题 -->
          <div class="section">
            <div class="section-header">
              <h3 class="section-title">
                <FaIcon name="i-mdi:fire" class="title-icon"/>
                热门话题
              </h3>
              <span class="more-link">更多</span>
            </div>
            <div class="topics-list">
              <div
                v-for="topic in hotTopics"
                :key="topic.id"
                class="topic-item"
                @click="viewTopic(topic)"
              >
                <div class="topic-rank" :class="`rank-${topic.rank}`">{{ topic.rank }}</div>
                <div class="topic-content">
                  <h4 class="topic-title">{{ topic.title }}</h4>
                  <div class="topic-meta">
                    <span class="topic-author">{{ topic.author }}</span>
                    <span class="topic-time">{{ formatDate(topic.createTime) }}</span>
                    <span class="topic-views">{{ topic.views }} 浏览</span>
                  </div>
                </div>
                <div class="topic-stats">
                  <div class="stat-item">
                    <FaIcon name="i-mdi:thumb-up" class="stat-icon"/>
                    <span>{{ topic.likes }}</span>
                  </div>
                  <div class="stat-item">
                    <FaIcon name="i-mdi:comment" class="stat-icon"/>
                    <span>{{ topic.replies }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 最新帖子 -->
          <div class="section">
            <div class="section-header">
              <h3 class="section-title">
                <FaIcon name="i-mdi:new-box" class="title-icon"/>
                最新帖子
              </h3>
            </div>
            <div class="posts-list">
              <div
                v-for="post in latestPosts"
                :key="post.id"
                class="post-item"
                @click="viewPost(post)"
              >
                <div class="post-avatar">
                  <img :src="post.author.avatar" :alt="post.author.name" class="avatar-img"/>
                </div>
                <div class="post-content">
                  <h4 class="post-title">{{ post.title }}</h4>
                  <p class="post-excerpt">{{ post.excerpt }}</p>
                  <div class="post-meta">
                    <span class="post-author">{{ post.author.name }}</span>
                    <span class="post-time">{{ formatDate(post.createTime) }}</span>
                    <span class="post-category">{{ post.category }}</span>
                  </div>
                </div>
                <div class="post-stats">
                  <div class="stat-item">
                    <FaIcon name="i-mdi:eye" class="stat-icon"/>
                    <span>{{ post.views }}</span>
                  </div>
                  <div class="stat-item">
                    <FaIcon name="i-mdi:comment" class="stat-icon"/>
                    <span>{{ post.replies }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="forum-sidebar">




          <!-- 热门标签 -->
          <div class="hot-tags">
            <div class="card-header">
              <h4>
                <FaIcon name="i-mdi:tag" class="header-icon"/>
                热门标签
              </h4>
            </div>
            <div class="tags-list">
              <span
                v-for="tag in hotTags"
                :key="tag.name"
                class="tag-item"
                @click="searchByTag(tag.name)"
              >
                {{ tag.name }}
                <span class="tag-count">({{ tag.count }})</span>
              </span>
            </div>
          </div>

          <!-- 论坛统计 -->
          <div class="forum-stats">
            <div class="card-header">
              <h4>
                <FaIcon name="i-mdi:chart-line" class="header-icon"/>
                论坛统计
              </h4>
            </div>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">{{ forumStats.totalPosts }}</div>
                <div class="stat-label">总帖子</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ forumStats.totalUsers }}</div>
                <div class="stat-label">注册用户</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ forumStats.todayPosts }}</div>
                <div class="stat-label">今日发帖</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- 个人信息弹窗 -->
    <Profile
      v-model:visible="showProfileModal"
      @open-personal-center="handleOpenPersonalCenter"
    />

    <!-- 个人中心页面 -->
    <PersonalCenter
      v-model:visible="showPersonalCenterModal"
    />

    <!-- 公共底部 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AppHeader from '@/components/AppHeader/index.vue'
import AppFooter from '@/components/AppFooter/index.vue'

import Profile from '@/views/user/profile.vue'
import PersonalCenter from '@/views/user/personal-center.vue'
import { useUserStore } from '@/store/modules/user.ts'
import { useShareStore } from '@/store/modules/share.ts'

const router = useRouter()
const userStore = useUserStore()
const shareStore = useShareStore()

// 响应式数据
const appHeaderRef = ref()

const showProfileModal = ref(false)
const showPersonalCenterModal = ref(false)
const activeTab = ref('hot')



// 论坛标签页
const forumTabs = ref([
  { key: 'hot', name: '热门', icon: 'i-mdi:fire' },
  { key: 'latest', name: '最新', icon: 'i-mdi:new-box' },
  { key: 'discussion', name: '讨论', icon: 'i-mdi:forum' },
  { key: 'guide', name: '攻略', icon: 'i-mdi:book-open' },
  { key: 'news', name: '资讯', icon: 'i-mdi:newspaper' }
])

// 热门话题数据
const hotTopics = ref([
  {
    id: 1,
    rank: 1,
    title: '《失落的方舟》新版本更新内容详解',
    author: '游戏达人',
    createTime: '2025-01-15 10:30:00',
    views: 12580,
    likes: 256,
    replies: 89
  },
  {
    id: 2,
    rank: 2,
    title: '新手必看！职业选择指南',
    author: '攻略大师',
    createTime: '2025-01-15 09:15:00',
    views: 9876,
    likes: 189,
    replies: 67
  },
  {
    id: 3,
    rank: 3,
    title: '公会战攻略分享',
    author: '战斗专家',
    createTime: '2025-01-15 08:45:00',
    views: 7654,
    likes: 145,
    replies: 52
  },
  {
    id: 4,
    rank: 4,
    title: '装备强化技巧大全',
    author: '强化达人',
    createTime: '2025-01-15 07:20:00',
    views: 6543,
    likes: 123,
    replies: 41
  },
  {
    id: 5,
    rank: 5,
    title: 'PVP竞技场心得分享',
    author: '竞技高手',
    createTime: '2025-01-15 06:30:00',
    views: 5432,
    likes: 98,
    replies: 35
  }
])

// 最新帖子数据
const latestPosts = ref([
  {
    id: 1,
    title: '分享一个超实用的游戏技巧',
    excerpt: '今天发现了一个非常实用的游戏技巧，分享给大家...',
    author: {
      name: '技巧分享者',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
    },
    createTime: '2025-01-15 11:20:00',
    category: '技巧分享',
    views: 1234,
    replies: 23
  },
  {
    id: 2,
    title: '新版本BUG反馈',
    excerpt: '发现了一个新版本的BUG，希望官方能尽快修复...',
    author: {
      name: 'BUG猎人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
    },
    createTime: '2025-01-15 11:15:00',
    category: 'BUG反馈',
    views: 987,
    replies: 15
  },
  {
    id: 3,
    title: '公会招募新成员',
    excerpt: '我们公会正在招募活跃玩家，欢迎加入...',
    author: {
      name: '公会会长',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
    },
    createTime: '2025-01-15 11:10:00',
    category: '公会招募',
    views: 756,
    replies: 8
  },
  {
    id: 4,
    title: '游戏截图分享',
    excerpt: '今天拍了一些漂亮的游戏截图，分享给大家...',
    author: {
      name: '截图达人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
    },
    createTime: '2025-01-15 11:05:00',
    category: '截图分享',
    views: 543,
    replies: 12
  },
  {
    id: 5,
    title: '装备交易信息',
    excerpt: '出售一些多余装备，价格合理，有意者联系...',
    author: {
      name: '装备商人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5'
    },
    createTime: '2025-01-15 11:00:00',
    category: '装备交易',
    views: 432,
    replies: 6
  }
])



// 热门标签数据
const hotTags = ref([
  { name: '失落的方舟', count: 1256 },
  { name: '攻略', count: 987 },
  { name: '装备', count: 876 },
  { name: '公会', count: 765 },
  { name: 'PVP', count: 654 },
  { name: '新手', count: 543 },
  { name: '技巧', count: 432 },
  { name: 'BUG', count: 321 },
  { name: '活动', count: 210 },
  { name: '交易', count: 198 }
])

// 论坛统计数据
const forumStats = ref({
  totalPosts: 125680,
  totalUsers: 45678,
  todayPosts: 234
})

// 计算属性
const isLoggedIn = computed(() => {
  return userStore.isLoggedIn
})

// 方法
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}



const goToProfile = () => {
  if (isLoggedIn.value) {
    showProfileModal.value = true
  }
}



const handleOpenPersonalCenter = () => {
  showPersonalCenterModal.value = true
}

const viewTopic = (topic: any) => {
  console.log('查看话题:', topic)
  ElMessage.info(`查看话题: ${topic.title}`)
}

const viewPost = (post: any) => {
  console.log('查看帖子:', post)
  ElMessage.info(`查看帖子: ${post.title}`)
}

const searchByTag = (tagName: string) => {
  console.log('按标签搜索:', tagName)
  ElMessage.info(`搜索标签: ${tagName}`)
}

onMounted(() => {
  console.log('论坛页面已加载')
})
</script>

<style scoped>
.forum-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-top: 60px; /* 为固定导航栏留出空间 */
  padding-bottom: 50px; /* 为固定底部留出空间 */
  overflow-x: hidden; /* 防止水平滚动 */
}

.forum-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}



/* 论坛导航样式 */
.forum-nav {
  margin-bottom: 30px;
}

.nav-tabs {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-tab:hover {
  background: #f0f0f0;
}

.nav-tab.active {
  background: #007bff;
  color: white;
}

.tab-icon {
  margin-right: 8px;
  font-size: 16px;
}

/* 论坛主内容样式 */
.forum-main {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.forum-left {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 40px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.title-icon {
  margin-right: 8px;
  color: #007bff;
}

.more-link {
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
}

.more-link:hover {
  text-decoration: underline;
}

/* 热门话题样式 */
.topics-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.topic-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.topic-rank {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  margin-right: 16px;
  flex-shrink: 0;
}

.rank-1 { background: #ff6b6b; }
.rank-2 { background: #ffa726; }
.rank-3 { background: #ffca28; }
.rank-4, .rank-5 { background: #66bb6a; }

.topic-content {
  flex: 1;
  margin-right: 16px;
}

.topic-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.topic-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.topic-stats {
  display: flex;
  gap: 16px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
}

.stat-icon {
  font-size: 16px;
}

/* 最新帖子样式 */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.post-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.post-avatar {
  margin-right: 16px;
  flex-shrink: 0;
}

.avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.post-content {
  flex: 1;
  margin-right: 16px;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.post-excerpt {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.post-category {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
  color: #666;
}

.post-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

/* 右侧边栏样式 */
.forum-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card,
.online-users,
.hot-tags,
.forum-stats {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  margin-bottom: 16px;
}

.card-header h4 {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-icon {
  margin-right: 8px;
  color: #007bff;
}





/* 热门标签样式 */
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: #f0f0f0;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item:hover {
  background: #007bff;
  color: white;
}

.tag-count {
  margin-left: 4px;
  opacity: 0.7;
}

/* 论坛统计样式 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .forum-main {
    grid-template-columns: 1fr;
  }

  .nav-tabs {
    flex-wrap: wrap;
  }

  .nav-tab {
    flex: 1 1 calc(50% - 4px);
    margin-bottom: 8px;
  }

  .topic-item,
  .post-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .topic-rank {
    margin-bottom: 12px;
  }

  .post-avatar {
    margin-bottom: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
