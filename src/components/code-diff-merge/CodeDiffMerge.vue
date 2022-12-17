<template>
  <div class="diff">
    <div class="diff-wrapper">
      <div class="diff-content">
        <div spellcheck="false" class="diff-page diff-page-left">
          <!-- <textarea spellcheck="false" id="old-text" v-model="originJsonData" placeholder="请输入数据..." /> -->
          <textarea v-if='displayInput' class="oldStrInput" spellcheck="false" id="old-text" v-model="oldStrInput" placeholder="请输入数据..." />
          <table class="diff-table diff-table-left">
            <tbody v-if='displayDiff' :contenteditable="contentEditable">
              <SideBySideLine v-for="(item, index) in linesPairs" :numTdOffset="numOffset" :editable="contentEditable" :groupLines="item.oldLines" :groupSize="item.oldLines.length" position="left" :groupIndex="index" @merge-lines="mergeLines" @value-change="valueChange"></SideBySideLine>
            </tbody>
          </table>
        </div>
        <div spellcheck="false" class="diff-page diff-page-right">
          <textarea v-if='displayInput' class="newStrInput" spellcheck="false" id="new-text" v-model="newStrInput" placeholder="请输入数据..." />
          <table v-if='displayDiff' class="diff-table  diff-table-right">
            <tbody :contenteditable="contentEditable">
              <SideBySideLine v-for="(item, index) in linesPairs" :numTdOffset="numOffset" :editable="contentEditable" :groupLines="item.newLines" :groupSize="item.newLines.length" position="right" :groupIndex="index" @merge-lines="mergeLines" @value-change="valueChange"></SideBySideLine>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!-- <span><br>{{ linesPairs[1].newLines[3].value }}</span> -->
  <!-- <span><br>{{ linesPairs.length }}</span> -->
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

// https://juejin.cn/post/7029339447078420493
// https://juejin.cn/post/6890545920883032071

import { getDiff, compactEmptyLines, getDiffStrFromPairs } from './code-diff-merge'
import { TextLine, EMPTY_NORMAL } from './text-line'
import { ContrastLinesPair } from './contrast-lines-pair'
import SideBySideLine from './SideBySideLine.vue'
import hljs from 'highlight.js'
import { ref, reactive, watch, toRefs, defineEmits, onMounted } from "vue";
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
  // oldString: {
  //   type: String,
  //   required: true
  // },
  // newString: {
  //   type: String,
  //   required: true
  // },
  editable: {
    type: Boolean,
    required: false,
    default: false,
  }
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
const contentEditable = ref(props.editable)

const displayDiff = ref(false);
const displayInput = ref(true);

const leftDisplay = ref("none");
const oldInputDisplay = ref("inline");

const rightDisplay = ref("none");
const newInputDisplay = ref("inline");

const oldStrInput = ref('');
const newStrInput = ref('');

const refreshDiffLines = (oldStr: string, newStr: string) => {
  let result: Array<TextLine[]> = getDiff(oldStr, newStr);
  console.log(result);

  let compactResult = compactEmptyLines(result);
  if (compactResult == null || compactResult.length == 0) {
    return;
  }
  // 最后一行占位
  let botLine: ContrastLinesPair = new ContrastLinesPair([EMPTY_NORMAL], [EMPTY_NORMAL]);
  compactResult.push(botLine);
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

  // 删除字符串最后的换行符
  oldStr = oldStr.length == 0 ? oldStr : oldStr.substring(0, oldStr.length - 1);
  newStr = newStr.length == 0 ? newStr : newStr.substring(0, newStr.length - 1);
  // console.log("refresh : old : " + oldStr);
  // console.log("refresh : newStr : " + newStr);
  refreshDiffLines(oldStr, newStr);
}

const valueChange = (pos: string, changedValue: string, pairIndex: number, lineIndex: number) => {
  console.log("changedValue " + changedValue + " pairIndex " + pairIndex + " lineIndex " + lineIndex)
}
// 在组件挂载完成后,初始化开始对比
// onMounted(() => {
//   refreshDiffLines(props.oldString, props.newString);
// })

watch(oldStrInput, (newValue) => {
  // console.log("old string update  : " + newValue);
  update();
})

watch(newStrInput, (newValue) => {
  // console.log("new  string update  : " + newValue);
  update();
})

function update() {
  if (oldStrInput.value == null || newStrInput.value == null || oldStrInput.value == '' || newStrInput.value == '') {
    return;
  }

  displayInput.value = false;
  displayDiff.value = true;

  refreshDiffLines(oldStrInput.value, newStrInput.value);
}

watch(linesPairs, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
  console.log("watch changed");
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

/* .diff-table-left {
  display: v-bind(leftDisplay);
}

.diff-table-right {
  display: v-bind(rightDisplay);
} */

.oldStrInput {
  /* display: v-bind(oldInputDisplay); */
  width: 100%;
  height: 100%;
}

.newStrInput {
  /* display: v-bind(newInputDisplay); */
  width: 100%;
  height: 100%;
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
  /* display: table; */
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
  /* overflow-x: scroll; */
  overflow-x: auto;
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
  /* display: table; */
  box-sizing: border-box;
  text-indent: initial;
  border-spacing: 2px;
  border-color: grey;
}
</style>