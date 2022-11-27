<template>
  <button @click="doDiffText('abc \n abd\nbcd\nacd\n123')">code diff</button>

  <div class="diff">
    <div class="diff-wrapper">
      <div class="diff-content">
        <div class="diff-page diff-page-left">
          <table class="diff-table">
            <tbody>
              <SideBySideLine v-for="(item, index) in linesPairs" :groupLines="item.oldLines" :groupSize="item.oldLines.length" position="left" :groupIndex="index"></SideBySideLine>
            </tbody>
          </table>
        </div>
        <div class="diff-page diff-page-right">
          <table class="diff-table">
            <tbody>
              <SideBySideLine v-for="(item, index) in linesPairs" :groupLines="item.newLines" :groupSize="item.newLines.length" position="right" :groupIndex="index"></SideBySideLine>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
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

const props = defineProps({
  pageWidth: {
    type: String,
    default: "1200px",
    required: false
  },
  pageHeight: {
    type: String,
    default: "400px",
    required: false
  },
  fontSize: {
    type: String,
    default: "18px",
    required: false
  },
  oldString: {
    type: String,
    required: false
  },
  newString: {
    type: String,
    required: false
  },
});

// 定义外部参数，其他组件使用该组件时可以传的参数
// https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
// const props = defineProps({
//     foo: { type: String, required: true },
//     bar: Number
// })

// const diffText = ref('');
// const linesPair: ContrastLinesPair = reactive(new ContrastLinesPair(new Array(), new Array()));
const linesPairs = ref(new Array<ContrastLinesPair>());
// const num = ref(0);
const doDiffText = (data: string) => {
  let result: Array<TextLine[]> = getDiff("abc \n abc\nbbd\n123", data);
  console.log(result);

  let compactResult = compactEmptyLines(result);
  if (compactResult == null || compactResult.length == 0) {
    return;
  }
  console.log(compactResult);
  linesPairs.value = compactResult;

  // linesPair.newLines = compactResult[1].newLines;
  // linesPair.oldLines = compactResult[1].oldLines;
  // num.value = compactResult[1].newLines.length;
  // console.log(num.value);
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
<style>
.diff {
  width: v-bind(pageWidth);
  /* height: 400px; */
}

.diff-wrapper {
  position: relative;
  line-height: normal;
  height: v-bind(pageHeight);
}

.diff-content {
  display: flex;
  width: 100%;
  height: 100%;
}

.diff-page {
  display: inline-block;
  overflow-x: scroll;
  /* overflow-x: auto; */
  overflow-y: hidden;
  width: 50%;

}

.diff-page-left {
  text-align: left;
  margin-bottom: -8px;
}

.diff-page-right {
  text-align: left;
  margin-bottom: -8px;
}

.diff-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Menlo, Consolas, monospace;
  font-size: v-bind(fontSize);
}

.diff-wrapper tr {
  height: 20px;
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}

.diff-wrapper table {
  display: table;
  box-sizing: border-box;
  text-indent: initial;
  border-spacing: 2px;
  border-color: grey;
}
</style>