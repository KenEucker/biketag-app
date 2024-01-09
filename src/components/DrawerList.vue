<script setup lang="ts">
import BikeTagLogo from 'src/components/logo/BikeTagLogo.vue';
import { computed } from 'vue';

interface Props {
  leftDrawerOpen: boolean;
}

const emit = defineEmits(['update:leftDrawerOpen']);

const props = withDefaults(defineProps<Props>(), {
  leftDrawerOpen: false,
});

const leftDrawer = computed({
  get() {
    return props.leftDrawerOpen;
  },
  set(value) {
    emit('update:leftDrawerOpen', value);
  },
});

export interface linkProps {
  title: string;
  caption?: string;
  path?: string;
  icon?: string;
}
const essentialLinks: linkProps[] = [
  {
    title: 'Games Dashboard',
    icon: 'home',
    path: '/games',
  },
];
</script>
<template>
  <q-drawer
    v-model="leftDrawer"
    show-if-above
    bordered
    class="bg-gray-700 text-slate-400"
  >
    <q-list>
      <q-item class="justify-center items-center py-4">
        <q-item-section avatar class="flex flex-row">
          <bike-tag-logo />
          <q-item-section
            header
            class="text-black font-medium text-xl place-self-center ms-2"
            ><span class="text-2xl font-semibold text-slate-200"
              >BikeTag</span
            ></q-item-section
          >
        </q-item-section>
      </q-item>
    </q-list>
    <!-- <q-list>
        <q-item-label header class="text-slate-400 uppercase text-xs pb-0">
          Essential Links
        </q-item-label>
      </q-list> -->
    <q-list v-for="(linkList, index) in essentialLinks" :key="index">
      <router-link :to="linkList.path" v-slot="{ isActive, isExactActive }">
        <q-item
          clickable
          class="py-[0px] px-[25px]"
          :class="[
            isActive && linkList.path !== '/' && 'text-slate-200 bg-gray-600',
            isExactActive && 'text-slate-200 bg-gray-600',
          ]"
        >
          <q-item-section avatar class="p-0">
            <q-icon size="17px" :name="linkList.icon as string" />
          </q-item-section>

          <q-item-section>
            <div>
              <span class="text-sm font-medium">{{ linkList.title }}</span>
            </div>
          </q-item-section>
        </q-item>
        <q-separator />
      </router-link>
    </q-list>
  </q-drawer>
</template>
