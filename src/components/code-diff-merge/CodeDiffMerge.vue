<template>
  <div class="diff">
    <div class="diff-wrapper">
      <div class="diff-content">
        <div spellcheck="false" class="diff-page diff-page-left">
          <table class="diff-table">
            <tbody contenteditable="true">
              <SideBySideLine v-for="(item, index) in linesPairs" :numTdOffset="numOffset" :groupLines="item.oldLines" :groupSize="item.oldLines.length" position="left" :groupIndex="index" @merge-lines="mergeLines"></SideBySideLine>
            </tbody>
          </table>
        </div>
        <div spellcheck="false" class="diff-page diff-page-right">
          <table class="diff-table">
            <tbody contenteditable="true">
              <SideBySideLine v-for="(item, index) in linesPairs" :numTdOffset="numOffset" :groupLines="item.newLines" :groupSize="item.newLines.length" position="right" :groupIndex="index" @merge-lines="mergeLines"></SideBySideLine>
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

import { getDiff, compactEmptyLines, getDiffStrFromPairs } from './code-diff-merge'
import { TextLine } from './text-line'
import { ContrastLinesPair } from './contrast-lines-pair'
import SideBySideLine from './SideBySideLine.vue'
import hljs from 'highlight.js'
import { ref, reactive, toRefs, defineEmits, onMounted } from "vue";
import { LineStatus } from './line-status-enum';

const props = defineProps({
  pageWidth: {
    type: Number,
    default: 1200,
    required: false
  },
  pageHeight: {
    type: Number,
    default: 400,
    required: false
  },
  fontSize: {
    type: String,
    default: "18px",
    required: false
  },
  oldString: {
    type: String,
    required: true
  },
  newString: {
    type: String,
    required: true
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
const numOffset = ref(props.pageWidth / 2)
const widthPx = ref(props.pageWidth + "px")
const heightPx = ref(props.pageHeight + "px")

const refreshDiffLines = (oldStr: string, newStr: string) => {
  let result: Array<TextLine[]> = getDiff(oldStr, newStr);
  console.log(result);

  let compactResult = compactEmptyLines(result);
  if (compactResult == null || compactResult.length == 0) {
    return;
  }
  console.log(compactResult);
  linesPairs.value = compactResult;
}

// merge事件，子组件点即合并按钮，调用父组件，传递操作，是左向右合并还是右向左合并
const mergeLines = (pos: string, index: number) => {
  console.log("merge lines event :" + pos + " ," + index);

  let oldStr: string = '';
  let newStr: string = '';

  let pairs = linesPairs.value;
  let pairsLen = pairs.length;

  for (let i = 0; i < pairsLen; i++) {
    let oldLines = pairs[i].oldLines;
    let newLines = pairs[i].newLines;

    for (let j = 0; j < oldLines.length; j++) {
      // 不需要合并的一组 diff change
      if (i != index) {
        if (oldLines[j].status != LineStatus.EMPTY) {
          oldStr = oldStr + oldLines[j].value + '\n';
        }

        if (newLines[j].status != LineStatus.EMPTY) {
          newStr = newStr + newLines[j].value + '\n';
        }
        continue;
      }

      // 左向右合并
      if (pos == 'left' && oldLines[j].status != LineStatus.EMPTY) {
        oldStr = oldStr + oldLines[j].value + '\n';
        newStr = newStr + oldLines[j].value + '\n';
        continue;
      }

      // 右向左合并
      if (pos == 'right' && newLines[j].status != LineStatus.EMPTY) {
        oldStr = oldStr + newLines[j].value + '\n';
        newStr = newStr + newLines[j].value + '\n';
      }
    }
  }

  // console.log("refresh : old : " + oldStr);
  // console.log("refresh : newStr : " + newStr);
  refreshDiffLines(oldStr, newStr);
}

// 在组件挂载完成后,初始化开始对比
onMounted(() => {
  refreshDiffLines(props.oldString, props.newString);
})
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
  width: v-bind(widthPx);
  /* height: 400px; */
}

.diff-wrapper {
  position: relative;
  line-height: normal;
  height: v-bind(heightPx);
}

tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}

table {
  display: table;
  border-collapse: separate;
  box-sizing: border-box;
  text-indent: initial;
  border-spacing: 2px;
  border-color: grey;
}

td {
  display: table-cell;
  vertical-align: inherit;
}

tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
  border: none;
  outline: medium;
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

/* .diff-page::-webkit-scrollbar {
  display: none;
} */

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
  /* table-layout : fixed ; */
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