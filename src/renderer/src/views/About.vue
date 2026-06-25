<script setup lang="ts">
const techStack = ['XIVAPI-V2', 'XIVAPI', 'Garland Tools', 'Universalis', 'Classjob-Icons', 'Electron-Vite 5', 'Vue 3.5', 'Unocss']
const version = ref('')
const appName = ref('')

function openUrl(url: string): void {
  if (url) {
    window.api.shell.openExternal(url)
  }
}

onMounted(async () => {
  version.value = await window.api.app.getVersion()
  appName.value = await window.api.app.getAppName()
})
</script>

<template>
  <div class="w-full h-full bg-white">
    <div class="p-6">
      <div class="f-center gap-5">
        <div class="w-5em h-5em rounded-1em f-center-center shadow-md">
          <i class="icon icon-xxl i-svg:ff14 text-black"></i>
        </div>
        <div class="if-start-start-col">
          <h1 class="text-6 fw-bold">{{ appName }}</h1>
          <div class="px-3 py-1 rounded-full mt-1 fw-500 text-3 text-slate-500 bg-slate-100 inline-block">版本 {{ version }}</div>
        </div>
      </div>

      <div class="mt-1em f-start-start-col gap-3">
        <div class="f-start">
          <div class="w-6em text-#5b6e8c">开发</div>
          <div class="fw-500">LifetimeSW</div>
        </div>
        <div class="f-start">
          <div class="w-6em text-#5b6e8c">开源地址</div>
          <div class="fw-500">
            <a class="link" @click="openUrl('https://github.com/lifetimesw/eureka-tools')">eureka-tools</a>
          </div>
        </div>
      </div>

      <div class="mt-1em bg-#f8fafc rounded-3 p-1em b-1 b-solid b-#eef2f6">
        <p class="f-center gap-2"><i class="icon-m text-#4a7c6b i-lucide:copyright"></i><strong>开源组件致谢</strong></p>
        <p class="f-center mt-8px flex-wrap gap-2">
          <span class="badge" v-for="tech in techStack" :key="tech">{{ tech }}</span>
        </p>
        <p class="f-center mt-1em text-3">本软件遵循 MIT 许可协议。<br />特别感谢开源社区贡献者。</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
