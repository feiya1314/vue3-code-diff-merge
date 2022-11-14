/**
* 导出 所有 组件 ,后续需要扩展其他组件，按照 code-diff-nerge 的结构进行开发，并且在 index.ts 文件中 components 组件列表添加即可。
* https://blog.csdn.net/tglsaturn/article/details/120831892?spm=1001.2101.3001.6650.4&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-4-120831892-blog-121468996.pc_relevant_3mothn_strategy_recovery&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-4-120831892-blog-121468996.pc_relevant_3mothn_strategy_recovery&utm_relevant_index=5
* https://juejin.cn/post/7111221570034466853
* https://www.51cto.com/article/715946.html
* 
* 单独 export 的组件的 index 需要 有 install，最外层 index 直接export 组件的 export
* 全量的export 需要在外层 index 都 install
*/
// 使用 import {A} 这种形式，被导入的代码中，必须指定的 export A
// 使用 import A 这种形式，被导入的代码中 export default 被导入，且 import A 的A可以换成自定义的名字
// https://blog.csdn.net/function__/article/details/79040111

import TestComp from './test-comp/index'
import CodeDiffMerge from './code-diff-merge/index'

export { TestComp, CodeDiffMerge }

// export default {TestComp,tstt}

