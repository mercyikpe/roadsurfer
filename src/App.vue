<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
</script>

<template>
  <main class="min-h-screen flex flex-col justify-between">
    <section class="flex-grow">
      <Header />

      <RouterView />
    </section>
    <Footer />
  </main>
</template>

<style scoped></style>
