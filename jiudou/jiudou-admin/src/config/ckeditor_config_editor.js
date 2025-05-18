export default {
  language: "zh-cn",

  toolbar: [
    { name: "styles", items: ["Font", "FontSize", "lineheight"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "undo", items: ["Undo", "Redo"] },
    { name: "basicstyles", items: ["Bold", "Italic", "Underline"] },
    { name: "align", items: ["JustifyLeft", "JustifyCenter", "JustifyRight"] },
    {
      name: "insert",
      items: [
        "Image",
        "Html5audio",
        "Html5video",
        "Table",
        "Mathjax",
        "HorizontalRule"
      ]
    },
    // { name: "links", items: ["Link", "Unlink"] },
    { name: "document", items: ["Preview", "Source"] },
    { name: "tools", items: ["Maximize"] }
  ],

  // extraPlugins: 'mathjax',
  extraPlugins:
    "preview,font,justify,colorbutton,mathjax,html5audio,html5video,widget,lineheight",

  format_tags: "p;h1;h2;h3;pre",

  tabSpaces: 7,

  removeDialogTabs: "image:advanced;link:advanced",

  mathJaxLib:
    "https://find-1253402545.cos.ap-beijing.myqcloud.com/mathjax_1/MathJax.js?config=TeX-MML-AM_CHTML",

  image_previewText: " ",

  filebrowserImageUploadUrl:
    process.env.BASE_URL +
    "/v1/upload/ckeditorImage?backUrl=" +
    process.env.THIS_URI +
    "/static/getImage.html",

  filebrowserHtml5videoUploadUrl:
    process.env.BASE_URL +
    "/v1/upload/ckeditorFile?backUrl=" +
    process.env.THIS_URI +
    "/static/getVideo.html",

  filebrowserHtml5audioUploadUrl:
    process.env.BASE_URL +
    "/v1/upload/ckeditorFile?backUrl=" +
    process.env.THIS_URI +
    "/static/getVideo.html"
};
