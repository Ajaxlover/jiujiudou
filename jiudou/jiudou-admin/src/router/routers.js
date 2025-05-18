import Admin from "@/views/admin";
import App from "@/App";
import home from "@/views/bigData/home";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
    meta: {
      title: "九斗"
    }
  },
  {
    path: "/bigData",
    redirect: "/bigData/platform"
  },
  {
    path: "/bigData",
    name: "bigData",
    component: home,
    meta: {
      title: "九斗数据平台"
    },
    children: [
      {
        path: "platform",
        name: "page1",
        component: () => import("@/views/bigData/page1")
      },
      {
        path: "page2",
        name: "page2",
        component: () => import("@/views/bigData/page2")
      },
      {
        path: "page3",
        name: "page3",
        component: () => import("@/views/bigData/page3")
      }
    ]
  },
  {
    path: "/epub",
    name: "epub",
    component: () => import("@/views/publication/ebooks/epubDemo"),
    meta: {
      title: "epub"
    }
  },
  {
    path: "/chooseRole",
    name: "chooseRole",
    component: () => import("@/views/chooseRole"),
    meta: {
      title: "九斗-让教学更简单"
    }
  },
  {
    path: "/",
    name: "_index",
    redirect: "/index",
    component: Admin,
    meta: {
      title: "九斗-让教学更简单"
    },
    children: [
      {
        path: "/index",
        name: "index",
        component: () => import("@/views/index"),
        meta: {
          title: "首页"
        }
      }
    ]
  },
  {
    path: "/resource",
    name: "resourceManage",
    component: Admin,
    children: [
      {
        path: "resource",
        name: "resource",
        component: () => import("@/views/resource/resource"),
        meta: {
          title: "资源管理"
        }
      }
    ]
  },
  {
    path: "/system",
    name: "system",
    component: Admin,
    meta: {
      title: "九斗-让教学更简单"
    },
    children: [
      {
        path: "syslog",
        name: "sysLog",
        meta: {
          title: "系统日志"
        },
        component: () => import("@/views/system/sysLog")
      },
      {
        path: "publication",
        name: "sysPublication",
        meta: {
          title: "出版社管理"
        },
        component: () => import("@/views/system/publication")
      },
      {
        path: "user",
        name: "user",
        meta: {
          title: "用户管理"
        },
        component: () => import("@/views/system/user")
      },
      {
        path: "api",
        name: "api",
        meta: {
          title: "接口管理"
        },
        component: () => import("@/views/system/api")
      },
      {
        path: "menu",
        name: "menu",
        meta: {
          title: "菜单管理"
        },
        component: () => import("@/views/system/menu")
      },
      {
        path: "role",
        name: "role",
        meta: {
          title: "角色管理"
        },
        component: () => import("@/views/system/role")
      },
      {
        path: "feedback",
        name: "feedback",
        meta: {
          title: "用户反馈"
        },
        component: () => import("@/views/system/feedback")
      },
      {
        path: "apkVersion",
        name: "apkVersion",
        meta: {
          title: "app版本管理"
        },
        component: () => import("@/views/system/apkVersion")
      },
      {
        path: "teacherAttest",
        name: "teacherAttest",
        meta: {
          title: "教师认证"
        },
        component: () => import("@/views/system/teacherAttest")
      },
      {
        path: "schoolAdmin",
        name: "schoolAdmin",
        meta: {
          title: "教师认证"
        },
        component: () => import("@/views/system/schoolAdmin")
      }
    ]
  },
  {
    path: "/operation",
    name: "operation",
    component: Admin,
    meta: {
      title: "九斗-让教学更简单"
    },
    children: [
      {
        path: "courseManage",
        name: "operationCourseManage",
        meta: {
          title: "云课管理"
        },
        component: () => import("@/views/operation/courseManage")
      },
      {
        path: "settleManage",
        name: "settleManage",
        meta: {
          title: "结算管理"
        },
        component: () => import("@/views/operation/settleManage")
      },
      {
        path: "tikuManage",
        name: "tkManage",
        meta: {
          title: "题库管理"
        },
        component: () => import("@/views/operation/tikuManage")
      },
      {
        path: "ticketApply",
        name: "ticketApply",
        meta: {
          title: "发票申请"
        },
        component: () => import("@/views/operation/ticketApply")
      },
      {
        path: "banner",
        name: "banner",
        meta: {
          title: "轮播管理"
        },
        component: () => import("@/views/operation/banner")
      },
      {
        path: "findContentPage",
        name: "findContentPage",
        meta: {
          title: "发现管理"
        },
        component: () => import("@/views/operation/findContentPage")
      },
      {
        path: "advertisment",
        name: "advertisment",
        component: () => import("@/views/operation/advertisment")
      },
      {
        path: "paperOperation",
        name: "paperOperation",
        component: () => import("@/views/operation/paperOperation")
      },
      {
        path: "xieyiManager",
        name: "xieyiManager",
        component: () => import("@/views/operation/xieyiManager"),
        meta: {
          title: "用户协议管理"
        }
      },
      {
        path: "ebPressRecommend",
        name: "ebPressRecommend",
        component: () => import("@/views/operation/ebPressRecommend"),
        meta: {
          title: "书目推荐"
        }
      },
      {
        path: "sampleBook",
        name: "sampleBook",
        component: () => import("@/views/operation/sampleBook"),
        meta: {
          title: "样书申请"
        }
      },
      {
        path: "contestManage",
        name: "contestManage",
        component: () => import("@/views/operation/contest/contestManage"),
        meta: {
          title: "竞赛管理"
        }
      },
      {
        path: "createContest",
        name: "createContest",
        component: () => import("@/views/operation/contest/createContest"),
        meta: {
          title: "创建竞赛"
        }
      },
      {
        path: "editContest",
        name: "editContest",
        component: () => import("@/views/operation/contest/editContest"),
        meta: {
          title: "编辑竞赛"
        }
      },
      {
        path: "viewContest",
        name: "viewContest",
        component: () => import("@/views/operation/contest/contestSetting"),
        meta: {
          title: "查看竞赛"
        }
      },
      {
        path: "contestJoinList",
        name: "contestJoinList",
        component: () => import("@/views/operation/contest/contestJoinList"),
        meta: {
          title: "报名列表"
        }
      },
      {
        path: "honorSetting",
        name: "honorSetting",
        component: () => import("@/views/operation/contest/honorSetting"),
        meta: {
          title: "奖项设置"
        }
      },
      {
        path: "contestInfo",
        name: "contestInfo",
        component: () => import("@/views/operation/contest/contestInfo"),
        meta: {
          title: "信息编辑"
        }
      },
      {
        path: "contestUpgrade",
        name: "contestUpgrade",
        component: () => import("@/views/operation/contest/upgrade"),
        meta: {
          title: "竞赛查看"
        }
      }
    ]
  },
  {
    path: "/tiku",
    name: "tikuManage",
    component: Admin,
    children: [
      {
        path: "tiku",
        name: "tiku",
        component: () => import("@/views/tiku/tiku"),
        meta: {
          title: "题库"
        }
      },
      {
        path: "sonList",
        name: "sonList",
        component: () => import("@/views/tiku/sonList")
      },
      {
        path: "importPreTem",
        name: "importPreTem",
        component: () => import("@/views/tiku/importPreTem")
      },
      {
        path: "singleQuestionIn",
        name: "singleQuestionIn",
        component: () => import("@/views/tiku/singleQuestionIn")
      },
      {
        path: "commonSingleQuestionIn",
        name: "commonSingleQuestionIn",
        component: () => import("@/views/tiku/commonSingleQuestionIn")
      },
      {
        path: "officialSingleQuestionIn",
        name: "officialSingleQuestionIn",
        component: () => import("@/views/tiku/officialSingleQuestionIn")
      }
    ]
  },
  {
    path: "/class",
    name: "classManage",
    component: Admin,
    children: [
      {
        path: "classCourse",
        name: "classCourse",
        component: () => import("@/views/class/classCourse"),
        meta: {
          title: "班课"
        }
      },
      {
        path: "countCourse",
        name: "countCourse",
        component: () => import("@/views/class/countCourse"),
        meta: {
          title: "班课统计"
        }
      },
      {
        path: "myClass",
        name: "myClass",
        component: () => import("@/views/class/myClass"),
        meta: {
          title: "班级管理"
        }
      },
      {
        path: "classInfo",
        name: "classInfo",
        component: () => import("@/views/class/classInfo"),
        meta: {
          title: "班级设置"
        }
      },
      {
        path: "classReport",
        name: "classReport",
        component: () => import("@/views/class/classReport")
      },
      {
        path: "scoreSetting",
        name: "scoreSetting",
        component: () => import("@/views/class/scoreSetting")
      },
      {
        path: "classSetting",
        name: "classSetting",
        component: () => import("@/views/class/classSetting")
      },
      {
        path: "publishHomework",
        name: "publishHomework",
        component: () => import("@/views/class/publishHomework/handmade")
      },
      {
        path: "addTimu",
        name: "addHomeworkTimu",
        component: () => import("@/views/class/publishHomework/addTimu"),
        meta: {
          title: "添加题目"
        }
      }
    ]
  },
  {
    path: "/class",
    name: "class",
    component: App,
    children: [
      {
        path: "addTimu1",
        name: "addHomeworkTimu1",
        component: () => import("@/views/class/publishHomework/addTimu"),
        meta: {
          title: "添加题目"
        }
      },
      {
        path: "classInvitation",
        name: "classInvitation",
        component: () => import("@/views/class/classInvitation"),
        meta: {
          title: "班级邀请码"
        }
      },
      {
        path: "printHomework",
        name: "printHomework",
        component: () => import("@/views/class/printHomework"),
        meta: {
          title: "作业打印"
        }
      }
    ]
  },
  {
    path: "/coursewareLib",
    name: "coursewareLib",
    component: Admin,
    children: [
      {
        path: "myCoursewareLib",
        name: "myCoursewareLib",
        component: () => import("@/views/coursewareLib/myCoursewareLib"),
        meta: {
          title: "我的课件"
        }
      }
    ]
  },
  {
    path: "/claCourseware",
    name: "claCourseware",
    component: App,
    children: [
      {
        path: "editCourseware",
        name: "editCourseware",
        component: () => import("@/views/claCourseware/editCourseware"),
        meta: {
          title: "编辑课件"
        }
      },
      {
        path: "goToCourseware",
        name: "goToCourseware",
        component: () => import("@/views/claCourseware/goToCourseware"),
        meta: {
          title: "开始上课"
        }
      },
      {
        path: "editCourseTask",
        name: "editCourseTask",
        component: () => import("@/views/claCourseware/editCourseTask"),
        meta: {
          title: "编辑作业"
        }
      },
      {
        path: "editTask",
        name: "editTask",
        component: () => import("@/views/claCourseware/editTask"),
        meta: {
          title: "编辑作业"
        }
      },
      {
        path: "editLibTask",
        name: "editLibTask",
        component: () => import("@/views/claCourseware/editLibTask"),
        meta: {
          title: "编辑作业"
        }
      },
      {
        path: "startClaSign",
        name: "startClaSign",
        component: () => import("@/views/claCourseware/startClaSign"),
        meta: {
          title: "签到"
        }
      },
      {
        path: "viewCourseware",
        name: "viewCourseware",
        component: () => import("@/views/claCourseware/viewCourseware"),
        meta: {
          title: "课件预览"
        }
      }
    ]
  },
  {
    path: "/paper",
    name: "paperManage",
    component: Admin,
    children: [
      {
        path: "paper",
        name: "paper",
        component: () => import("@/views/paper/paper"),
        meta: {
          title: "试卷管理"
        }
      },
      {
        path: "handmade",
        name: "handmade",
        component: () => import("@/views/paper/handmade"),
        meta: {
          title: "手工组卷"
        }
      },
      {
        path: "voluntaril",
        name: "voluntaril",
        component: () => import("@/views/paper/voluntaril"),
        meta: {
          title: "自动组卷"
        }
      },
      {
        path: "addTimu",
        name: "addPaperTimu",
        component: () => import("@/views/paper/addTimu"),
        meta: {
          title: "添加试题"
        }
      }
    ]
  },
  {
    path: "/cloudCourse",
    name: "cloudCourse",
    component: Admin,
    children: [
      {
        path: "cloudCourse",
        name: "aCloudCourse",
        meta: {
          title: "我的云课"
        },
        component: () => import("@/views/cloudCourse/cloudCourse")
      },
      {
        path: "courseInfo",
        name: "courseInfo",
        component: () => import("@/views/cloudCourse/courseInfo")
      },
      {
        path: "help",
        name: "cloudHelp",
        component: () => import("@/views/cloudCourse/help")
      },
      {
        path: "countCourse",
        name: "cloudCountCourse",
        component: () => import("@/views/cloudCourse/countCourse")
      },
      {
        path: "courseDetail",
        name: "cloudCourseDetail",
        component: () => import("@/views/cloudCourse/courseDetail")
      },
      {
        path: "brush",
        name: "brush",
        component: () => import("@/views/cloudCourse/brush")
      },
      {
        path: "brushInfo",
        name: "brushInfo",
        component: () => import("@/views/cloudCourse/brushInfo")
      }
    ]
  },
  {
    path: "/moocModule",
    name: "moocModule",
    component: Admin,
    children: [
      {
        path: "moocManage",
        name: "moocManage",
        meta: {
          title: "慕课管理"
        },
        component: () => import("@/views/moocModule/moocManage")
      },
      {
        path: "moocAdmin",
        name: "moocAdmin",
        meta: {
          title: "慕课管理"
        },
        component: () => import("@/views/moocModule/moocAdmin")
      },
      {
        path: "moocInfo",
        name: "moocInfo",
        component: () => import("@/views/moocModule/moocInfo")
      },
      {
        path: "help",
        name: "help",
        component: () => import("@/views/cloudCourse/help")
      },
      {
        path: "countCourse",
        name: "moocCountCourse",
        component: () => import("@/views/cloudCourse/countCourse")
      },
      {
        path: "courseDetail",
        name: "courseDetail",
        component: () => import("@/views/cloudCourse/courseDetail")
      }
    ]
  },
  {
    path: "/publication",
    name: "publication",
    component: Admin,
    children: [
      {
        path: "code",
        name: "code",
        component: () => import("@/views/publication/code")
      },
      {
        path: "cloudbook",
        name: "cloudbook",
        component: () => import("@/views/publication/cloudbook")
      },
      {
        path: "cloudbookInfo",
        name: "cloudbookInfo",
        component: () => import("@/views/publication/cloudbookInfo")
      },
      {
        path: "codeSearch",
        name: "codeSearch",
        component: () => import("@/views/publication/codeSearch")
      },
      {
        path: "bookNameSearch",
        name: "bookNameSearch",
        component: () => import("@/views/publication/bookNameSearch")
      },
      {
        path: "codeOperate",
        name: "codeOperate",
        component: () => import("@/views/publication/codeOperate")
      },
      {
        path: "codeBind",
        name: "codeBind",
        component: () => import("@/views/publication/codeBind")
      },
      {
        path: "book",
        name: "book",
        component: () => import("@/views/publication/book")
      },
      {
        path: "bookRelease",
        name: "bookRelease",
        component: () => import("@/views/publication/bookRelease")
      },
      {
        path: "bookInfo",
        name: "bookInfo",
        component: () => import("@/views/publication/bookInfo")
      },
      {
        path: "bookInfoRelease",
        name: "bookInfoRelease",
        component: () => import("@/views/publication/bookInfoRelease")
      },
      {
        path: "member",
        name: "member",
        component: () => import("@/views/publication/member")
      },
      {
        path: "digitalAdmin",
        name: "digitalAdmin",
        component: () => import("@/views/publication/digitalBook")
      },
      {
        path: "digitalDistribute",
        name: "digitalDistribute",
        component: () => import("@/views/publication/distributeBook")
      },
      {
        path: "detail",
        name: "detail",
        component: () => import("@/views/publication/bookDetail")
      },
      {
        path: "detailRelease",
        name: "detailRelease",
        component: () => import("@/views/publication/bookDetailRelease")
      },
      {
        path: "bookHelp",
        name: "bookHelp",
        component: () => import("@/views/publication/bookHelp")
      },
      {
        path: "searchRes",
        name: "searchRes",
        component: () => import("@/views/publication/searchRes")
      },
      {
        path: "searchTest",
        name: "searchTest",
        component: () => import("@/views/publication/searchTest")
      },
      {
        path: "ebooks",
        name: "ebooks",
        component: () => import("@/views/publication/ebooks/ebook")
      },
      {
        path: "epubBooks",
        name: "epubBooks",
        component: () => import("@/views/publication/ebooks/epubBook")
      },
      {
        path: "teacherBooks",
        name: "teacherBooks",
        component: () => import("@/views/publication/ebooks/teacherBook")
      },
      {
        path: "publishBooks",
        name: "publishBooks",
        component: () => import("@/views/publication/ebooks/publishBook")
      },
      {
        path: "epubBookBindResource",
        name: "epubBookBindResource",
        component: () =>
          import("@/views/publication/ebooks/epubBookBindResource")
      },
      {
        path: "ebookInfo",
        name: "ebookInfo",
        component: () => import("@/views/publication/ebooks/ebookInfo")
      },
      {
        path: "epubBookInfo",
        name: "epubBookInfo",
        component: () => import("@/views/publication/ebooks/epubBookInfo")
      },
      {
        path: "chapterInfo",
        name: "chapterInfo",
        component: () => import("@/views/publication/ebooks/chapterInfo")
      },
      {
        path: "ebookDetail",
        name: "ebookDetail",
        component: () => import("@/views/publication/ebooks/ebookDetail")
      },
      {
        path: "epubBookDetail",
        name: "epubBookDetail",
        component: () => import("@/views/publication/ebooks/epubBookDetail")
      },
      {
        path: "ebookSearchRes",
        name: "ebookSearchRes",
        component: () => import("@/views/publication/ebooks/ebookSearchRes")
      },
      {
        path: "ebookSearchTest",
        name: "ebookSearchTest",
        component: () => import("@/views/publication/ebooks/ebookSearchTest")
      },
      {
        path: "epubSearchRes",
        name: "epubSearchRes",
        component: () => import("@/views/publication/ebooks/epubSearchRes")
      },
      {
        path: "epubSearchTest",
        name: "epubSearchTest",
        component: () => import("@/views/publication/ebooks/epubSearchTest")
      },
      {
        path: "discount",
        name: "discount",
        component: () => import("@/views/publication/discount")
      },
      {
        path: "onlineMessage",
        name: "onlineMessage",
        component: () => import("@/views/publication/onlineMessage")
      }
    ]
  },
  {
    path: "/teacher",
    name: "teacher",
    component: Admin,
    children: [
      {
        path: "teaDtBooks",
        name: "teaDtBooks",
        component: () => import("@/views/publication/ebooks/teaBook")
      },
      {
        path: "teaDtBookInfo",
        name: "teaDtBookInfo",
        component: () => import("@/views/publication/ebooks/teaDtBookInfo")
      }
    ]
  },
  {
    path: "/epub-publication",
    name: "epubPublication",
    component: App,
    children: [
      {
        path: "epubBooks",
        name: "epubBooks",
        component: () => import("@/views/publication/ebooks/epubBook")
      },
      {
        path: "dtDoTest",
        name: "dtDoTest",
        component: () => import("@/views/publication/ebooks/dtDoTest")
      },
      {
        path: "dtSearchTest",
        name: "dtSearchTest",
        component: () => import("@/views/publication/ebooks/dtSearchTest")
      },
      {
        path: "dtSingleIn",
        name: "dtSingleIn",
        component: () =>
          import("@/views/publication/ebooks/commonSingleQuestionIn")
      },
      {
        path: "importPreTem",
        name: "importPreTem",
        component: () => import("@/views/publication/ebooks/importPreTem")
      },
      {
        path: "dtBindTest",
        name: "dtBindTest",
        component: () => import("@/views/publication/ebooks/dtBindTest")
      },
      {
        path: "dtBindResource",
        name: "dtBookBindResource",
        component: () => import("@/views/publication/ebooks/dtBindResource")
      },
      {
        path: "dtBindPic",
        name: "dtBookBindPic",
        component: () => import("@/views/publication/ebooks/dtBindPic")
      },
      {
        path: "epubBookBindResource",
        name: "epubBookBindResource",
        component: () =>
          import("@/views/publication/ebooks/epubBookBindResource")
      },
      {
        path: "ebookInfo",
        name: "ebookInfo",
        component: () => import("@/views/publication/ebooks/ebookInfo")
      },
      {
        path: "epubBookInfo",
        name: "epubBookInfo",
        component: () => import("@/views/publication/ebooks/epubBookInfo")
      },
      {
        path: "ebookDetail",
        name: "ebookDetail",
        component: () => import("@/views/publication/ebooks/ebookDetail")
      },
      {
        path: "epubBookDetail",
        name: "epubBookDetail",
        component: () => import("@/views/publication/ebooks/epubBookDetail")
      },
      {
        path: "ebookSearchRes",
        name: "ebookSearchRes",
        component: () => import("@/views/publication/ebooks/ebookSearchRes")
      },
      {
        path: "ebookSearchTest",
        name: "ebookSearchTest",
        component: () => import("@/views/publication/ebooks/ebookSearchTest")
      },
      {
        path: "epubSearchRes",
        name: "epubSearchRes",
        component: () => import("@/views/publication/ebooks/epubSearchRes")
      },
      {
        path: "epubSearchTest",
        name: "epubSearchTest",
        component: () => import("@/views/publication/ebooks/epubSearchTest")
      },
      {
        path: "discount",
        name: "discount",
        component: () => import("@/views/publication/discount")
      },
      {
        path: "onlineMessage",
        name: "onlineMessage",
        component: () => import("@/views/publication/onlineMessage")
      }
    ]
  },
  {
    path: "/profile",
    name: "profile",
    component: Admin,
    children: [
      {
        path: "friend",
        name: "friend",
        component: () => import("@/views/profile/friend")
      },
      {
        path: "person",
        name: "person",
        component: () => import("@/views/profile/person")
      },
      {
        path: "income",
        name: "income",
        meta: {
          title: "我的收益"
        },
        component: () => import("@/views/profile/income")
      },
      {
        path: "message",
        name: "message",
        meta: {
          title: "我的消息"
        },
        component: () => import("@/views/profile/message")
      },
      {
        path: "teaAdmin",
        name: "teaAdmin",
        meta: {
          title: "校级管理"
        },
        component: () => import("@/views/profile/teaAdmin")
      },
      {
        path: "teaOrder",
        name: "teaOrder",
        meta: {
          title: "我的订单"
        },
        component: () => import("@/views/profile/teaOrder")
      },
      {
        path: "checkTask",
        name: "checkTask",
        meta: {
          title: "批阅列表"
        },
        component: () => import("@/views/profile/checkTask/checkTask")
      }
    ]
  },
  {
    path: "/vote",
    name: "vote",
    component: App,
    children: [
      {
        path: "voteList",
        name: "voteList",
        component: () => import("@/views/claCourseware/vote/voteList")
      },
      {
        path: "addVote",
        name: "addVote",
        component: () => import("@/views/claCourseware/vote/addVote")
      },
      {
        path: "voteDetail",
        name: "voteDetail",
        component: () => import("@/views/claCourseware/vote/voteDetail")
      }
    ]
  },
  {
    path: "/topic",
    name: "topic",
    component: App,
    children: [
      {
        path: "topicDetail",
        name: "topicDetail",
        component: () => import("@/views/class/topic/topicDetail")
      },
      {
        path: "stuHomeWorkDetail",
        name: "stuHomeWorkDetail",
        component: () => import("@/views/class/topic/stuHomeWorkDetail")
      },
      {
        path: "downloadDetail",
        name: "downloadDetail",
        component: () => import("@/views/class/topic/downloadDetail")
      },
      {
        path: "check",
        name: "check",
        component: () => import("@/views/class/topic/check")
      },
      {
        path: "stuStatistics",
        name: "stuStatistics",
        component: () => import("@/views/class/topic/stuStatistics")
      }
    ]
  },
  {
    path: "/courseManage",
    name: "adCourseManage",
    component: Admin,
    children: [
      {
        path: "courseClassify",
        name: "courseClassify",
        component: () => import("@/views/courseManage/courseClassify")
      },
      {
        path: "lessonManage",
        name: "lessonManage",
        component: () => import("@/views/courseManage/lessonManage")
      }
    ]
  },
  {
    path: "/courseManage",
    name: "apCourseManage",
    component: App,
    children: [
      {
        path: "tips", // 知识点管理
        name: "tips",
        component: () => import("@/views/courseManage/tips")
      }
    ]
  },
  {
    path: "/exam",
    name: "exam",
    component: Admin,
    children: [
      {
        path: "examManageAdmin",
        name: "examManageAdmin",
        meta: {
          title: "考试管理"
        },
        component: () => import("@/views/exam/examManageAdmin")
      },
      {
        path: "examManage",
        name: "examManage",
        meta: {
          title: "考试管理"
        },
        component: () => import("@/views/exam/examManage")
      },
      {
        path: "examCreate",
        name: "examCreate",
        meta: {
          title: "创建考试"
        },
        component: () => import("@/views/exam/createExam")
      },
      {
        path: "examCreateNew",
        name: "examCreateNew",
        meta: {
          title: "创建考试"
        },
        component: () => import("@/views/exam/examCreateNew")
      },
      {
        path: "examRecord",
        name: "examRecord",
        meta: {
          title: "提交记录"
        },
        component: () => import("@/views/exam/examRecord")
      },
      {
        path: "examAnalysis",
        name: "examAnalysis",
        meta: {
          title: "考试统计分析"
        },
        component: () => import("@/views/exam/examAnalysis")
      },
      {
        path: "examCheck",
        name: "examCheck",
        meta: {
          title: "成绩批改"
        },
        component: () => import("@/views/exam/examCheck")
      },
      {
        path: "examScore",
        name: "examScore",
        meta: {
          title: "试卷批阅"
        },
        component: () => import("@/views/exam/examScore")
      },
      {
        path: "examResult",
        name: "examResult",
        meta: {
          title: "复批结果"
        },
        component: () => import("@/views/exam/examResult")
      },
      {
        path: "examRepeatScore",
        name: "examRepeatScore",
        meta: {
          title: "试卷批阅(复批)"
        },
        component: () => import("@/views/exam/examRepeatScore")
      },
      {
        path: "examSetting",
        name: "examSetting",
        meta: {
          title: "考试设置"
        },
        component: () => import("@/views/exam/examSetting")
      },
      {
        path: "addExamTimu",
        name: "addExamTimu",
        meta: {
          title: "考试添加试题"
        },
        component: () => import("@/views/exam/addExamTimu")
      },
      {
        path: "examTimu",
        name: "examTimu",
        meta: {
          title: "试题组装"
        },
        component: () => import("@/views/exam/examTimu")
      },
      {
        path: "examPublish",
        name: "examPublish",
        meta: {
          title: "发布考试"
        },
        component: () => import("@/views/exam/examPublish")
      },
      {
        path: "viewExamSetting",
        name: "viewExamSetting",
        meta: {
          title: "预览考试"
        },
        component: () => import("@/views/exam/viewSetting")
      },
      {
        path: "viewExamTimu",
        name: "viewExamTimu",
        meta: {
          title: "预览试卷"
        },
        component: () => import("@/views/exam/viewExamTimu")
      },
      {
        path: "examSetCheck",
        name: "examSetCheck",
        meta: {
          title: "设置批阅"
        },
        component: () => import("@/views/exam/examSetCheck")
      }
    ]
  }
];
