let dict = {
  'A3N': 'SO2',
  'A1D': 'NOx'
}
let formatData = (data) => {
  let x = new Set()
  let y = []
  Object.keys(data).map(k => {
    let arr = data[k];
    arr.forEach(ele => {
      x.add(ele.HR);
    })
    return
  })
  x = [...x];
  x.sort(); 
  Object.keys(data).map(k => {
    let list = data[k]; 
    let yList = []
    list.forEach(ele => {
      x.forEach(item => {
        if (ele.HR == item) {
          yList.push(ele.VAL.toFixed(2))
        }
      })
    })
    y.push({
      name: '#' + k.slice(1, 2) + " " + dict[k.split('_')[1]],
      type: 'line',
      smooth: true,
      data: yList
    })
  }) 
  return {
    x,
    y
  }
}
export const getInstantOption = (data) => {
  let obj = formatData(data);
  return {
    title: {
      text: '瞬时指标',
      textStyle: {
        color: "#69fff9",
        fontSize: 16,
        fontWeight: 400
      },
      subtext: "最近8小时均值",
      subtextStyle: {
        fontSize: 12,
        fontWeight: 400
      },
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: "rgba(105, 255, 249, 0.8)",
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
      show: true,
      textStyle: {
        color: "rgba(105, 255, 249, 0.8)", //选中时的颜色
        fontSize: "0.12rem",
        fontWeight: 400
      },
      width:'200',
      inactiveColor: "rgba(255,255,255,0.3)", //未选中时的颜色
      top: 10,
      right: 10
    },
    dataZoom: [{
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'filter',
        disabled: true
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'filter',
        disabled: true
      },
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'filter',
        disabled: true
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'filter',
        disabled: true
      }
    ],
    grid: {
      left: '8%',
      right: '5%',
      bottom: '20%',
      top: '30%',
      containLabel: false
    },
    color: ["#efbb14", "#ef8914", "#8fd5f4", "#748ede", "#30e600", "#004CFF", "#0000ff", "#c80180", "#008fff", "#7469fb", "#8E551A", "#B59835"],
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: obj.x,
      axisLabel: {
        show: true,
        align: 'center',
        textStyle: {
          color: 'rgba(255,255,255,0.5)', //更改坐标轴文字颜色
          fontSize: 10 //更改坐标轴文字大小
        }
      },
      axisLine: {
        lineStyle: {
          //轴线颜色
          color: 'rgba(255,255,255,0.5)',
          width: 1, //轴线宽度
        }
      }
    },
    yAxis: {
      show:true,
      type: 'value',
      axisLine: {
        lineStyle: {
          //轴线颜色
          color: 'rgba(255,255,255,0.5)',
          width: 1, //轴线宽度
        }
      },
      splitLine: { //分隔线
        lineStyle: {
          color: 'rgba(255,255,255,0.1)',
          width: 1
        }
      }
    },
    series: obj.y
  }
}
