<template>
  <div class="layout">
    <AppHeader />
    <div class="layout__main">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
}
</style>
