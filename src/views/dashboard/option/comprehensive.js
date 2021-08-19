let formatData = (data) => {
  let x = new Set()
  let xName = new Set()
  let y = []
  Object.keys(data).map(k => {
    let list = data[k]
    list.forEach(ele => {
      x.add(ele.PNC)
      xName.add(ele.PNC_NAME)
    })
  })
  xName = [...xName]
  Object.keys(data).map(k => {
    let list = data[k];
    let yList = []
    list.forEach(ele => {
      x.forEach(item => {
        if (ele.PNC == item) {
          yList.push({
            value: ele.PERCENT,
            point: ele.VAL
          })
        }
      })
    })
    y.push({
      name: '#' + k.slice(1, 2),
      type: 'bar',
      barWidth: 15,
      label: {
        show: true,
        position: 'top',
        formatter: (value) => value.data.point
      },
      data: yList
    })
  })
  return {
    xName,
    y
  }
}
export const getComprehensiveOption = (data) => {
  let obj = formatData(data);
  return {
    title: {
      text: '综合指标',
      textStyle: {
        color: "#69fff9",
        fontSize: 16,
        fontWeight: 400
      },
      subtext: "最近一天",
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
      formatter(res) {
        var html = "";
        res.forEach((item, idx) => {
          // !idx ? html += `${item.data.time}<br/>` : null;
          html += `
              <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
              ${item.name}:${item.data.point || ""}<br/>
              `
        })
        return html
      }
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
    color: ["#ee6666", "#8fd5f4", "#309896", "#F4002E", "#30e600", "#004CFF", "#0000ff", "#c80180", "#008fff", "#7469fb", "#8E551A", "#B59835"],
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: obj.xName,
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
      show: false,
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
