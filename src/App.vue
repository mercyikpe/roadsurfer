<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/layouts/Header.vue'
</script>

<template>
  <main class="min-h-screen flex flex-col justify-between font-encode-san max-w-[2000px] mx-auto">
    <section class="flex-grow">
      <Header />

      <RouterView />
    </section>
  </main>
</template>

<style scoped></style>
