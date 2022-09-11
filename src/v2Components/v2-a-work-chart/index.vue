<template>
  <div class="v2-a-work-chart">
    <div class="agency-chart">
      <div class="container" ref="container" id="container">
        <div
          class="chart"
          ref="chart"
          id="chart"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import pck from "./package.json";
import { BASE_BAR, BASE_LINE, BASE_PIE } from "./config/chart";
import elementResizeDetectorMaker from 'element-resize-detector'
export default {
  _options: pck.docs,
  name: "v2AWorkChart",

  data() {
    return {
      chart: null,
      list: []
    };
  },
  props: {
    config: {},
    page: {},
  },
  computed: {
    option() {
      return this.config.fields.chartType;
    },
    configs() {
      return this.config.fields;
    },
    entity() {
      return this.config.entityId;
    }
  },
  watch: {
    configs: {
      deep: true,
      // immediate: true,
      handler() {
        this.changeOption();
      },
    },
    list: {
      deep: true,
      // immediate: true,
      handler() {
        this.changeOption();
      },
    },
    entity:{
      handler() {
        this.getData();
      },
    }
  },
  methods: {
    getMap() {
      this.chart = this.$echarts.init(this.$refs.chart, "purple-passion");
      this.chart.setOption(BASE_LINE || {}, true);
      this.chart.resize();
    },
    // 根据父容器调整图表尺寸
    chartssize (container,charts) {
      function getStyle(el) {
        if (window.getComputedStyle) {
          return window.getComputedStyle(el, null)
        } else {
          return el.currentStyle
        }
      }
      var wi = getStyle(container, 'width').width;
      var hi = getStyle(container, 'height').height;
      charts.style.width = wi
      charts.style.height = hi
    },
    async getData() {
      try {
        if (this.config.entityId) {
          const res = await pipe.entity.getEntityData(
            this.config.entityId,
            "ALCAP_PAGEING",
            {
              entityId: this.config.entityId,
              orders: [],
              pageNum: 1,
              pageSize: 10000,
              query: {},
              ranges: [],
              retrieveId: "paging",
            }
          );
          if (res.response) {
            this.list = res.response.content.map((i) => {
              return {
                ...i,
                hoverIndex: -1,
              };
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    changeOption() {
      let type = this.config.fields.chartType;
      let option = this.setData(type);
      this.chart.setOption(option, true);
      this.chart.resize();
    },
    setData(val) {
      let type = ''
      switch (val) {
        case 'bar':
          type = BASE_BAR
          break
        case 'line':
          type = BASE_LINE
          break
        default:
          type = BASE_PIE
      }

      if(val === 'line' || val === 'bar') {
      let option = JSON.parse(JSON.stringify(type));
      option.series = []
      let mulDimensionAry = [] 
      //处理横坐标数据
      if(this.config.fields.xAxis.length >1) {
        let ary1 = []
        let ary2 = []
        this.list.forEach((i) => {
          ary1.push(i[this.config.fields.xAxis[0].value])
          ary2.push(i[this.config.fields.xAxis[1].value])
        })

        //构建数据数组
        for(let i = 0; i< ary1.length; i++){
          for(let j = 0; j<ary2.length;j++) {
            let res = ary1[i] + '\n' + ary2[j] 
            mulDimensionAry.push({
              name: res,
              value: 0,
              exist: false
            })
          }
        }
      } else {
        this.list.forEach((item) => {
            mulDimensionAry.push({
              name: item[this.config.fields.xAxis[0].value],
              value: 0,
              exist: false
            })
        });
      }

      //处理纵坐标数据
      this.config.fields.yAxis.forEach(i => {
        let copyOption = JSON.parse(JSON.stringify(type));
        let series = JSON.parse(JSON.stringify(copyOption.series[0]))
        let resultAry = []
        let setAry
        if(this.config.fields.xAxis.length>1) {
          let xDataFst = ''
          let xDataSed =''
          xDataFst = this.config.fields.xAxis[0].value
          xDataSed = this.config.fields.xAxis[1].value
          for(let j =0; j<mulDimensionAry.length; j++) {
            let xValue = mulDimensionAry[j].name
            let before = xValue.split('\n')[0]
            let after = xValue.split('\n')[1]
            this.list.forEach(v => {
              if(v[xDataFst] === before && v[xDataSed] === after){
                mulDimensionAry[j].value = (Number(v[i.value]))
                mulDimensionAry[j].exist = true
              }
            })
          }

          //去重
          let map = new Map();
          for (let item of mulDimensionAry) {
              if (!map.has(item.name)) {
                  map.set(item.name, item)
              }
          }
          mulDimensionAry = [...map.values()];
          option.xAxis.data = []
          mulDimensionAry.forEach(i => {
            option.xAxis.data.push(i.name)
            series.data.push(i.value)
          })
          resultAry = JSON.parse(JSON.stringify(mulDimensionAry));
          setAry = JSON.parse(JSON.stringify(mulDimensionAry));
        } else {
          //处理整个数据合集，累加同维度数值
          this.list.forEach((s,index) => {
            mulDimensionAry[index].value = s[i.value]
            mulDimensionAry[index].exist = true
          })
          resultAry = mulDimensionAry.reduce((total,cur) =>{
            let hasValue = total.findIndex(current => {
              return current.name === cur.name
            })
            hasValue === -1 && total.push(cur)
            hasValue !==-1 && (total[hasValue].value = Number(total[hasValue].value) + Number(cur.value))
            return total
          },[])
          setAry = JSON.parse(JSON.stringify(resultAry));
          option.xAxis.data = []
          if(!i.showName){
            series.name = i.name
            option.legend.data.push(i.name)
          } else {
            series.name = i.showName
            option.legend.data.push(i.showName)
          }
          setAry.forEach((s) => {
            option.xAxis.data.push(s.name)
            series.data.push(s.value)
          });
        }

        //汇总方式
        if(i.duplicate === 'count') {
          let resultArr = this.dataCount(mulDimensionAry)
          series.data = []
          option.xAxis.data = []
          setAry = JSON.parse(JSON.stringify(resultArr))
          resultArr.forEach((s) => {
            option.xAxis.data.push(s.name)
            series.data.push(s.value)
          });
        } else if (i.duplicate === 'summary') {
          setAry = JSON.parse(JSON.stringify(resultAry));
          option.xAxis.data = []
          option.legend.data.push(i.name)
          if(!i.showName){
            series.name = i.name
            option.legend.data.push(i.name)
          } else {
            series.name = i.showName
            option.legend.data.push(i.showName)
          }
          setAry.forEach((s) => {
            option.xAxis.data.push(s.name)
            series.data.push(s.value)
          });
        } else if(i.duplicate === 'duplicate') {
          let map = new Map();
          for (let item of mulDimensionAry) {
              if (!map.has(item.name)) {
                  map.set(item.name, item)
              }
          }
          mulDimensionAry = [...map.values()]
          
          let resultArr = this.dataCount(mulDimensionAry)
          series.data = []
          option.xAxis.data = []
          setAry = JSON.parse(JSON.stringify(resultArr))
          resultArr.forEach((s) => {
            option.xAxis.data.push(s.name)
            series.data.push(s.value)
          });
        }

        // 排序
        if(i.sort !== 'default') {
          setAry = this.dataSort(i.sort, setAry)
          option.xAxis.data = []
          series.data = []
          setAry.forEach((s) => {
            option.xAxis.data.push(s.name)
            series.data.push(s.value)
        });
        }

        //高级计算(占比)
        if(i.compute === 'percentage') {
          let j = eval(series.data.join('+'));
          let resultArray = [];
          for (let l = 0 ; l < series.data.length ; l++){
              var k = Math.ceil((series.data[l]/j)*100);
              resultArray.push(k);
          }
          series.data = resultArray
          series.itemStyle.normal.label.formatter = '{c}%'
        }
        option.series.push(series)
        console.log(option);
      })
      return option
      } else {
        // 处理数据集
        let option = JSON.parse(JSON.stringify(type));
        option.series[0].data = []
        let mulDimensionAry = [] 
        this.list.forEach((item) => {
            mulDimensionAry.push({
              name: item[this.config.fields.xAxis[0].value],
              value: 0,
              exist: false
            })
        });

        this.config.fields.yAxis.forEach(i => {
          let resultAry = []
          let setAry
          this.list.forEach((s,index) => {
            mulDimensionAry[index].value = s[i.value]
            mulDimensionAry[index].exist = true
          })
          resultAry = mulDimensionAry.reduce((total,cur) =>{
            let hasValue = total.findIndex(current => {
              return current.name === cur.name
            })
            hasValue === -1 && total.push(cur)
            hasValue !==-1 && (total[hasValue].value = Number(total[hasValue].value) + Number(cur.value))
            return total
          },[])

          setAry = JSON.parse(JSON.stringify(resultAry));
          option.series[0].data = []
          setAry.forEach((item) => {
            option.series[0].data.push({
              value: item.value,
              name: item.name,
              });
          });


        if(i.duplicate === 'count') {
          let resultArr = this.dataCount(mulDimensionAry)
          option.series[0].data = []
          setAry = JSON.parse(JSON.stringify(resultArr))
          resultArr.forEach((item) => {
            option.series[0].data.push({
              value: item.value,
              name: item.name,
              });
          });
          
        } else if (i.duplicate === 'summary') {
          setAry = JSON.parse(JSON.stringify(resultAry));
          option.series[0].data = []
          setAry.forEach((item) => {
            option.series[0].data.push({
              value: item.value,
              name: item.name,
              });
          });
        } else if(i.duplicate === 'duplicate') {
          let map = new Map();
          for (let item of mulDimensionAry) {
              if (!map.has(item.name)) {
                  map.set(item.name, item)
              }
          }
          mulDimensionAry = [...map.values()]
          
          let resultArr = this.dataCount(mulDimensionAry)
          option.series[0].data = []
          setAry = JSON.parse(JSON.stringify(resultArr))
          resultArr.forEach((item) => {
            option.series[0].data.push({
              value: item.value,
              name: item.name,
              });
          });

        }

          // 排序
          let temp = this.config.fields.yAxis[0]
          if(temp.sort === 'asc') {
            option.series[0].data.sort((a, b) => { return a.value - b.value})
          } else if (temp.sort === 'desc') {
            option.series[0].data.sort((a, b) => {return b.value - a.value})
          }

          // 占比
          if (i.compute === 'percentage') {
            option.series[0].itemStyle.normal.label.formatter = '{b}({d}%)'
          }
        })
        console.log(option);
        return option
      }
    },
    dataSort(sort, setAry) {
      if(sort === 'asc') {
        setAry.sort((a, b) => { return a.value - b.value})
      } else if (sort === 'desc') {
        setAry.sort((a, b) => {return b.value - a.value})
      }
      return setAry
    },
    dataCount(mulDimensionAry){
          let allItems = []
          mulDimensionAry.forEach(s =>{
            allItems.push(s.name)
          })

          let tempArr = []
          let obj = {}
          let resultArr = []

          allItems.forEach(v=>{
            if(!tempArr.includes(v)) {
              tempArr.push(v)
            }
          })
          allItems.forEach((v, index)=>{
            if(obj[v] && mulDimensionAry[index].exist) {
              obj[v]++
            }else if(mulDimensionAry[index].exist) {
              obj[v] = 1
            } else {
              obj[v] = 0
            }
          })
          tempArr.forEach(v=>{
            resultArr.push({
              name: v,
              value: obj[v]
            })
          })
          
          return resultArr
    }
    
  },
  mounted() {
    const ctx = this;
    this.getData();
    setTimeout(() => {
      ctx.$nextTick(() => {
        ctx.getMap();
      });
    });

    const that = this
    // 插件获取dom变化
    const erd = elementResizeDetectorMaker()
    erd.listenTo(document.getElementById('container'), () => {
      that.$nextTick(() => {
        that.chartssize(that.$refs.container,that.$refs.chart)
        that.chart.resize()
      })
    })

    // ResizeObserver方法获取dom变化（兼容问题）
    // let dom = document.getElementById('chart')
    // let ro = new ResizeObserver(() => {
    //       ctx.chart.resize();
    //     });
    //     ro.observe(dom);
  },

};
</script>

<style lang="less" scoped>
.v2-a-work-chart {
  width: 1239px;
  background: #ffffff;
  opacity: 1;
  border-radius: 6px;
  padding: 19px 0 22px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .agency-chart {
    width: 100%;
    height: 100%;
    .top {
      width: 96%;
    }
    .container{
        height: 95%;
        width: 100%;
      .chart {
        height: 200px;
        width: 100%;
      }      
    }

  }

  .top {
    width: 92%;
    height: 16px;
    box-sizing: border-box;
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .top-left {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 32px;
      color: #333333;
      opacity: 1;
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
    .top-right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 400;
      line-height: 36px;
      color: #a4aeb4;
      &:hover {
        color: #3698f2;
        cursor: pointer;
      }
      .time-item {
        width: 38px;
        height: 24px;
        opacity: 1;
        color: #374e71;
        font-size: 12px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        line-height: 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background: #50a8ff;
          color: #ffffff;
        }
      }
      .actived {
        background: #50a8ff;
        color: #ffffff;
      }
    }
  }
}
</style>
