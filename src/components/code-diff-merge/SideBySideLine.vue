<template>
  <table>
    <tr v-for="line in linesPair.oldLines">
      <td>{{ line.value }}</td>
      <td>{{ line.index }}</td>
    </tr>
  </table>
  <span>{{ numb }}</span>
  <!-- <span>{{cnumb}}</span> -->
</template>

<script setup lang="ts">
import { TextLine } from './text-line'
import { ContrastLinesPair } from './contrast-lines-pair'
import { ref, reactive, toRefs, computed } from "vue";
// 定义外部参数，其他组件使用该组件时可以传的参数


// https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = defineProps({
  linesPair: {
    type: ContrastLinesPair,
    required: true
  },
  numb: {
    type: Number,
    required: true
  },
});
// Vue3，什么情况下数据会丢失响应式呢？ https://blog.csdn.net/weixin_46683645/article/details/125977313

// 此时 下面的 cnumb 已经不是响应式的了
// const cnumb = props.numb;

// 此时 下面的 oldLines 已经不是响应式的了
// const clinesPair = props.linesPair;
// const oldLines: TextLine[] = props.linesPair.oldLines;

// 如果父组件传过来的属性不需要改变，则直接用即可，如果需要根据传过来的值做处理，可以用 computed 函数
// const cnumb = computed(() => props.numb + 100)
// const coldLines = computed(() => props.linesPair.oldLines)

// 或者使用toRefs，否则将失去响应式
const { linesPair, numb } = toRefs(props);
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