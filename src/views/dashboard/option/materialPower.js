let dict = {
  'A4G': '吸收剂',
  'INL': '还原剂'
}
let formatData = (data) => {
  let x = new Set()
  let pnc = new Set()
  let y = []
  data.forEach(ele => {
    x.add(ele.DAY)
    pnc.add(ele.PNC)
  })
  let obj = {}
  pnc.forEach(item => {
    let arr = []
    data.forEach(ele => {
      if (item == ele.PNC) {
        arr.push({
          VAL: ele.VAL,
          DAY: ele.DAY
        })
      }
    })
    obj[item] = arr;
  })
  Object.keys(obj).map(k => {
    let list = obj[k]
    let yList = []
    list.forEach(ele => {
      x.forEach(item => {
        if (item == ele.DAY) {
          yList.push(ele.VAL.toFixed(2))
        }
      })
    })
    y.push({
      name: dict[k],
      type: 'bar',
      barWidth: 15,
      label: {
        show: true,
        position: 'top',
      },
      data: yList
    })
  })
  x = [...x]
  return {
    x,
    y
  }
}
export const getMaterialPowerOption = (data) => {
  let obj = formatData(data);
  return {
    title: {
      text: '原材料耗量',
      textStyle: {
        color: "#69fff9",
        fontSize: 16,
        fontWeight: 400
      },
      subtext: "最近十天",
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
    color: ["#5dba6d", "#d67633", "#f6a079", "#309896", "#30e600", "#004CFF", "#0000ff", "#c80180", "#008fff", "#7469fb", "#8E551A", "#B59835"],
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
      show: true,
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
