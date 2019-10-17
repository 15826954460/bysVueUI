#### 组件使用说明

##### step

1. npm install WheelPicker

```js
// 基本用法(一次封装))
import WheelPicker from 'WheelPicker';
export default {
  components: { WheelPicker },
}
```

2. 相关参数

| 参数 | 是否必须  | 参数值 |  默认值 |
|:-----------:| :-------------:| :-------------:| :-------------:| 
| data | 是  | Array | [] |

3. 事件

| 事件名称 | 说明  |
|:-----------:| :-------------|
| change | 用户选择的时候触发 返回参数为 gIndex => 当前选择列的下标 iIndex => 当前选中 值所对应的下表 |

4. 组件对外暴露的方法（使用年月日联动的时候回用到，如果只有年月选择据不会被触发）

| 事件名称 | 说明  |
|:-----------| :-------------|
| setGroupData | 根据用户选择的年月日进行对应日的改变，如果只有年月改方法不会执行 |
| getGroupsRectList | 重新初始化每一个元素 通过 getBoundingClientRect() 获取的信息  |
| getInitialCurrentIndexList | 初始每一列数据的下表的列表 |


// 基本用法(一次封装))