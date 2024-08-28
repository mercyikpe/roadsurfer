<template>
  <nav class="bg-primary-green mx-auto space-y-4 sm:space-y-0 sm:flex-row">
    <div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex-1 md:flex md:items-center md:gap-12">
          <a href="https://roadsurfer.com/uk/" title="roadsurfer.com" class="brand">
            <span class="sr-only">Home</span>
            <img
              class="skip-lazy img-fluid"
              src="https://roadsurfer.com/wp-content/themes/roadsurfer/_/img/logo/logo.svg"
              alt="Roadsurfer Logo"
              width="196"
              height="28"
            />
          </a>
        </div>
        <IconsCard />
      </div>
    </div>
  </nav>

  <section
    class="relative bg-[url(https://roadsurfer.com/wp-content/uploads/myroadsurfer-camper-van-sprinter-campervan-motorhomes-for-sale-overview.jpg)] bg-cover bg-center bg-no-repeat"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-gray-900/75 to-transparent sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25"
    ></div>

    <div
      class="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-[40vh] lg:items-center lg:px-8"
    >
      <div class="max-w-xl text-center mx-auto">
        <h1 class="text-3xl font-extrabold text-white sm:text-4xl">
          View Station

          <strong class="text-primary-yellow"> Bookings. </strong>
        </h1>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import IconsCard from '@/components/layouts/IconsCard.vue'
</script>
