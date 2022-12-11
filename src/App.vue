<template>
  <TestComp />
  <CodeDiffMerge :old-string="oldStr" :new-string="newStr"/>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// https://juejin.cn/post/7029339447078420493
// https://juejin.cn/post/6890545920883032071

import { TestComp, CodeDiffMerge } from './components/index'
import { ref, reactive, toRefs, defineEmits } from "vue";
const oldStr = ref("abc \n abc\nbbd\n123333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333");
const newStr = ref("abc \n abd\nbcd\nacd\n12333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333");

</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
