// stores/app.ts
import { defineStore } from "pinia";
import { useCache } from "@/render/hooks/useCache";

const { wsCache } = useCache("localStorage");

interface AppState {
  isCollapse: Boolean;
  breadCrumbList: Array<BreadCrumbList>;
  isDark: Boolean;
  user: any;
  currentQue: any;
  questionList: any;
  questionMap: any;
}
export interface BreadCrumbList {
  title: String;
  path: String;
  showClose: Boolean;
  type: String;
}
export type ActionBread = "route" | "news";

export const useAppStore = defineStore("app", {
  state: (): AppState => {
    return {
      isCollapse: false,
      breadCrumbList: wsCache.get("breadCrumbList")
        ? wsCache.get("breadCrumbList")
        : [],
      isDark: wsCache.get("isDark") ? wsCache.get("isDark") : false,
      user: wsCache.get("user") ? wsCache.get("user") : [],
      currentQue: wsCache.get("currentQue") ? wsCache.get("currentQue") : [],
      questionList: wsCache.get("questionList")
        ? wsCache.get("questionList")
        : [],
      questionMap: wsCache.get("questionMap") ? wsCache.get("questionMap") : [],
    };
  },
  actions: {
    // 设置主题切换
    setDark() {
      this.isDark = !this.isDark;
      wsCache.set("isDark", this.isDark);
    },
    // 设置菜单合并
    setCollapse(e: Boolean) {
      this.isCollapse = e;
    },
    // 设置面包屑路由展示
    setBreadCrumbList(data: BreadCrumbList, action: ActionBread) {
      if (action === "route") {
        const newData = [...this.breadCrumbList];
        const filterData = newData
          .map((item) => {
            if (item.type !== "route") {
              return { ...item };
            }
          })
          .filter((item) => item !== undefined);
        this.breadCrumbList = [data, ...(filterData as any)];
      } else {
        this.breadCrumbList.push(data);
      }
      wsCache.set("breadCrumbList", this.breadCrumbList);
    },
    //设置用户信息
    setUserInfor(infor: any) {
      this.user = infor ? { ...infor } : {};
      wsCache.set("user", this.user);
    },

    //当前题目
    setCurrentQuestion(index: any) {
      this.currentQue = index;
      wsCache.set("currentQue", this.currentQue);
    },
    //题目列表
    setQuestionList(list: any) {
      // {
      //    0: "其他题目",
      //    1: "判断题",
      //    2: "单选题",
      //    3: "多选题",
      //    4: "填空题",
      //    5: "问答题",
      //    11: "组合题",
      // }
      let new_list: any = [];
      let subject_map: any = {};
      list.forEach((item: any, index: number) => {
        let _item = { ...item, queIndex: index };
        new_list.push(_item);
        if (subject_map.hasOwnProperty(item.tSubject)) {
          subject_map[item.tSubject].push(_item);
        } else {
          subject_map[item.tSubject] = [_item];
        }
      });
      // 题目列表
      this.questionList = new_list;
      wsCache.set("questionList", new_list);
      // 题目列表，分类
      this.questionMap = subject_map;
      wsCache.set("questionMap", subject_map);
    },
    changeQueList(list: any, mapList: any) {
      // 题目列表
      this.questionList = list;
      wsCache.set("questionList", list);
      // 题目列表，分类
      this.questionMap = mapList;
      wsCache.set("questionMap", mapList);
    },
  },
});
