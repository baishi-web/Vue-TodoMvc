<template>
  <div id="app">
    <!-- 外围盒子 -->
    <div class="todo">
      <h2 class="title">todoMvc</h2>
      <!-- todo盒子 -->
      <div class="todoBox">
        <!-- 输入框盒子 -->
        <div class="input-box">
          <img class="down" @click="allSelect" src="./assets/imgs/箭头 下 down.svg" alt />
          <input
            @keyup.enter="submit"
            class="input-text"
            type="text"
            placeholder="What needs to be done?"
          />
        </div>
        <!-- 列表盒子 -->
        <div v-show="showList" class="list-box">
          <!-- todo列表 -->
          <ul class="todoList">
            <li
              v-for="item in showdataList"
              :key="item.text"
              @mouseenter="showdelete=item.text"
              class="list"
            >
              <div class="left-text">
                <input
                  v-model="item.choose"
                  @click="isChecked(item.text)"
                  class="check-box"
                  type="checkbox"
                />
                <input
                  @blur="inputStred(item.text)"
                  @keyup.13="inputStred(item.text)"
                  @keyup.esc="showtext=''"
                  v-focus
                  v-if="showtext===item.text"
                  v-model="inputStr"
                  class="text"
                  type="text"
                />
                <span @dblclick="editText(item.text)" v-else>{{ item.text }}</span>
              </div>
              <p v-if="showdelete===item.text" class="delete" @click="deleteItem(item)">x</p>
            </li>
          </ul>
          <!-- todo状态 -->
          <div class="todo-status">
            <!-- items left -->
            <span class="items-left">{{nocomleted}} items left</span>
            <!-- status -->
            <div class="status">
              <!-- all -->
              <span class="all" @click="chooseList" :class="{on:showactive === 'all'}">All</span>
              <!-- active -->
              <span class="active" @click="chooseList" :class="{on:showactive === 'active'}">Active</span>
              <!-- completed -->
              <span
                class="completed"
                @click="chooseList"
                :class="{on:showactive === 'completed'}"
              >Completed</span>
            </div>
            <!-- clear-completed -->
            <span @click="clearCompleted" class="clear-completed">clear completed</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todoArr: [], //原todolist数组
      dataList: [], //初始化todolist数组
      showList: false, //是否显示todos下拉列表
      showdelete: "", //显示x号
      checked: false, //选中状态
      showactive: "all", //分类显示
      showdataList: [], //页面渲染列表
      showtext: "", //是否显示输入框
      inputStr: "" //编辑文本
    };
  },
  methods: {
    // 键盘按下enter,数据提交到本地
    submit(e) {
      this.checked = false;
      if (JSON.parse(window.localStorage.getItem("dataList"))) {
        this.todoArr = JSON.parse(window.localStorage.getItem("dataList"));
      }
      var data = String(e.target.value).trim(); //去除空格
      if (e.target.value != " " && data != "") {
        this.toDuplicateremoval(data); //去重函数
        this.showTodoList(); //显示
        // 初始化
        this.todoArr = [];
        e.target.value = "";
      }
    },
    // 去重
    toDuplicateremoval(data) {
      var newtodoArr = []; //去重数组
      var temp = {}; //去重对象
      this.todoArr.unshift({
        text: data,
        choose: this.checked,
        showactive: this.showactive
      }); //写入数据
      for (let i = 0; i < this.todoArr.length; i++) {
        if (!temp[this.todoArr[i].text]) {
          temp[this.todoArr[i].text] = "xxx"; //键名
          newtodoArr.push(this.todoArr[i]);
        }
      }
      window.localStorage.setItem("dataList", JSON.stringify(newtodoArr)); //将数据写入到本地存储中
    },
    // 显示todolist
    showTodoList() {
      var data = window.localStorage.getItem("dataList"); //从本地存储中读取数据
      if (data && JSON.parse(data).length !== 0) {
        this.showList = true;
        this.dataList = JSON.parse(data);
        this.showdataList = this.choosedataList();
      } else {
        this.showList = false;
        this.dataList = [];
      }
    },
    // 选择渲染列表
    chooseList(e) {
      this.showactive = e.target.getAttribute("class");
      this.showdataList = this.choosedataList();
    },
    // 分类渲染
    choosedataList() {
      if (this.showactive === "all") {
        this.dataList.forEach(item => (item.showactive = "all"));
        return this.dataList;
      } else if (this.showactive === "active") {
        this.dataList.forEach(item => (item.showactive = "active"));
        return this.dataList.filter(item => item.choose === false);
      } else if (this.showactive === "completed") {
        this.dataList.forEach(item => (item.showactive = "completed"));
        return this.dataList.filter(item => item.choose === true);
      }
    },
    // 全选
    allSelect() {
      console.log(this.dataList.filter(item => item.choose === true));
      if (this.dataList.every(item => item.choose === true)) {
        this.checked = false;
        this.dataList.forEach(item => (item.choose = this.checked));
      } else {
        this.checked = true;
        this.dataList.forEach(item => (item.choose = this.checked));
      }
      window.localStorage.setItem("dataList", JSON.stringify(this.dataList));
      this.showTodoList();
    },
    // 点击选择完成与否
    isChecked(i) {
      this.dataList.forEach(item => {
        if (item.text === i) item.choose = !this.checked;
      });
    },
    // 点击删除一项todo
    deleteItem(i) {
      this.dataList.splice(this.dataList.indexOf(i), 1);
      window.localStorage.setItem("dataList", JSON.stringify(this.dataList));
      this.showTodoList();
    },
    // 清空已完成todos
    clearCompleted() {
      this.dataList = this.dataList.filter(item => item.choose === false);
      window.localStorage.setItem("dataList", JSON.stringify(this.dataList));
      this.showTodoList();
    },
    // 双击编辑
    editText(text) {
      this.showtext = text;
      this.inputStr = text;
    },
    // 失焦 || enter 取消编辑
    inputStred(i) {
      this.dataList.forEach(item => {
        if (item.text == i) {
          item.text = this.inputStr;
        }
      });
      window.localStorage.setItem("dataList", JSON.stringify(this.dataList));
      this.showTodoList();
      this.showtext = "";
    }
  },
  created() {
    this.showTodoList();
  },
  computed: {
    // 未完成数
    nocomleted() {
      return this.dataList.filter(item => item.choose === false).length;
    }
  },
  // 定义input自动聚焦指令
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  // 侦听dataList的变化
  watch: {
    dataList: {
      handler: function() {
        window.localStorage.setItem("dataList", JSON.stringify(this.dataList));
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
#app {
  .todo {
    width: 500px;
    margin: 100px auto;
    background-color: #f7f7f7;
    padding-bottom: 40px;
    .title {
      text-align: center;
      line-height: 50px;
      font-size: 30px;
    }
    .todoBox {
      width: 400px;
      margin: 0 auto;
      box-shadow: 0px 2px 5px #000;
      border: 1px solid #ccc;
      border-radius: 4px;
      .input-box {
        height: 40px;
        width: 400px;
        border-bottom: 1px solid #ccc;
        background: #fff;
        .down {
          width: 14px;
          height: 14px;
          margin: 13px 8px;
          float: left;
          cursor: pointer;
        }
        .input-text {
          height: 38px;
          width: 360px;
          border: none;
          outline: none;
          float: left;
        }
      }
      .list-box {
        background-color: #fff;
        .todoList {
          width: 100%;
          .list {
            text-indent: 4px;
            padding: 10px 0;
            display: flex;
            justify-content: space-between;
            &:not(:last-child) {
              border-bottom: 1px solid #ccc;
            }
            .left-text {
              .check-box {
                margin-right: 10px;
                &:checked + span {
                  text-decoration: line-through;
                  color: #dcdcdc;
                }
              }
              .text {
                width: 300px;
              }
            }
            .delete {
              font-size: 18px;
              cursor: pointer;
              margin-right: 20px;
            }
          }
        }
        .todo-status {
          display: flex;
          justify-content: space-between;
          height: 30px;
          box-sizing: border-box;
          font-size: 12px;
          color: #373737;
          background-color: #f7f7f7;
          .items-left {
            line-height: 30px;
            text-indent: 3px;
          }
          .status {
            padding-top: 7px;
            box-sizing: border-box;
            span {
              cursor: pointer;
              display: inline-block;
              padding: 3px;
              box-sizing: border-box;
              border-radius: 4px;
              border: 1px solid #fff;
              margin: 0 2px;
              &:hover {
                border: 1px solid #ccc;
              }
              &.on {
                border: 1px solid #ccc;
              }
            }
          }
          .clear-completed {
            line-height: 30px;
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>