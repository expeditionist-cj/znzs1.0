import moment from 'moment'
// 处理曲线数据
export const formateData = (data, name) => {

  let xData = []
  let yData = [];
  data.forEach(ele => {
    xData.push(ele.time)
    yData.push(ele.value)
  })
  let series = [];
  series.push({
    name: name,
    type: "line",
    smooth: true,
    connectNulls: true,
    data: yData,
  });
  return {
    x: xData,
    series
  }
}
// 处理催化剂活性曲线数据
export const formateCatalyzerData = (Activities, hisActivities) => {

  let xData = []
  let yData1 = [];
  let yData2 = [];
  Activities.forEach(ele => {
    yData1.push(ele.value)
  })
  hisActivities.forEach(ele => {
    xData.push(ele.time)
    yData2.push(ele.value)
  })
  let series = [];
  series.push({
    name: '真实活性',
    type: "line",
    smooth: true,
    connectNulls: true,
    data: yData1,
  });
  series.push({
    name: '预测活性',
    type: "line",
    smooth: true,
    connectNulls: true,
    data: yData2,
  });
  return {
    x: xData,
    series
  }
}

// function getXdata() {
//   let xData = [];
//   // let now = moment().format("YYYY-MM-DD HH:mm:ss");
//   for (let i = 0; i < 30 * 24; i++) {
//     xData.push(moment().add(i, 'hours').format("YYYY-MM-DD HH:mm:ss"))
//   }
//   // xData.sort();
//   return xData
// }

export const getOption = (obj, name='') => {
  // let mid = moment().format("HH:mm");
  // obj.series[0].markLine = {
  //   symbol: ['none', 'none'],
  //   itemStyle: {
  //     normal: {
  //       lineStyle: {
  //         type: 'dashed',
  //         color: 'red',
  //       },
  //       label: {
  //         show: true,
  //         position: 'end',
  //         distance: 20,
  //         textStyle: {
  //           color: 'red',
  //           fontSize: 14,
  //         },
  //         formatter: function () {
  //           return ''
  //         }
  //       }
  //     }
  //   },
  //   data: [{
  //     xAxis: mid,
  //   }]
  // }
  return {
    title: {
      // text: '折线图堆叠'
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: "#ffffff",
        fontSize: 12
      },
      // formatter(res) {
      //     var html = "";
      //     res.forEach((item, idx) => {
      //         !idx ? html += `${item.data.time}<br/>` : null;
      //         html += `
      //         <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
      //         ${item.seriesName}:${item.data.point || ""}${item.unit || ""}<br/>
      //         `

      //     })
      //     return html
      // }
    },
    // 标题
    legend: {
      show: false,
      textStyle: {
        color: "rgba(105, 255, 249, 1)", //选中时的颜色
        fontSize: 12
      },
      inactiveColor: "rgba(255,255,255,0.3)", //未选中时的颜色
      top: -10,
    },
    dataZoom: [{
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'filter'
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'filter'
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'filter'
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'filter'
      }
    ],
    grid: {
      left: '10%',
      right: '5%',
      bottom: '20%',
      top: '15%',
      containLabel: false
    },
    color: ["#10cfcb", "#ffd64a", "#c2e4ff", "#ff514c", "#30e600", "#004CFF", "#0000ff", "#c80180", "#008fff", "#7469fb", "#8E551A", "#B59835"],
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: obj.x,
      axisLabel: {
        show: true,
        align: 'center',
        textStyle: {
          color: '#ffffff', //更改坐标轴文字颜色
          fontSize: 12 //更改坐标轴文字大小
        }
      },
      axisLine: {
        lineStyle: {
          //轴线颜色
          color: '#ffffff',
          width: 1, //轴线宽度
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          //轴线颜色
          color: '#ffffff',
          width: 1, //轴线宽度
        }
      },
      name: name, 
      splitLine: { //分隔线
        lineStyle: {
          color: 'rgba(255,255,255,0.1)',
          width: 1
        }
      }
    },
    series: obj.series
  }
}
