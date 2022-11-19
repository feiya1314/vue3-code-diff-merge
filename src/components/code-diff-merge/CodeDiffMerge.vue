<template>
    <button @click="diffText('abc \n abd\nbcd\nacd\n123')">code diff</button>

</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

// https://juejin.cn/post/7029339447078420493
// https://juejin.cn/post/6890545920883032071

import { getDiff, compactEmptyLines } from './code-diff-merge'
import { TextLine } from './text-line'

const diffText = (data: string) => {
    let result: Array<TextLine[]> = getDiff("abc \n abc\nbbd\n123", data);
    console.log(result);

    let compactResult = compactEmptyLines(result);
    console.log(compactResult);
}

</script>