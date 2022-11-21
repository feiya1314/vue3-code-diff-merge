<template>
    <button @click="doDiffText('abc \n abd\nbcd\nacd\n123')">code diff</button>

    <div>
        <span>{{ diffText }}</span>
    </div>

    <SideBySideLine :linesPairs="linesPairs"></SideBySideLine>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

// https://juejin.cn/post/7029339447078420493
// https://juejin.cn/post/6890545920883032071

import { getDiff, compactEmptyLines } from './code-diff-merge'
import { TextLine } from './text-line'
import { ContrastLinesPair } from './contrast-lines-pair'
import SideBySideLine from './SideBySideLine.vue'
import hljs from 'highlight.js'
import { ref, reactive, toRefs } from "vue";

// 定义外部参数，其他组件使用该组件时可以传的参数
// https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
// const props = defineProps({
//     foo: { type: String, required: true },
//     bar: Number
// })

const diffText = ref('');
const linesPairs: ContrastLinesPair[] = reactive(new Array<ContrastLinesPair>());
const doDiffText = (data: string) => {
    let result: Array<TextLine[]> = getDiff("abc \n abc\nbbd\n123", data);
    console.log(result);

    let compactResult = compactEmptyLines(result);
    console.log(compactResult);

    if (compactResult[0][0].value != null) {
        diffText.value = hljs.highlightAuto(compactResult[0][0].value).value;
    }

    let pair = new ContrastLinesPair(compactResult[0], compactResult[1]);
    linesPairs.push(pair);
}

</script>

<!-- 上面的script是下面的简化版 -->
<!-- <script> 
import { ref } from 'vue'

https://cn.vuejs.org/api/composition-api-setup.html#basic-usage
export default {
       title: String
  },
  setup(props) {

    const count = ref(0)

    // 返回值会暴露给模板和其他的选项式 API 钩子
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script> -->