<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {gameHotListApi} from "@/api/game";
import type {GameVo} from "@/api/game/types.ts";
import {dictOptionsApi} from "@/api/common";
import {postPageApi} from "@/api/bbs/post";
import type {PostQuery, PostVo} from "@/api/bbs/post/types.ts";

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const sortBy = ref('latest')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(12)
const totalWorks = ref(0)

// 游戏选择相关
const selectedGames = ref<string[]>([])
// 标签选择相关
const selectedTypes = ref<string[]>([])
// 捏脸列表数据
const faceList = reactive<PostVo[]>([]);

const postQuery = reactive<PageQuery<PostQuery>>({
  pageNum: 1,
  pageSize: 15,
  sort: 'createTime',
  order: 'desc',
  query: {}
})

const viewWork = (_work: any) => {

}

const likeWork = (work: any) => {
  work.isLiked = !work.isLiked
  if (work.isLiked) {
    work.likes++
    ElMessage.success('已添加到喜欢列表')
  } else {
    work.likes--
    ElMessage.info('已取消喜欢')
  }
}


const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置到第一页
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const goToUpload = () => {
  router.push('/face-upload')
}

// 游戏选择相关方法
const toggleGame = (gameId: string) => {
  const index = selectedGames.value.indexOf(gameId)
  if (index > -1) {
    selectedGames.value.splice(index, 1)
  } else {
    selectedGames.value.push(gameId)
  }
}

// 标签选择相关方法
const toggleType = (value: string) => {
  const index = selectedTypes.value.indexOf(value)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(value)
  }
}

// 加载游戏
const gameList = ref<GameVo[]>();
const loadGames = () => {
  gameHotListApi().then(({data}) => {
    gameList.value = data;
  });
}

// 加载游戏标签
const typeList = ref<Options[]>();
const loadFaceTypes = () => {
  dictOptionsApi("bbs_face_type").then(({data}) => {
    typeList.value = data;
  })
}

// 方法
const handleSearch = () => {
  postQuery.query.plate = '1'
  postQuery.query.title = searchQuery.value
  postPageApi(postQuery).then(({data}) => {
    console.log(JSON.stringify(data));
    Object.assign(faceList, data.rows)
  });
}


onMounted(() => {
  loadGames()
  loadFaceTypes()
  handleSearch()
})
</script>


<template>
  <div class="face-design-container">
    <!-- 筛选和搜索区域 -->
    <div class="filter-section">
      <div class="filter-content">
        <!-- 第一排：热门游戏选择 -->
        <div class="game-selector">
          <div class="game-section">
            <span class="game-label">热门游戏</span>
            <div class="game-buttons">
              <button
                v-for="game in gameList"
                :key="game.id"
                :class="['game-btn', { active: selectedGames.includes(game.id) }]"
                @click="toggleGame(game.id)"
              >
                <img :src="game.gameIcon" :alt="game.gameName" class="game-btn-icon"/>
                <span class="game-btn-text">{{ game.gameName }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 第二排：分类筛选标签 -->
        <div class="category-selector">
          <span class="category-label">标签&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <div class="tag-buttons">
            <button
              v-for="type in typeList"
              :key="type.value"
              :class="['tag-btn', { active: selectedTypes.includes(type.value) }]"
              @click="toggleType(type.value)"
            >
              <span class="tag-btn-text">{{ type.label }}</span>
            </button>
          </div>
        </div>

        <!-- 第三排：搜索和排序 -->
        <div class="search-filter-row">
          <div class="search-box">
            <FaIcon name="i-mdi:magnify" class="search-icon"/>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索捏脸作品..."
              class="search-input"
              @input="handleSearch"
            />
          </div>
          <div class="sort-buttons">
            <button
              :class="['sort-btn', { active: sortBy === 'latest' }]"
              @click="sortBy = 'latest'"
            >
              <FaIcon name="i-mdi:clock-outline" class="sort-icon"/>
              <span>最新</span>
            </button>
            <button
              :class="['sort-btn', { active: sortBy === 'popular' }]"
              @click="sortBy = 'popular'"
            >
              <FaIcon name="i-mdi:fire" class="sort-icon"/>
              <span>最热</span>
            </button>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" @click="goToUpload">
              <FaIcon name="i-mdi:plus"/>
              上传捏脸
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <div class="content-wrapper">
        <!-- 内容区 -->
        <div class="content-main">
          <!-- 作品网格 -->
          <div class="works-grid">
            <div
              v-for="face in faceList"
              :key="face.id"
              class="work-card"
              @click="viewWork(face)"
            >
              <div class="work-image">
                <img :src="face.coverImgUrl" :alt="face.title" class="cover-img"/>
                <div class="work-overlay">
                </div>
              </div>
              <div class="work-info">
                <h3 class="work-title">{{ face.title }}</h3>
                <div class="work-meta">
                  <div class="author-info">
                    <img :src="face.userAvatar" :alt="face.userName" class="author-avatar"/>
                    <span class="author-name">{{ face.userName }}</span>
                    <div class="work-location">
                      <FaIcon name="i-mdi:map-marker" class="location-icon"/>
                      <span class="location-text">{{ face.ipLocation }}</span>
                    </div>
                  </div>
                  <span class="work-date">{{ face.createTimeFormat }}</span>
                </div>
                <div class="work-tags-row">
                  <div class="work-tags">
                    <span
                      v-for="tag in face.tags"
                      :key="tag"
                      class="work-tag"
                    >
                      {{ tag }}
                    </span>
                  </div>
                  <!-- 统计信息显示区域 -->
                  <div class="work-stats-display">
                    <div class="stats-item views">
                      <FaIcon name="i-mdi:eye" class="stats-icon"/>
                      <span class="stats-number">{{ formatNumber(face.viewCount) }}</span>
                    </div>
                    <div class="stats-item likes clickable" @click.stop="likeWork(face)">
                      <FaIcon name="i-mdi:heart" :class="['stats-icon', { liked: face.liked }]"/>
                      <span class="stats-number">{{ formatNumber(face.likeCount) }}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div class="pagination">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="totalWorks"
              :page-sizes="[12, 24, 48]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.face-design-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-section {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 10px 0;
}

.filter-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-filter-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 12px;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 400px;
  max-width: 800px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  font-size: 20px;
}

.search-input {
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 2px solid #e4e7ed;
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input:focus {
  outline: none;
  border-color: #409eff;
  background: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.filter-tabs {
  display: flex;
  gap: 12px;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow-x: auto;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 2px solid #e4e7ed;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  justify-content: center;
  flex-shrink: 0;
  min-width: 120px;
}

.filter-tab:hover {
  background: #f8f9fa;
  border-color: #c0c4cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.filter-tab.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 全部按钮的标签样式 */
.filter-tab.tag-like {
  background: #f0f9ff;
  color: #409eff;
  border: 1px solid #b3d8ff;
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  min-width: 50px;
  box-shadow: none;
  transform: none;
}

.filter-tab.tag-like:hover {
  background: #e1f5fe;
  border-color: #81d4fa;
  transform: none;
  box-shadow: 0 2px 4px rgba(64, 158, 255, 0.2);
}

.filter-tab.tag-like.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
  transform: none;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}


/* 游戏选择按钮样式 */
.game-selector {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 12px;
}

.game-section {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;
}

.game-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  flex-shrink: 0;
}

.game-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: nowrap;
  justify-content: flex-start;
  padding: 8px 0;
  overflow-x: auto;
}

.game-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #e4e7ed;
  background: white;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  justify-content: center;
  flex-shrink: 0;
  min-width: 120px;
  width: 100%;
}

.game-btn:hover {
  background: #f8f9fa;
  border-color: #c0c4cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.game-btn.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.game-btn-icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.game-btn-text {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: center;
}

/* 分类选择器样式 */
.category-selector {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 12px;
}

/* 标签按钮容器样式 */
.tag-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: flex-start;
  padding: 8px 0;
  overflow-x: auto;
}

/* 标签按钮样式 */
.tag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e4e7ed;
  background: #f8f9fa;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  justify-content: center;
  flex-shrink: 0;
  min-width: 80px;
}

.tag-btn:hover {
  background: #e9ecef;
  border-color: #c0c4cc;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.tag-btn.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.tag-btn-text {
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  text-align: center;
}

/* 排序按钮样式 */
.sort-buttons {
  display: flex;
  align-items: center;
  border: 2px solid #e4e7ed;
  border-radius: 25px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: white;
  color: #909399;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  border-right: 1px solid #e4e7ed;
  min-width: 80px;
  justify-content: center;
}

.sort-btn:last-child {
  border-right: none;
}

.sort-btn:hover {
  background: #f8f9fa;
  color: #606266;
  transform: translateY(-1px);
}

.sort-btn.active {
  background: #409eff;
  color: white;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.sort-icon {
  font-size: 18px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.content-wrapper {
  display: block;
}

.content-main {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.work-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.work-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.work-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.work-card:hover .cover-img {
  transform: scale(1.05);
}

.work-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
}

.work-card:hover .work-overlay {
  opacity: 1;
}


.work-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.action-btn .liked {
  color: #f56c6c;
}

.work-info {
  padding: 16px;
  position: relative;
}

.work-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.work-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 12px;
  color: #666;
}

.work-date {
  font-size: 12px;
  color: #999;
}

/* 标签和统计信息行样式 */
.work-tags-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.work-tags {
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
  flex: 1;
  overflow: hidden;
}

.work-tag {
  padding: 2px 8px;
  background: #f0f9ff;
  color: #409eff;
  border-radius: 10px;
  font-size: 11px;
  border: 1px solid #b3d8ff;
}

/* 统计信息显示区域样式 */
.work-stats-display {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 50px;
  justify-content: center;
}

.stats-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

.stats-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* 浏览数样式 */
.stats-item.views {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
}

/* 点赞数样式 */
.stats-item.likes {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);
}

.stats-item.clickable {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stats-item.clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.stats-icon.liked {
  color: #ff4757;
  animation: heartBeat 0.6s ease-in-out;
}

/* 下载数样式 */
.stats-item.downloads {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  box-shadow: 0 4px 15px rgba(168, 237, 234, 0.4);
}

.stats-icon {
  font-size: 12px;
  opacity: 0.9;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  position: relative;
  z-index: 1;
}

.stats-number {
  font-size: 11px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.3px;
  position: relative;
  z-index: 1;
}

/* 位置信息样式 */
.work-location {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  background: #f0f9ff;
  border-radius: 4px;
  border: 1px solid #b3d8ff;
}

.location-icon {
  font-size: 10px;
  color: #409eff;
}

.location-text {
  font-size: 10px;
  color: #409eff;
  font-weight: 500;
}

/* 右下角点赞按钮样式 */
.corner-like {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.corner-like:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.like-icon {
  font-size: 16px;
  color: #999;
  transition: all 0.3s ease;
}

.like-icon.liked {
  color: #ff4757;
  animation: heartBeat 0.6s ease-in-out;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}


.work-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.modal-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.modal-image {
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.modal-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.modal-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.modal-author-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-author-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.modal-author-level {
  font-size: 12px;
  color: #409eff;
  background: #f0f9ff;
  padding: 2px 8px;
  border-radius: 10px;
  width: fit-content;
}

.modal-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.modal-stats {
  display: flex;
  gap: 20px;
}

.modal-stats .stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #409eff, #337ecc);
  color: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  border-radius: 25px;
  padding: 14px 28px;
  font-weight: 600;
  font-size: 16px;
  min-width: 140px;
  justify-content: center;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.5);
  background: linear-gradient(135deg, #337ecc, #2c6bb3);
}

.btn-secondary {
  background: white;
  color: #606266;
  border: 2px solid #dcdfe6;
}

.btn-secondary:hover {
  background: #f5f7fa;
  border-color: #c0c4cc;
}

@media (max-width: 768px) {
  .bbs-header .header-content {
    padding: 0 10px;
  }

  .bbs-header .logo {
    margin-left: 0;
  }

  .bbs-header .nav-menu {
    display: none;
  }

  .page-header {
    top: 60px;
  }

  .content-wrapper {
    display: block;
  }

  .header-content {
    flex-direction: column;
    height: auto;
    padding: 16px 20px;
    gap: 16px;
  }

  .filter-content {
    gap: 12px;
  }

  .search-filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-box {
    min-width: auto;
  }

  .sort-buttons {
    justify-content: center;
  }

  .sort-btn {
    flex: 1;
    justify-content: center;
  }

  .game-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .category-selector {
    justify-content: flex-start;
  }

  .game-label {
    font-size: 13px;
  }

  .game-buttons {
    gap: 6px;
  }

  .game-btn {
    padding: 6px 12px;
    font-size: 13px;
  }

  .game-btn-icon {
    width: 18px;
    height: 18px;
  }

  .works-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .modal-body {
    grid-template-columns: 1fr;
  }

  .modal-info {
    padding: 20px;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
