export default {
  language: "zh-cn",

  toolbar: [
    { name: "styles", items: ["Font", "FontSize"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "undo", items: ["Undo", "Redo"] },
    { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
    { name: "insert", items: ["Image", "Table", "Mathjax", "HorizontalRule"] },
    { name: "align", items: ["JustifyLeft", "JustifyCenter", "JustifyRight"] },
    // { name: "document", items: ["Preview", "Source"] },
    { name: "tools", items: ["Maximize"] }
  ],

  extraPlugins: "justify,mathjax",

  // format_tags: 'p;h1;h2;h3;pre',

  // removeDialogTabs: 'image:advanced;link:advanced',

  mathJaxLib:
    "https://find-1253402545.cos.ap-beijing.myqcloud.com/mathjax_1/MathJax.js?config=TeX-MML-AM_CHTML",

  image_previewText: " ",

  filebrowserImageUploadUrl:
    process.env.BASE_URL +
    "/v1/upload/ckeditorImage?backUrl=" +
    process.env.THIS_URI +
    "/static/getImage.html"
};
