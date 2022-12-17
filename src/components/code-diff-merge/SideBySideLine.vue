<template>
  <tr v-for="(n, index) in groupSize">

    <!-- -------------------- 右侧 文本列行号 开始------------------------>
    <td contenteditable="false" v-if="position == 'right' && groupLines[index].status == LineStatus.ADD" class="line-num-right line-num line-add">
      {{ groupLines[index].index }}
      <span v-if="index == 0" @click="$emit('merge-lines', 'right', groupIndex)"> <b style="color: #000000;">«&nbsp;</b></span>
      <span v-if="index > 0"> &nbsp;&nbsp; </span>
    </td>

    <td contenteditable="false" v-if="position == 'right' && groupLines[index].status == LineStatus.EMPTY" class="line-num-right line-num line-empty" />

    <td contenteditable="false" v-if="position == 'right' && groupLines[index].status == LineStatus.NORMAL" class="line-num-right line-num line-normal">
      {{ groupLines[index].index }}
      &nbsp;&nbsp;
    </td>
    <!-- -------------------- 右侧 文本列行号 结束------------------------>

    <!-- 添加行diff状态符号 + 或者 — -->
    <td contenteditable="false" v-if="groupLines[index].status == LineStatus.ADD" class="change-symbol line-prefix line-add">
      <div :class="position == 'right' ? 'change-symbol-right' : 'change-symbol-left'">
        <span class="line-prefix line-add" v-if="groupLines[index].status == LineStatus.ADD">&nbsp;+&nbsp;</span>
      </div>
    </td>
    <td contenteditable="false" v-if="groupLines[index].status == LineStatus.REMOVED" class="change-symbol line-prefix line-del">
      <div :class="position == 'right' ? 'change-symbol-right' : 'change-symbol-left'">
        <span class="line-prefix line-del">&nbsp;-&nbsp;</span>
      </div>
    </td>
    <td contenteditable="false" v-if="groupLines[index].status == LineStatus.EMPTY" class="change-symbol line-prefix line-empty">
      <div :class="position == 'right' ? 'change-symbol-right' : 'change-symbol-left'">
        <span class="line-prefix line-empty">&nbsp;&nbsp;&nbsp;</span>
      </div>
    </td>
    <td contenteditable="false" v-if="groupLines[index].status == LineStatus.NORMAL" class="change-symbol line-prefix line-normal">
      <div :class="position == 'right' ? 'change-symbol-right' : 'change-symbol-left'">
        <span class="line-prefix line-normal">&nbsp;&nbsp;&nbsp;</span>
      </div>
    </td>

    <!-- -----------------------  文本列填充实际值 开始 -------------------------------------------------- -->
    <td v-if="groupLines[index].status == LineStatus.REMOVED" class="line-value line-del">
      <div class="line-value-wapper" :class="position == 'right' ? 'line-value-wapper-right' : 'line-value-wapper-left'">
        <!-- <span @input="valueChanged($event, position, groupIndex, index)" class="line-ctn">{{ groupLines[index].value }}</span> -->
        <span @change="valueChanged($event, position, groupIndex, index)" class="line-ctn">{{ groupLines[index].value }}</span>
      </div>
    </td>

    <td v-if="groupLines[index].status == LineStatus.ADD" class="line-value line-add">
      <div class="line-value-wapper" :class="position == 'right' ? 'line-value-wapper-right' : 'line-value-wapper-left'">
        <!-- <span @input="valueChanged($event, position, groupIndex, index)" class="line-ctn">{{ groupLines[index].value }}</span> -->
        <span @change="valueChanged($event, position, groupIndex, index)" class="line-ctn">{{ groupLines[index].value }}</span>
      </div>
    </td>

    <td contenteditable="false" v-if="groupLines[index].status == LineStatus.EMPTY" class="line-value line-empty">
      <div class="line-value-wapper">
        <span class="line-ctn"></span>
      </div>
    </td>

    <td v-if="groupLines[index].status == LineStatus.NORMAL" class="line-value line-normal">
      <div class="line-value-wapper" :class="position == 'right' ? 'line-value-wapper-right' : 'line-value-wapper-left'">
        <!-- <span @input="valueChanged($event, position, groupIndex, index)" class="line-ctn">{{ groupLines[index].value }}</span> -->
        <span @change="valueChanged($event, position, groupIndex, index)" class="line-ctn">{{ groupLines[index].value }}</span>
      </div>
    </td>
    <!-- -------------------- 文本列处理 结束------------------------>

    <!-- -------------------- 左侧 文本列行号 开始------------------------>
    <td contenteditable="false" v-if="position == 'left' && groupLines[index].status == LineStatus.REMOVED" class="line-num-left line-num line-del">
      <span v-if="index == 0" @click="$emit('merge-lines', 'left', groupIndex)"> <b style="color: #000000;">&nbsp;» </b></span>
      <span v-if="index > 0"> &nbsp;&nbsp; </span>
      {{ groupLines[index].index }}
    </td>

    <td contenteditable="false" v-if="position == 'left' && groupLines[index].status == LineStatus.EMPTY" class="line-num-left line-num line-empty" />

    <td contenteditable="false" v-if="position == 'left' && groupLines[index].status == LineStatus.NORMAL" class="line-num-left line-num line-normal">
      &nbsp;&nbsp;
      {{ groupLines[index].index }}
    </td>
    <!-- -------------------- 左侧 文本列行号 结束------------------------>
  </tr>
  <!-- <span>{{cnumb}}</span> -->
</template>

<script setup lang="ts">
import { TextLine } from './text-line'
import { ContrastLinesPair } from './contrast-lines-pair'
import { ref, reactive, toRefs, computed, defineEmits } from "vue";
import { LineStatus } from './line-status-enum'
// 定义外部参数，其他组件使用该组件时可以传的参数

// https://cn.vuejs.org/guide/typescript/composition-api.html#typing-component-props
const props = defineProps({
  groupLines: {
    type: Array<TextLine>,
    required: true
  },
  groupSize: {
    type: Number,
    required: true
  },
  groupIndex: {
    type: Number,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  numTdOffset: {
    type: Number,
    required: true
  },
  editable: {
    type: Boolean,
    required: true
  }
});

// 或者使用toRefs，否则将失去响应式
const { groupLines, groupSize, groupIndex, position, numTdOffset, editable } = toRefs(props);
const numOffsetPx = numTdOffset.value + "px"

const groupLinesInner = groupLines;
// 注册父组件监听的事件
const emit = defineEmits(['merge-lines', 'value-change']);

function valueChanged(e: Event, pos: string, pairIndex: number, lineIndex: number) {
  if (editable.value != true) {
    console.log("not editable");
  }
  // let changedValue: string  = e.currentTarget;
  let changedValue: string = '';
  console.log("vlaue cahnaged")
  emit('value-change', pos, changedValue, pairIndex, lineIndex)
}
console.log("offseepx" + numOffsetPx)
console.log("numTdOffset " + numTdOffset.value)
// Vue3，什么情况下数据会丢失响应式呢？ https://blog.csdn.net/weixin_46683645/article/details/125977313

// 此时 下面的 cnumb 已经不是响应式的了
// const cnumb = props.numb;

// 此时 下面的 oldLines 已经不是响应式的了
// const clinesPair = props.linesPair;
// const oldLines: TextLine[] = props.linesPair.oldLines;

// 如果父组件传过来的属性不需要改变，则直接用即可，如果需要根据传过来的值做处理，可以用 computed 函数
// const cnumb = computed(() => props.numb + 100)
// const coldLines = computed(() => props.linesPair.oldLines)
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
<style>
.line-prefix {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.line-value {
  width: calc(100%-3em);
}

.read-only {
  pointer-events: none;
}

.change-symbol-right {
  margin-left: 3em;
}

/* span::before{

} */
.line-value-span {
  cursor: text;
}

.line-value-wapper {
  width: 100%;
}

.line-value-wapper-left {
  margin-right: 3.5em;
}

.line-value-wapper-right {
  margin-right: 0.5em;
}

.line-num {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /* position: absolute;
  display: inline-block; */
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 3em;
  background-color: #fff;
  color: rgba(0, 0, 0, .3);

  border: solid #eee;
  /* border-width: 0 1px; */
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  /* height: 20px; */
  position: absolute;
  height: -webkit-fill-available;
  margin-bottom: 0.5em;
}

.line-num-right {
  /* padding-right: 0.5em; */
  text-align: right;
  left: v-bind(numOffsetPx);
  border-left-width: 0px;
  border-right-width: 1px;
  border-top-width: 0px;
  border-bottom-width: 0px;
}

.line-num-left {
  /* padding-left: 0.5em; */
  text-align: left;
  right: v-bind(numOffsetPx);
  border-left-width: 1px;
  border-right-width: 0px;
  border-top-width: 0px;
  border-bottom-width: 0px;
}

.line-del {
  background-color: #fee8e9;
  border-color: #e9aeae;
}

.line-empty {
  background-color: #f8fafd;
  color: rgba(0, 0, 0, .3);
  border-color: #d5e4f2;
}

.line-add {
  background-color: #dfd;
  border-color: #b4e2b4;
}
</style>