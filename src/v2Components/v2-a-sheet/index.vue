<template>
  <div class="hello p-2" v-loading="loading" element-loading-text="拼命加载中">
    <!-- <cdn /> -->
    <div class="flex items-center" style="">
      <upload :entityId="entityId" @handleChange="exportEntityData" />
      <!-- <input class="" style="font-size: 16px" type="file" @change="uploadExcel" /> -->
      {{ title }}
      <div class="">
        <el-button size="mini" @click="handleExportExcel">导出表格</el-button>
        <el-button type="primary" size="mini" @click="save">保存数据</el-button>
      </div>
    </div>

    <div
      id="luckysheet"
      style="
        margin: 0px;
        padding: 0px;
        position: absolute;
        width: 100%;
        height: calc(100% - 45px);
        left: 0px;
        top: 45px;
        bottom: 0px;
      "
    ></div>

    <div
      v-show="isMaskShow"
      style="
        position: absolute;
        z-index: 1000000;
        left: 0px;
        top: 0px;
        bottom: 0px;
        right: 0px;
        background: rgba(255, 255, 255, 0.8);
        text-align: center;
        font-size: 40px;
        align-items: center;
        justify-content: center;
        display: flex;
      "
    >
      下载中
    </div>
  </div>
</template>
<script>
import LuckyExcel from "luckyexcel";

const ExcelJS = require("exceljs");
import FileSaver from "file-saver";

import upload from "./upload.vue";
import pck from "./package.json";
export default {
  _options: pck.docs,
  inject: ["root"],
  name: "v2ASheet",
  components: {
    upload,
  },
  props: {
    msg: String,
    title: {
      type: String,
      default: () => {
        return "Luckysheet";
      },
    },
    entityId: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      selected: "",
      options: [
        {
          label: "列表",
          value: "ALCAP_LIST",
        },
        {
          label: "分页",
          value: "ALCAP_PAGEING",
        },
      ],
      isMaskShow: false,
      schema: "",
      entityObj: {},
      sheetData: [],
      config: {},
      dbExportExcelFile: null,

      loading: false,
    };
  },
  async mounted() {
    const ctx = this;
    await ctx.getScriptALinks();
    // In some cases, you need to use $nextTick
    console.log("this.config", this.config);
    ctx.$nextTick(() => {
      // ctx.sheetCreate();

      if (ctx.entityId) {
        ctx.exportEntityData(ctx.entityId);
      }
    });
  },
  watch: {
    "config.entityId": {
      handler(n) {
        this.exportEntityData(n);
      },
    },
    entityId: {
      handler(n) {
        this.exportEntityData(n);
      },
    },
  },
  methods: {
    async getScriptALinks() {
      const links = [
        "files/luckyExcel/plugins/css/pluginsCss.css",
        "files/luckyExcel/plugins/plugins.css",
        "files/luckyExcel/css/luckysheet.css",
        "files/luckyExcel/assets/iconfont/iconfont.css",
      ];

      const scripts = [
        "files/luckyExcel/plugins/js/plugin.js",
        "files/luckyExcel/luckysheet.umd.js",
      ];

      links.forEach((l) => {
        let link = document.createElement("link");
        link.rel = "stylesheet";
        link.async = true;
        link.href = l;
        document.head.appendChild(link);
      });

      scripts.forEach((s) => {
        let script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = s;
        document.head.appendChild(script);
      });
    },
    save() {
      // console.log(this.root);
      const ctx = this;
      const newData = ctx.cellDataToArrData();

      newData.forEach((item, index) => {
        // console.log(
        //   JSON.stringify(newData[index]) !==
        //     JSON.stringify(ctx.sheetData[index])
        // );
        // console.log(newData[index]);
        // console.log(ctx.sheetData[index]);
        if (
          JSON.stringify(newData[index]) !==
          JSON.stringify(ctx.sheetData[index])
        ) {
          ctx.saveTableData(newData[index]);
        }
      });

      if (JSON.stringify(newData) !== JSON.stringify(ctx.sheetData)) {
        setTimeout(() => {
          this.exportEntityData(ctx.entityObj.id);
        }, 1500);
      }
    },
    saveTableData(e) {
      const ctx = this;
      if (ctx.entityObj.type === "db") {
        const primaryField = ctx.entityObj.fields.find(
          (i) => i.primaryKey === "1"
        ).name;
        let params = { entityId: ctx.entityObj.id, fields: [] };
        for (const key in e) {
          ctx.entityObj.fields.forEach((i) => {
            if (i.desc === key) {
              params.fields.push({
                entityFieldId: i.id,
                value: e[key],
              });
            }
          });
        }
        console.log("每一行的参数", params);

        pipe.entity
          .getEntityData(
            ctx.entityObj.id,
            e[primaryField] ? "update" : "create",
            params
          )
          .then((res) => {
            if (res) {
            }
          })
          .catch((err) => {});
      }
    },
    cellDataToArrData() {
      let obj = {};
      let keys = [];
      let tableData = [];
      luckysheet.getAllSheets()[0].celldata.forEach((e) => {
        if (e.r === 0) {
          keys.push(e.v.v);
          obj[e.v.v] = null;
        } else {
          if (!tableData[e.r - 1]) {
            tableData.push(JSON.parse(JSON.stringify(obj)));
          }
          // tableData[e.r - 1][keys[e.c]] =
          this.$set(tableData[e.r - 1], [keys[e.c]], e.v.v || null);
        }
      });
      return JSON.parse(JSON.stringify(tableData)) || [];
    },
    async exportEntityData(n) {
      const ctx = this;
      let entityObj = await pipe.entity.getEntityDetail(n, false);
      ctx.entityObj = entityObj;
      const { dbExportExcel, dataSourceExportExcel } = window.getBffApi();
      const paramsMap = new Map([
        [
          "db",
          [
            {
              entityId: entityObj.id,
              orders: [],
              query: {},
              ranges: [],
              retrieveId: "list",
            },
            dbExportExcel
          ]
        ],
        [
          "data_source",
          [ 
            {
              entityId: entityObj.id,
            },
            dataSourceExportExcel 
          ]
        ],
      ]);
      if (entityObj.type.indexOf('data_factory') > -1) {
        ctx.$notify.error({
          title: "错误",
          message: '不支持该实体！',
        });
        return;
      }
      paramsMap.get(entityObj.type)[1](paramsMap.get(entityObj.type)[0]).then((res) => {
        if (!res || res.size === 0 || res.type === 'application/json') {
            ctx.$notify.error({
            title: "错误",
            message: '无导出内容',
          });
          return
        }
        const content = res;
        const file = new File([content], entityObj.desc + ".xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          lastModified: Date.now(),
        });
        ctx.dbExportExcelFile = file;
        ctx.uploadExcel(file, true);
      }).catch(err=> {
        console.log(err);
      });
    },
    uploadExcel(evt, isFile) {
      const ctx = this;
      let files = [];
      if (isFile) {
        files.push(evt);
      } else {
        files = evt.target.files;
      }
      if (files == null || files.length == 0) {
        alert("No files wait for import");
        return;
      }

      let name = files[0].name;
      let suffixArr = name.split("."),
        suffix = suffixArr[suffixArr.length - 1];
      if (suffix != "xlsx") {
        alert("当前只支持导入xlsx文件");
        return;
      }
      LuckyExcel.transformExcelToLucky(
        files[0],
        async function (exportJson, luckysheetfile) {
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert("excel文件读取内容失败！");
            return;
          }

          console.log("exportJson", exportJson);

          if (!window.luckysheet.destroy) {
            ctx.loading = true;
            setTimeout(() => {
              ctx.uploadExcel(ctx.dbExportExcelFile, true);
            }, 2000);
            return;
          } else {
            ctx.loading = false;
          }
          $(async function () {
            await window.luckysheet.destroy();
            console.log("window.luckysheet",  exportJson.sheets);
            await window.luckysheet.create({
              container: "luckysheet", //luckysheet is the container id
              showinfobar: false,
              lang: "zh", // 设定表格语言
              data: exportJson.sheets,
              title: exportJson.info.name,
              userInfo: exportJson.info.name.creator,
            });

            ctx.sheetData = ctx.cellDataToArrData();
            console.log("初始化后的数据", ctx.sheetData);
          });
        }
      );
    },
    selectExcel(evt) {
      const value = this.selected;
      const name = evt.target.options[evt.target.selectedIndex].innerText;

      if (value == "") {
        return;
      }
      this.isMaskShow = true;

      LuckyExcel.transformExcelToLuckyByUrl(
        value,
        name,
        (exportJson, luckysheetfile) => {
          if (exportJson.sheets == null || exportJson.sheets.length == 0) {
            alert(
              "Failed to read the content of the excel file, currently does not support xls files!"
            );
            return;
          }

          this.isMaskShow = false;
          window.luckysheet.destroy();

          window.luckysheet.create({
            container: "luckysheet", //luckysheet is the container id
            showinfobar: false,
            data: exportJson.sheets,
            title: exportJson.info.name,
            userInfo: exportJson.info.name.creator,
          });
        }
      );
    },
    downloadExcel() {
      const value = this.selected;

      if (value.length == 0) {
        alert("Please select a demo file");
        return;
      }

      var elemIF = document.getElementById("Lucky-download-frame");
      if (elemIF == null) {
        elemIF = document.createElement("iframe");
        elemIF.style.display = "none";
        elemIF.id = "Lucky-download-frame";
        document.body.appendChild(elemIF);
      }
      elemIF.src = value;
    },
    handleExportExcel() {
      this.exportExcel(luckysheet.getluckysheetfile());
    },
    async exportExcel(luckysheet) {
      // 参数为luckysheet.getluckysheetfile()获取的对象
      // 1.创建工作簿，可以为工作簿添加属性
      const workbook = new ExcelJS.Workbook();
      // 2.创建表格，第二个参数可以配置创建什么样的工作表
      luckysheet.every((table) => {
        if (table.data.length === 0) return true;
        const worksheet = workbook.addWorksheet(table.name);
        // 3.设置单元格合并,设置单元格边框,设置单元格样式,设置值
        this.setStyleAndValue(table.data, worksheet);
        this.setMerge(table.config.merge, worksheet);
        this.setBorder(table.config.borderInfo, worksheet);
        return true;
      });
      // 4.写入 buffer
      const buffer = await workbook.xlsx.writeBuffer();
      //调用文件保存插件
      FileSaver.saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        (this.entityObj.desc || "") + new Date().getTime() + ".xlsx"
      );
      return buffer;
    },

    setMerge(luckyMerge = {}, worksheet) {
      const mergearr = Object.values(luckyMerge);
      mergearr.forEach((elem) => {
        // elem格式：{r: 0, c: 0, rs: 1, cs: 2}
        // 按开始行，开始列，结束行，结束列合并（相当于 K10:M12）
        worksheet.mergeCells(
          elem.r + 1,
          elem.c + 1,
          elem.r + elem.rs,
          elem.c + elem.cs
        );
      });
    },

    setBorder(luckyBorderInfo, worksheet) {
      if (!Array.isArray(luckyBorderInfo)) return;
      luckyBorderInfo.forEach(function (elem) {
        var val = elem.value;
        let border = {};
        const luckyToExcel = {
          type: {
            "border-all": "all",
            "border-top": "top",
            "border-right": "right",
            "border-bottom": "bottom",
            "border-left": "left",
          },
          style: {
            0: "none",
            1: "thin",
            2: "hair",
            3: "dotted",
            4: "dashDot", // 'Dashed',
            5: "dashDot",
            6: "dashDotDot",
            7: "double",
            8: "medium",
            9: "mediumDashed",
            10: "mediumDashDot",
            11: "mediumDashDotDot",
            12: "slantDashDot",
            13: "thick",
          },
        };

        if (val) {
          if (val.t != undefined) {
            border["top"] = {
              style: luckyToExcel.style[val.t.style],
              color: val.t.color,
            };
          }
          if (val.r != undefined) {
            border["right"] = {
              style: luckyToExcel.style[val.r.style],
              color: val.r.color,
            };
          }
          if (val.b != undefined) {
            border["bottom"] = {
              style: luckyToExcel.style[val.b.style],
              color: val.b.color,
            };
          }
          if (val.l != undefined) {
            border["left"] = {
              style: luckyToExcel.style[val.l.style],
              color: val.l.color,
            };
          }
          worksheet.getCell(val.row_index + 1, val.col_index + 1).border =
            border;
        }
      });
    },
    setStyleAndValue(cellArr, worksheet) {
      if (!Array.isArray(cellArr)) return;
      cellArr.forEach((row, rowid) => {
        row.every((cell, columnid) => {
          if (!cell) return true;
          let fill = this.fillConvert(cell.bg);
          let font = this.fontConvert(
            cell.ff,
            cell.fc,
            cell.bl,
            cell.it,
            cell.fs,
            cell.cl,
            cell.ul
          );
          let alignment = this.alignmentConvert(
            cell.vt,
            cell.ht,
            cell.tb,
            cell.tr
          );
          let value;
          if (cell.f) {
            value = { formula: cell.f, result: cell.v };
          } else {
            value = cell.v;
          }
          let target = worksheet.getCell(rowid + 1, columnid + 1);
          target.fill = fill;
          target.font = font;
          target.alignment = alignment;
          target.value = value;
          return true;
        });
      });
    },

    fillConvert(bg) {
      // console.log("bg", bg);
      if (!bg) {
        return {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "#ffffff".replace("#", "") },
        };
      }
      let fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: this.colorHex(bg).replace("#", "") },
      };
      console.log(fill);
      return fill;
    },
    //将rgb()转成16进制
    colorHex(color) {
      // RGB颜色值的正则
      var reg = /^(rgb|RGB)/;
      if (reg.test(color)) {
        var strHex = "#";
        // 把RGB的3个数值变成数组
        var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        // 转成16进制
        for (var i = 0; i < colorArr.length; i++) {
          var hex = Number(colorArr[i]).toString(16);
          if (hex === "0") {
            hex += hex;
          }
          strHex += hex;
        }
        return strHex;
      } else {
        return String(color);
      }
    },
    fontConvert(
      ff = 0,
      fc = "#000000",
      bl = 0,
      it = 0,
      fs = 10,
      cl = 0,
      ul = 0
    ) {
      // luckysheet：ff(样式), fc(颜色), bl(粗体), it(斜体), fs(大小), cl(删除线), ul(下划线)
      const luckyToExcel = {
        0: "微软雅黑",
        1: "宋体（Song）",
        2: "黑体（ST Heiti）",
        3: "楷体（ST Kaiti）",
        4: "仿宋（ST FangSong）",
        5: "新宋体（ST Song）",
        6: "华文新魏",
        7: "华文行楷",
        8: "华文隶书",
        9: "Arial",
        10: "Times New Roman ",
        11: "Tahoma ",
        12: "Verdana",
        num2bl: function (num) {
          return num === 0 ? false : true;
        },
      };

      let font = {
        name: luckyToExcel[ff],
        family: 1,
        size: fs,
        color: { argb: fc.replace("#", "") },
        bold: luckyToExcel.num2bl(bl),
        italic: luckyToExcel.num2bl(it),
        underline: luckyToExcel.num2bl(ul),
        strike: luckyToExcel.num2bl(cl),
      };

      return font;
    },

    alignmentConvert(
      vt = "default",
      ht = "default",
      tb = "default",
      tr = "default"
    ) {
      // luckysheet:vt(垂直), ht(水平), tb(换行), tr(旋转)
      const luckyToExcel = {
        vertical: {
          0: "middle",
          1: "top",
          2: "bottom",
          default: "top",
        },
        horizontal: {
          0: "center",
          1: "left",
          2: "right",
          default: "left",
        },
        wrapText: {
          0: false,
          1: false,
          2: true,
          default: false,
        },
        textRotation: {
          0: 0,
          1: 45,
          2: -45,
          3: "vertical",
          4: 90,
          5: -90,
          default: 0,
        },
      };

      let alignment = {
        vertical: luckyToExcel.vertical[vt],
        horizontal: luckyToExcel.horizontal[ht],
        wrapText: luckyToExcel.wrapText[tb],
        textRotation: luckyToExcel.textRotation[tr],
      };
      return alignment;
    },

    borderConvert(borderType, style = 1, color = "#000") {
      // 对应luckysheet的config中borderinfo的的参数
      if (!borderType) {
        return {};
      }
      const luckyToExcel = {
        type: {
          "border-all": "all",
          "border-top": "top",
          "border-right": "right",
          "border-bottom": "bottom",
          "border-left": "left",
        },
        style: {
          0: "none",
          1: "thin",
          2: "hair",
          3: "dotted",
          4: "dashDot", // 'Dashed',
          5: "dashDot",
          6: "dashDotDot",
          7: "double",
          8: "medium",
          9: "mediumDashed",
          10: "mediumDashDot",
          11: "mediumDashDotDot",
          12: "slantDashDot",
          13: "thick",
        },
      };
      let template = {
        style: luckyToExcel.style[style],
        color: { argb: color.replace("#", "") },
      };
      let border = {};
      if (luckyToExcel.type[borderType] === "all") {
        border["top"] = template;
        border["right"] = template;
        border["bottom"] = template;
        border["left"] = template;
      } else {
        border[luckyToExcel.type[borderType]] = template;
      }
      return border;
    },

    sheetCreate() {
      const ctx = this;
      setTimeout(() => {
        $(function () {
          luckysheet.create({
            container: "luckysheet", // 设定DOM容器的id
            title: ctx.title || "luckysheet", // 设定表格名称
            lang: "zh", // 设定表格语言
            plugins: ["chart"],
            data: [
              {
                name: "Cell", //工作表名称
                color: "", //工作表颜色
                index: 0, //工作表索引
                status: 1, //激活状态
                order: 0, //工作表的下标
                hide: 0, //是否隐藏
                row: 36, //行数
                column: 18, //列数
                defaultRowHeight: 19, //自定义行高
                defaultColWidth: 73, //自定义列宽
                celldata: [], //初始化使用的单元格数据
                config: {
                  merge: {}, //合并单元格
                  rowlen: {}, //表格行高
                  columnlen: {}, //表格列宽
                  rowhidden: {}, //隐藏行
                  colhidden: {}, //隐藏列
                  borderInfo: {}, //边框
                  authority: {}, //工作表保护
                },
                scrollLeft: 0, //左右滚动条位置
                scrollTop: 315, //上下滚动条位置
                luckysheet_select_save: [], //选中的区域
                calcChain: [], //公式链
                isPivotTable: false, //是否数据透视表
                pivotTable: {}, //数据透视表设置
                filter_select: {}, //筛选范围
                filter: null, //筛选配置
                luckysheet_alternateformat_save: [], //交替颜色
                luckysheet_alternateformat_save_modelCustom: [], //自定义交替颜色
                luckysheet_conditionformat_save: {}, //条件格式
                frozen: {}, //冻结行列配置
                chart: [], //图表配置
                zoomRatio: 1, // 缩放比例
                image: [], //图片
                showGridLines: 1, //是否显示网格线
                dataVerification: {}, //数据验证配置
              },
              {
                name: "Sheet2",
                color: "",
                index: 1,
                status: 0,
                order: 1,
                celldata: [],
                config: {},
              },
              {
                name: "Sheet3",
                color: "",
                index: 2,
                status: 0,
                order: 2,
                celldata: [],
                config: {},
              },
            ],
          });
        });
      }, 1500);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
