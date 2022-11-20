<template>
   <dev>{{linesPairs}}</dev> 
</template>

<script setup lang="ts">
import { TextLine } from './text-line'
import { ContrastLinesPair } from './contrast-lines-pair'
// 定义外部参数，其他组件使用该组件时可以传的参数
interface Props {
    linesPairs: ContrastLinesPair[]
}

// https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = defineProps<Props>()
const linesPairs = props.linesPairs;

</script>