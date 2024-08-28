<template>
  <nav class="w-full bg-primary-green mx-auto space-y-4 sm:space-y-0 sm:flex-row">
    <div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex-1 md:flex md:items-center md:gap-12">
          <a href="https://roadsurfer.com/uk/" title="roadsurfer.com" class="brand">
            <span class="sr-only">Home</span>
            <img
              class="w-auto h-7"
              src="https://roadsurfer.com/wp-content/themes/roadsurfer/_/img/logo/logo-blank.svg"
              alt="Roadsurfer Logo text"
              width="266"
              height="44"
              data-lazy-src="https://roadsurfer.com/wp-content/themes/roadsurfer/_/img/logo/logo-blank.svg"
              loading="lazy"
            />
          </a>
        </div>

        <p class="text-sm">
          © Made by
          <a href="https://mercyikpe.vercel.app/projects" class="underline"> Mercy Ikpe </a> |
          {{ new Date().getFullYear() }}.
        </p>

        <IconsCard />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import IconsCard from '@/components/layouts/IconsCard.vue'
</script>

<style></style>
