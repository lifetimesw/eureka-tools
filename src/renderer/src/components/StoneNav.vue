<!-- d:\Documents\projects\private\eureka-weather\src\components\StoneNav.vue -->
<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isCollapsed = ref(true)

const navList = [
  { name: 'EurekaWeather', title: '优雷卡天气', icon: 'cloud' },
  { name: 'EurekaFate', title: '优雷卡Fate', icon: 'clipboard-list' },
  { name: 'EurekaVariant', title: '优雷卡变异', icon: 'skull' },
  { name: 'Market', title: '市场交易板', icon: 'market' },
  { name: 'About', title: '关于', icon: 'badge-question-mark' },
]

function toggleCollapse(): void {
  isCollapsed.value = !isCollapsed.value
}

function goTo(item: any): void {
  if (route.name !== item.name) {
    router.push({ name: item.name })
  }
}
</script>

<template>
  <div class="stone-nav-sidebar">
    <div class="absolute left-0 top-0 w-100vw h-full" v-show="!isCollapsed" @click="isCollapsed = !isCollapsed"></div>
    <div class="stone-main-nav" :class="{ collapsed: isCollapsed }">
      <div class="main-nav-item collapse-trigger" @click="toggleCollapse">
        <i class="nav-icon" :class="isCollapsed ? 'i-lucide:list-indent-increase' : 'i-lucide:list-indent-decrease'" />
        <span class="nav-text">菜单</span>
      </div>
      <div v-for="item in navList" :key="item.name" class="main-nav-item" :class="{ active: route.name === item.name }" @click="goTo(item)">
        <i class="nav-icon" :class="[`i-svg:${item.icon}`, `i-lucide:${item.icon}`]" />
        <span class="nav-text">{{ item.title }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stone-nav-sidebar {
  position: absolute;
  height: 100%;
  z-index: 200;
}

.stone-main-nav {
  padding-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 200px;
  height: 100%;
  background: #fff;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  &.collapsed {
    width: 60px; // 收起宽度

    .main-nav-item {
      justify-content: center;
      padding: 0;
      padding-right: 0;

      .nav-icon {
        font-size: 1rem;
        margin-right: 0;
      }
      .nav-text {
        width: 0;
        opacity: 0;
        visibility: hidden;
        margin: 0;
        padding: 0;
      }
    }
  }

  .main-nav-item {
    position: relative;
    width: 100%;
    height: 3em;
    margin-bottom: 0.5em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 1.5em;
    transition:
      padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      justify-content 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    box-sizing: border-box;

    &:hover {
      background-color: rgba(59, 130, 246, 0.05);
    }

    .nav-icon {
      width: 1.5em;
      height: 1.5em;
      margin-right: 1em;
      font-size: 1rem;
      flex-shrink: 0;
      transition: margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      filter: grayscale(100%);
    }

    .nav-text {
      color: #333;
      font-size: 1rem;
      white-space: nowrap;
      opacity: 1;
      width: auto;
      visibility: visible;
      transition:
        opacity 0.2s ease-in,
        width 0.3s ease-out,
        visibility 0.3s,
        margin-left 0.3s;
      overflow: hidden;
    }

    &.active {
      background-color: rgba(59, 130, 246, 0.1);
      &::after {
        content: '';
        position: absolute;
        right: 0;
        top: 10%;
        bottom: 10%;
        width: 3px;
        background-color: #4dabf7;
        border-radius: 2px 0 0 2px;
        transition: opacity 0.3s;
      }

      .nav-icon,
      .nav-text {
        color: #4dabf7;
        font-weight: 500;
        filter: grayscale(0);
      }
    }
  }
  .collapse-trigger {
    .nav-icon {
      transition: transform 0.3s;
    }
  }
}
</style>
