<!--
 * @moduleName: 下拉树组件
 * @Author: dawdler
 * @Date: 2018-12-19 14:03:03
 * @LastModifiedBy: dawdler
 * @LastEditTime: 2019-09-30 20:56:46

 2019-12-18 lwx
    1、去掉方法 _setMultipleFun() 的实现，没有必要根据value的类型确定单选/多选，根据外界传入的参数确定即可
    2、去掉 el-popover 的 属性 :width="width" 自动撑开即可
    3、修改tree勾选方法 _treeCheckFun 添加判断 `只有叶子节点的id才加入数组ids` !item[propsChildren] || item[propsChildren].length == 0
    4、修改输出方法 _emitFun 添加第二个输出项 labels
    5、修改tree勾选方法 _treeCheckFun 添加 this.labels.push(item[propsLabel]) 因为发现虽然通过监听`id`的变化labels也会得到相应的变化
        但是实际上`id`监听方法的调用在 _emitFun()后面，造成输出项 labels 内容更新不及时
    6、修改方法 _setSelectNodeFun 在labels中过滤掉非叶子节点的名称
    7、修改方法 _selectRemoveTag 实现
    8、添加自有属性 names 用于在select中显示
    9、修改created 方法实现
    10、_treeNodeClickFun 修改node点击事件（多选不能点击）
 -->
<template>
  <div class="el-tree-select" :class="selectClass">
    <!-- 下拉文本 -->
    <el-select
      :style="styles"
      size="small"
      class="el-tree-select-input"
      v-model="names"
      :disabled="disabled"
      popper-class="select-option"
      ref="select"
      v-bind="selectParams"
      :popper-append-to-body="false"
      :filterable="false"
      :multiple="selectParams.multiple"
      v-popover:popover
      @remove-tag="_selectRemoveTag"
      :title="names"
      @clear="_selectClearFun"
      @focus="_popoverShowFun"
    >
    </el-select>
    <!-- 弹出框 -->
    <el-popover
      ref="popover"
      :placement="placement"
      :popper-class="popperClass"
      v-model="visible"
      trigger="click"
    >
      <!-- 是否显示搜索框 -->
      <el-input
        v-if="treeParams.filterable"
        v-model="keywords"
        size="mini"
        class="input-with-select mb10"
        @change="_searchFun"
      >
        <el-button
          @click="_searchFun"
          slot="append"
          icon="el-icon-search"
        ></el-button>
      </el-input>
      <el-scrollbar
        tag="div"
        wrap-class="el-select-dropdown__wrap"
        view-class="el-select-dropdown__list"
        class="is-empty"
      >
        <!-- v-bind="treeParams" -->
        <!-- 树列表 -->
        <el-tree
          ref="tree"
          v-bind="treeParams"
          v-if="treeParams.data.length > 0"
          :data="treeParams.data"
          :node-key="propsValue"
          :draggable="false"
          :current-node-key="ids.length > 0 ? ids[0] : ''"
          :show-checkbox="selectParams.multiple"
          :filter-node-method="_filterFun"
          :render-content="treeRenderFun"
          @node-click="_treeNodeClickFun"
          @check="_treeCheckFun"
        ></el-tree>
        <!-- 暂无数据 -->
        <div v-if="treeParams.data.length === 0" class="no-data">暂无数据</div>
      </el-scrollbar>
    </el-popover>
  </div>
</template>
<style>
.el-tree-select .select-option {
  display: none !important;
}

[aria-disabled="true"] > .el-tree-node__content {
  color: inherit !important;
  background: transparent !important;
  cursor: no-drop !important;
}

.el-tree-select-popper {
  max-height: 400px;
  overflow: auto;
}
.el-tree-select-popper.disabled {
  display: none !important;
}
.el-tree-select-popper .el-button--small {
  width: 25px !important;
  min-width: 25px !important;
}

.el-tree-select-popper[x-placement^="bottom"] {
  margin-top: 5px;
}

.mb10 {
  margin-bottom: 10px;
}

.no-data {
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  color: #cccccc;
  text-align: center;
}
</style>
<script>
import { on, off } from "../utils/dom";
// import { each } from '../utils/utils';
// @group api
export default {
  name: "ElTreeSelect",
  props: {
    // v-model,存储的是treeParams.data里面的id
    value: {
      // `String` / `Array` / `Number`
      type: [String, Array, Number],
      // `''`
      default() {
        return "";
      }
    },
    // el-select样式
    styles: {
      type: Object,
      // {}
      default() {
        return {};
      }
    },
    // 下拉框 挂类
    selectClass: {
      type: String,
      default() {
        return "";
      }
    },
    // popover 挂类
    popoverClass: {
      type: String,
      default() {
        return "";
      }
    },
    // 是否禁用文本框
    disabled: {
      type: Boolean,
      // false
      default() {
        return false;
      }
    },
    // 弹出框位置
    placement: {
      type: String,
      //  bottom
      default() {
        return "bottom";
      }
    },
    // 树渲染方法，具体参考el-tree Function(h, { node, data, store }) {}
    treeRenderFun: Function,
    /*
        文本框参数，几乎支持el-select所有的API<br>
        取消参数：<br>
        设定下拉框的弹出框隐藏：<br>
        `:popper-append-to-body="false"` <br>
        搜索从弹出框里面执行： <br>
        `:filterable="false"`
        */
    selectParams: {
      type: Object,
      /*
            Object默认参数：<br><br>
            是否可以清空选项：<br>
            `clearable: true,`<br><br>
            是否禁用：<br>
            `disabled: false,`<br><br>
            搜索框placeholder文字：<br>
            `placeholder: '请选择',`<br><br>
            */
      default() {
        return {
          clearable: true,
          disabled: false,
          placeholder: "请选择"
        };
      }
    },
    /*
        下拉树参数，几乎支持el-tree所有的API<br>
         取消参数:<br>
        `:show-checkbox="selectParams.multiple"`<br>
        使用下拉框参数multiple判断是否对树进行多选<br>
        取消对el-tree的人为传参show-checkbox<br>
        `:node-key="propsValue"`     自动获取treeParams.props.value<br>
        `:draggable="false"`         屏蔽拖动
        */
    treeParams: {
      type: Object,
      /*
            Object默认参数：<br><br>
            在有子级的情况下是否点击父级关闭弹出框,false 只能点击子级关闭弹出框：`clickParent: false`<br><br>
            是否显示搜索框：<br>
            `filterable: false`<br><br>
            下拉树的数据：<br>
            `data:[]`<br><br>
            下拉树的props：<br>
            `props: {`<br>
                `children: 'children',`<br>
                `label: 'name',`<br>
                `value: 'flowId',`<br>
                `disabled: 'disabled'`<br>
            `}`
            */
      default() {
        return {
          clickParent: false,
          filterable: false,
          data: [],
          props: {
            children: "children",
            label: "name",
            code: "code",
            value: "flowId",
            disabled: "disabled"
          }
        };
      }
    }
  },
  data() {
    return {
      propsValue: "flowId",
      propsLabel: "name",
      propsCode: null, // 可能有空的情况
      propsDisabled: "disabled",
      propsChildren: "children",
      data: [],
      keywords: "",
      labels: "", // 存储名称，用于下拉框显示内容
      ids: [], // 存储id
      names: "", // 存储名称，用户在select中显示
      selectNodes: [], // 选中数据
      visible: false, // popover v-model
      width: 150
    };
  },
  watch: {
    ids: function(val) {
      if (val !== undefined) {
        this._setSelectNodeFun(val);
      }
    },
    value: function(val) {
      if (this.ids !== val) {
        this._setMultipleFun();
        if (this.selectParams.multiple) {
          this.ids = [...val];
        } else {
          this.ids = val === "" ? [] : [val];
        }
      }
    }
  },
  computed: {
    popperClass() {
      let _c = "el-tree-select-popper " + this.popoverClass;
      return this.disabled ? _c + " disabled " : _c;
    }
  },
  created() {},
  mounted() {
    const { props, data } = this.treeParams;
    this._setMultipleFun();
    this.propsValue = props.value;
    this.propsLabel = props.label;
    this.propsCode = props.code || null; // 可能为空
    this.propsDisabled = props.disabled;
    this.propsChildren = props.children;
    this.$nextTick(() => {
      this.data = data.length > 0 ? [...data] : [];
    });
    if (this.selectParams.multiple) {
      this.labels = [];
      this.names = [];
      // this.ids = this.value;
      this.ids = this.value instanceof Array ? this.value : [this.value];
    } else {
      // this.labels = "";
      // this.names = "";

      this.ids = this.value instanceof Array ? this.value : [this.value];
      // let obj = this.getObj(this.data, this.value);
      // this.names = obj.textbookName;
    }

    this._updateH();
    this.$nextTick(() => {
      on(document, "mouseup", this._popoverHideFun);
    });
  },
  beforeUpdate() {
    // console.log("ppp");
    const { props, data } = this.treeParams;
    this.propsValue = props.value;
    this.propsLabel = props.label;
    this.data = data.length > 0 ? [...data] : [];
    let obj = this.getObj(this.data, this.value);
    if (obj.textbookName) {
      this.names = obj.textbookName;
    } else {
    }
  },
  methods: {
    getObj(arr, id) {
      let obj = {};
      arr.forEach(item => {
        if (item.textbookId == id) {
          obj = item;
        }
      });
      return obj;
    },
    // 根据类型判断单选，多选
    _setMultipleFun() {
      // let multiple = false;
      // if (this.value instanceof Array) {
      //     multiple = true;
      // }
      // this.$set(this.selectParams, 'multiple', multiple);
    },
    // 输入文本框输入内容抛出
    _searchFun() {
      /*
            对外抛出搜索方法，自行判断是走后台查询，还是前端过滤<br>
            前端过滤：this.$refs.treeSelect.$refs.tree.filter(value);<br>
            后台查询：this.$refs.treeSelect.treeDataUpdateFun(data);
            */
      this.$emit("searchFun", this.keywords);
    },
    //  根据id筛选当前树名称，以及选中树列表
    _setSelectNodeFun(ids) {
      const el = this.$refs.tree;
      if (!el) {
        // throw new Error("找不到tree dom");
      }
      const { multiple } = this.selectParams;
      // 长度为0，清空选择
      if (ids.length === 0 || this.data.length === 0) {
        this.labels = multiple ? [] : "";
        this.names = multiple ? [] : "";
        if (multiple) {
          if (el) {
            el.setCheckedKeys([]);
          }
        } else {
          if (el) {
            el.setCurrentKey(null);
          }
        }
        return;
      }
      if (multiple) {
        if (el) {
          el.setCheckedKeys(ids);
        }
        if (this.propsCode) {
          // 如果有code   labels=code(name)
          this.labels =
            el
              .getCheckedNodes()
              .map(item =>
                item[this.propsCode]
                  ? item[this.propsLabel] + "(" + item[this.propsCode] + ")"
                  : item[this.propsLabel]
              ) || [];
        } else {
          // this.labels = el.getCheckedNodes().map(item => item[this.propsLabel]) || []
          let count = 0;
          let arr = [];
          if (el) {
            arr = el.getCheckedNodes().map(item => {
              if (
                !item[this.propsChildren] ||
                item[this.propsChildren].length == 0
              ) {
                count++;
                return item[this.propsLabel];
              }
            });
          }
          this.labels = arr || [];
          this.names = [];
          console.log("count", count);
          if (count > 0) {
            this.names = [count + "个已选中"];
            console.log("names", this.names);
          }
        }
      } else {
        el.setCurrentKey(ids[0]);
        if (el.getCurrentNode()) {
          if (this.propsCode) {
            // 如果有code   labels=code(name)
            this.labels = el.getCurrentNode()[this.propsCode]
              ? el.getCurrentNode()[this.propsLabel] +
                "(" +
                el.getCurrentNode()[this.propsCode] +
                ")"
              : el.getCurrentNode()[this.propsLabel];
          } else {
            this.labels = el.getCurrentNode()[this.propsLabel];
            this.names = el.getCurrentNode()[this.propsLabel];
          }
        } else {
          this.labels = "";
          this.names = "";
        }
      }
      this._updatePopoverLocationFun();
    },
    // 更新popover位置
    _updatePopoverLocationFun() {
      // dom高度还没有更新，做一个延迟
      const el = this.$refs.popover;
      setTimeout(() => {
        if (el) {
          // this.$refs.popover.updatePopper();
        }
      }, 50);
    },
    // 获取MouseEvent.path 针对浏览器兼容性兼容ie11,edge,chrome,firefox,safari
    _getEventPath(evt) {
      const path = (evt.composedPath && evt.composedPath()) || evt.path;
      const target = evt.target;
      if (path != null) {
        return path.indexOf(window) < 0 ? path.concat(window) : path;
      }
      if (target === window) {
        return [window];
      }
      function getParents(node, memo) {
        memo = memo || [];
        const parentNode = node.parentNode;
        if (!parentNode) {
          return memo;
        } else {
          return getParents(parentNode, memo.concat(parentNode));
        }
      }
      return [target].concat(getParents(target), window);
    },
    // 树过滤
    _filterFun(value, data, node) {
      if (!value) return true;
      return data[this.propsLabel].indexOf(value) !== -1;
    },
    // 树点击
    _treeNodeClickFun(data, node, vm) {
      const { multiple } = this.selectParams;
      const { clickParent } = this.treeParams;
      const { propsValue, propsChildren, propsDisabled } = this;
      if (multiple) {
        return;
      }
      if (data[propsDisabled]) {
        // 禁用
        return;
      }
      if (node.checked) {
        const value = data[this.propsValue];
        this.ids = this.ids.filter(id => id !== value);
      } else {
        if (!multiple) {
          // 多选，不关闭，单选，判断是否允许点击父级关闭弹出框
          if (!clickParent) {
            const children = data[propsChildren];
            // 如果不允许点击父级,自身为末级，允许点击之后关闭
            if (!children || children.length === 0) {
              this.ids = [data[propsValue]];
              this.visible = false;
            } else {
              // 不允许父级，阻止继续派发
              return false;
            }
          } else {
            this.ids = [data[propsValue]];
            this.visible = false;
          }
        } else {
          this.ids.push(data[propsValue]);
        }
      }
      this._emitFun();
      /*
            点击节点，对外抛出   `data, node, vm`<br>
            `data:` 当前点击的节点数据<br>
            `node:` 当前点击的node<br>
            `vm:` 当前组件的vm
            */
      this.$emit("node-click", data, node, vm);
    },
    // 树勾选
    _treeCheckFun(data, node, vm) {
      this.ids = [];
      this.labels = [];
      const { propsValue, propsLabel, propsChildren } = this;
      node.checkedNodes.forEach(item => {
        if (!item[propsChildren] || item[propsChildren].length == 0) {
          this.ids.push(item[propsValue]);
          this.labels.push(item[propsLabel]);
        }
      });
      /*
            点击复选框，对外抛出   `data, node, vm`<br>
            `data:` 当前点击的节点数据<br>
            `node:` 当前点击的node<br>
            `vm:` 当前组件的vm
            */
      this.$emit("check", data, node, vm);
      this._emitFun();
    },
    // 下拉框移除tag时触发
    _selectRemoveTag(tag) {
      // const { data, propsValue, propsLabel, propsChildren } = this;
      // each(
      //     data,
      //     item => {
      //         if (item[propsLabel] === tag) {
      //             const value = item[propsValue];
      //             this.ids = this.ids.filter(id => id !== value);
      //         }
      //     },
      //     propsChildren
      // );
      this.ids = [];
      this.labels = [];
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(this.ids);
      }
      this.$emit("removeTag", this.ids, tag);
      this._emitFun();
    },
    // 下拉框清空数据
    _selectClearFun() {
      this.ids = [];
      const { multiple } = this.selectParams;
      // 下拉框清空，对外抛出``this.$emit('input', multiple ? [] : '');`
      this.$emit("input", multiple ? [] : "");
      // 下拉框清空，对外抛出``this.$emit('select-clear');`
      this.$emit("select-clear");
      this._updatePopoverLocationFun();
    },
    // 判断类型，抛出当前选中id
    _emitFun() {
      const { multiple } = this.selectParams;
      this.$emit(
        "input",
        multiple ? this.ids : this.ids.length > 0 ? this.ids[0] : "",
        this.labels
      );
      this._updatePopoverLocationFun();
    },
    // 更新宽度
    _updateH() {
      this.$nextTick(() => {
        this.width = this.$refs.select.$el.getBoundingClientRect().width;
      });
    },
    // 显示弹出框的时候容错，查看是否和el宽度一致
    _popoverShowFun(val) {
      this._updateH();
    },
    // 判断是否隐藏弹出框
    _popoverHideFun(e) {
      const path = this._getEventPath(e);
      let isInside = path.some(list => {
        // 鼠标在弹出框内部，阻止隐藏弹出框
        return (
          list.className &&
          typeof list.className === "string" &&
          list.className.indexOf("el-tree-select") !== -1
        );
      });
      if (!isInside) {
        this.visible = false;
      }
    },
    /**
     * @vuese
     * 树列表更新数据
     * @arg Array
     */
    treeDataUpdateFun(data) {
      this.data = data;
      // 数据更新完成之后，判断是否回显内容
      if (data.length > 0) {
        setTimeout(() => {
          this._setSelectNodeFun(this.ids);
        }, 300);
      }
    },

    /**
     * @vuese
     * 本地过滤方法
     * @arg String
     */
    filterFun(val) {
      this.$refs.tree.filter(val);
    }
  },
  components: {},
  beforeDestroy() {
    off(document, "mouseup", this._popoverHideFun);
  }
};
</script>
