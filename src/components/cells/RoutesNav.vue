<script setup lang="ts">
import type { DrawerMenuItem } from '@/common/interfaces'
import { useRouter } from 'vue-router'

const router = useRouter()
const routes = router.getRoutes()

/** Drawer menu items */
const items: DrawerMenuItem[] = []
routes.forEach((r) =>
  items.push({
    title: r.name?.toString() ?? '',
    icon: r.meta?.icon?.toString() ?? '',
    disabled: r.meta?.disabled === true,
    to: {
      name: r.name
    }
  })
)
</script>

<template>
  <v-list nav>
    <template v-for="item in items" :key="item.title">
      <v-divider v-if="item.title === '-'" />
      <template v-else>
        <!-- Menu Item -->
        <v-list-item
          v-if="!item.items"
          :disabled="item.disabled"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          link
        />
        <!-- Sub menu -->
        <v-list-group v-else-if="item.items" v-model="item.active">
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="item.icon"
              :title="item.title"
            />
          </template>
          <!-- Sub menu item -->
          <template v-for="subItem in item.items" :key="subItem.title">
            <v-divider v-if="subItem.title === '-'" />
            <v-list-item
              v-else
              :disabled="subItem.disabled"
              :prepend-icon="subItem.icon"
              :title="subItem.title"
              :to="subItem.to"
              link
            />
          </template>
        </v-list-group>
      </template>
    </template>
  </v-list>
</template>
