<template>
  <div class="app-shell">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');

:root {
  --ink: #14212b;
  --muted: #5a6570;
  --accent: #c45c26;
  --surface: #ffffff;
  --surface-muted: #f3f6f8;
  --border: #d7dee4;
  --font-display: 'Syne', sans-serif;
  --font-body: 'Figtree', sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--font-body);
  color: var(--ink);
  background:
    radial-gradient(ellipse 80% 50% at 10% -10%, #dfe9f0 0%, transparent 55%),
    radial-gradient(ellipse 70% 45% at 100% 0%, #efe4d8 0%, transparent 50%),
    linear-gradient(180deg, #edf1f4 0%, #f7f4f0 48%, #eef2f5 100%);
  background-attachment: fixed;
}

.app-shell {
  min-height: 100vh;
}

img {
  max-width: 100%;
  display: block;
}

button,
input,
select {
  font: inherit;
}
</style>
