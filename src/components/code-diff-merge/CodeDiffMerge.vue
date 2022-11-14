<template>
    <button  @click="diffText('你好 abc')">code diff</button>
    
 </template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

// https://juejin.cn/post/7029339447078420493
// https://juejin.cn/post/6890545920883032071

import { getDiff } from './code-diff-merge'


const diffText = (data:string)=>{
    getDiff("abc",data)
}

</script>