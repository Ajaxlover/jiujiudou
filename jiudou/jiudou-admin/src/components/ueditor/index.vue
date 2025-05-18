<template>
  <vue-ueditor-wrap
    :config="myConfig"
    v-model="copyContent"
    :editor-id="editorId"
  ></vue-ueditor-wrap>
</template>

<script>
import VueUeditorWrap from "vue-ueditor-wrap";

export default {
  name: "Editor",
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      editorId: `editor-${new Date().getTime()}`, //唯一id,防止editor缓存
      copyContent: ""
    };
  },
  props: {
    // 富文本高度
    initialFrameHeight: {
      type: Number,
      default() {
        return 400;
      }
    },
    toolbars: {
      type: Array,
      default() {
        return [
          [
            "fullscreen",
            "source",
            "|",
            "undo",
            "redo",
            "|",
            "bold",
            "italic",
            "underline",
            "fontborder",
            "strikethrough",
            "superscript",
            "subscript",
            "removeformat",
            "formatmatch",
            "autotypeset",
            "blockquote",
            "pasteplain",
            "|",
            "forecolor",
            "backcolor",
            "insertorderedlist",
            "insertunorderedlist",
            "selectall",
            "cleardoc",
            "|",
            "rowspacingtop",
            "rowspacingbottom",
            "lineheight",
            "|",
            "customstyle",
            "paragraph",
            "fontfamily",
            "fontsize",
            "|",
            "directionalityltr",
            "directionalityrtl",
            "indent",
            "|",
            "justifyleft",
            "justifycenter",
            "justifyright",
            "justifyjustify",
            "|",
            "touppercase",
            "tolowercase",
            "|",
            "link",
            "unlink",
            "anchor",
            "|",
            "imagenone",
            "imageleft",
            "imageright",
            "imagecenter",
            "|",
            "simpleupload",
            "insertimage",
            "emotion",
            "scrawl",
            "insertvideo",
            "music",
            "attachment",
            "map",
            "gmap",
            "insertframe",
            "insertcode",
            "webapp",
            "pagebreak",
            "template",
            "background",
            "|",
            "horizontal",
            "date",
            "time",
            "spechars",
            "snapscreen",
            "wordimage",
            "|",
            "inserttable",
            "deletetable",
            "insertparagraphbeforetable",
            "insertrow",
            "deleterow",
            "insertcol",
            "deletecol",
            "mergecells",
            "mergeright",
            "mergedown",
            "splittocells",
            "splittorows",
            "splittocols",
            "charts",
            "|",
            "print",
            "preview",
            "searchreplace",
            "drafts",
            "help"
          ]
        ];
      }
    },
    // 富文本内容
    content: {
      type: String,
      default: ""
    },
    // 富文本是否只读状态
    readonly: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    myConfig() {
      return {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址,否则无法上传，上传功能需后端配合。
        serverUrl: "",
        // 你的UEditor资源存放的路径,相对于打包后的index.html(路由使用history模式注意使用绝对路径或者填写正确的相对路径)
        UEDITOR_HOME_URL: "/static/ueditor/",
        toolbars: this.toolbars,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: this.initialFrameHeight,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 关闭自动保存
        enableAutoSave: true,
        // 是否启用元素路径，默认是true显示
        elementPathEnabled: false,
        // 是否开启字数统计
        wordCount: false,
        zIndex: 2999,
        readonly: this.readonly
      };
    }
  },
  model: {
    prop: "content",
    event: "change"
  },
  watch: {
    copyContent(val) {
      let me = this;
      me.$emit("change", val);
    },
    content: {
      immediate: true,
      handler(val) {
        let me = this;
        me.copyContent = val;
      }
    }
  }
};
</script>
