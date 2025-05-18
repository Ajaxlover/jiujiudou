/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function(config) {
  // Define changes to default configuration here.
  // For complete reference see:
  // http://docs.ckeditor.com/#!/api/CKEDITOR.config

  config.language = "zh-cn";

  config.toolbar = [
    { name: "styles", items: ["Font", "FontSize", "lineheight"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "undo", items: ["Undo", "Redo"] },
    { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
    { name: "insert", items: ["Image", "Table", "Mathjax", "HorizontalRule"] },
    { name: "align", items: ["JustifyLeft", "JustifyCenter", "JustifyRight"] },
    { name: "document", items: ["Preview", "Source"] },
    { name: "tools", items: ["Maximize"] }
  ];

  config.extraPlugins = "preview,font,justify,colorbutton,mathjax";

  // Set the most common block elements.
  config.format_tags = "p;h1;h2;h3;pre";

  // Simplify the dialog windows.
  config.removeDialogTabs = "image:advanced;link:advanced";

  // config.filebrowserHtml5videoUploadUrl = "/HmCode/Shop/uploads"; //上传视频的地址

  config.image_previewText = " ";

  config.extraPlugins += config.extraPlugins
    ? ",lineheight,html5video"
    : "lineheight,html5video";

  config.enterMode = CKEDITOR.ENTER_BR;
  config.shiftEnterMode = CKEDITOR.ENTER_P;

  config.font_names =
    "宋体/SimSun;新宋体/NSimSun;仿宋/FangSong;楷体/KaiTi;仿宋_GB2312/FangSong_GB2312;" +
    "楷体_GB2312/KaiTi_GB2312;黑体/SimHei;华文细黑/STXihei;华文楷体/STKaiti;华文宋体/STSong;华文中宋/STZhongsong;" +
    "华文仿宋/STFangsong;华文彩云/STCaiyun;华文琥珀/STHupo;华文隶书/STLiti;华文行楷/STXingkai;华文新魏/STXinwei;" +
    "方正舒体/FZShuTi;方正姚体/FZYaoti;细明体/MingLiU;新细明体/PMingLiU;微软雅黑/Microsoft YaHei;微软正黑/Microsoft JhengHei;" +
    "Arial Black/Arial Black;" +
    config.font_names;

  config.filebrowserImageUploadUrl = "/gateway/upload/ckeditorUpload";

  config.mathJaxLib =
    "/gyAdmin/lib/mathjax/MathJax.js?config=TeX-AMS_HTML-full";
};
