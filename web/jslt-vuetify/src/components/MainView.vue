<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        expand-on-hover
        rail
      >
        <v-list>
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
            title="Sandra Adams"
            subtitle="sandra_a88@gmailcom"
          ></v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list v-model:selected="selectedTabs" density="compact" nav>
          <v-list-item prepend-icon="mdi-folder" title="Execute" value="execution"></v-list-item>
          <v-list-item prepend-icon="mdi-account-multiple" title="Shared with me" value="shared"></v-list-item>
          <v-list-item prepend-icon="mdi-star" title="Starred" value="starred"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main style="height: 100vh">
        <v-card-text>
          <ExecutionsView v-if="selectedTab=='execution'"/>
          <p v-else>{{ selectedTab }}</p>
        </v-card-text>
      </v-main>
    </v-layout>
  </v-card>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import ExecutionsView from './ExecutionsView.vue'

  //
  const selectedTabs = ref(['tests'])
  const selectedTab=computed(()=>selectedTabs.value[0])

</script>
