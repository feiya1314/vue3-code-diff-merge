<template>
    <dev>{{ linessPairs }}</dev>
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
const linessPairs = props.linesPairs;

</script>

<!-- 
<script lang="ts">
import { defineComponent, ref } from 'vue'
import son from './components/son.vue'

export default defineComponent({
    components: { son },
    setup () {
      const parentValue = ref('父组件传给子组件的值')
      return { parentValue }
    }
  })
  </script> -->