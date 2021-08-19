
// 获取对象第一条数据
const getFirstData = (obj) => {
  for (var key in obj) {
    return obj[key]
  }
}
// 处理返回结果，拼凑字段
export const formatterCurveData = (data, dict) => {
  const xData = []
  const yDatas = []
  // 取出data第一条数据
  const firstData = getFirstData(data)
  // 循环出x轴的刻度
  for (var time in data) {
    const t = time.split('.')[0]
    const l = t.slice(0, 14)
    const r = t.slice(-3)
    for (var j = 0; j < 60; j++) {
      if (j < 10) {
        xData.push(l + '0' + j + r)
        yDatas.push({
          value: null,
          point: null,
          time: l + '0' + j + r,
          k: null
        })
      } else {
        xData.push(l + j + r)
        yDatas.push({
          value: null,
          point: null,
          time: l + j + r,
          k: null
        })
      }
    }
    break // 只循环一次，凑出当前小时内所有分钟刻度
  }
  const series = []
  const lineTitle = []
  // 循环出y轴的值
  for (var k in firstData) {
    dict.forEach(ele => {
      if (k.indexOf('isRun') < 0 && ele.param == k) {
        const arr = []
        for (var key in data) {
          arr.push({
            value: data[key][k] ? data[key][k].val <= 0 ? '0.1' : data[key][k].val : '',
            point: data[key][k] ? data[key][k].val : '',
            time: key.split('.')[0],
            k: k
          })
        }
        // 时间排序
        const mid = []
        const final = []
        arr.forEach(ele => {
          mid.push(ele.time)
        })
        mid.sort()
        for (var i = 0; i < mid.length; i++) {
          arr.forEach(ele => {
            if (ele.time == mid[i]) {
              final.push(ele)
            }
          })
        }
        const yData = JSON.parse(JSON.stringify(yDatas))
        final.forEach(ele => {
          yData.forEach(item => {
            if (ele.time == item.time) {
              item.value = ele.value
              item.k = ele.k
              item.point = ele.point
            }
          })
        })
        series.push({
          name: (ele.sd_name != null ? ele.sd_name + ele.param_cn : ele.param_cn) + (ele.dimension ? '(' + ele.dimension + ')' : ''),
          type: 'line',
          smooth: true,
          // symbol: "none",
          connectNulls: true,
          nameCode: k,
          data: yData
        })
        lineTitle.push((ele.sd_name != null ? ele.sd_name + ele.param_cn : ele.param_cn) + (ele.dimension ? '(' + ele.dimension + ')' : ''))
      }
    })
  }

  // 标题排序
  const legend = {}
  lineTitle.sort()
  const finalSeries = []
  lineTitle.forEach(ele => {
    if (ele == '净烟气so2浓度折算小时均值(mg/Nm³)' || ele.indexOf('PH值') >= 0 || ele == '原烟气so2折算值(mg/Nm³)' || ele == '净烟气so2折算值(mg/Nm³)') {
      legend[ele] = true
    } else {
      legend[ele] = false
    }
    series.forEach(item => {
      if (ele == item.name) {
        finalSeries.push(item)
      }
    })
  })
  return {
    x: xData,
    series: finalSeries,
    legend
  }
}

// 将返回结果拼凑为options结构
export const getOption = (obj) => {
  return {
    title: {
      // text: '折线图堆叠'
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: '#ffffff',
        fontSize: 12
      },
      formatter(res) {
        var html = ''
        res.forEach((item, idx) => {
          !idx ? html += `${item.data.time}<br/>` : null
          html += `
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
                    ${item.seriesName}:${item.data.point ? item.data.point <= 0 ? '0.00' : item.data.point : ''}${item.unit || ''}<br/>
                    `
        })
        return html
      }
    },
    // 标题
    legend: {
      type: 'scroll',
      textStyle: {
        color: 'rgba(105, 255, 249, 1)', // 选中时的颜色
        fontSize: 12
      },
      inactiveColor: 'rgba(255,255,255,0.3)', // 未选中时的颜色
      top: 10,
      left: 40,
      right: 60,
      selected: obj.legend // 设置默认选中
    },
    dataZoom: [
      {
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
      left: '6%',
      right: '6%',
      bottom: 30,
      top: '20%',
      containLabel: false
    },
    color: ['#10cfcb', '#ff514c', '#ffd64a', '#30e600', '#004CFF', '#0000ff', '#c2e4ff', '#c80180', '#008fff', '#7469fb', '#8E551A', '#B59835'],
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: obj.x,
      axisLabel: {
        show: true,
        align: 'center',
        textStyle: {
          color: '#ffffff', // 更改坐标轴文字颜色
          fontSize: 12 // 更改坐标轴文字大小
        }
      },
      axisLine: {
        lineStyle: {
          // 轴线颜色
          color: '#ffffff',
          width: 1 // 轴线宽度
        }
      }
    },
    yAxis: {
      type: 'log',
      show: true,
      axisLine: {
        lineStyle: {
          // 轴线颜色
          color: '#ffffff',
          width: 1 // 轴线宽度
        }
      },
      axisLabel: {
        formatter: function(value) {
          return value === 0.1 ? 0 : value
        }
      },
      splitLine: { // 分隔线
        lineStyle: {
          color: 'rgba(255,255,255,0.1)',
          width: 1
        }
      }
    },
    series: obj.series
  }
}
// 根据字典转换数据结构，获取对应参数的中文名
export const getCustomData = (data, dict) => {
  const list = []
  const elec = []
  for (var key in data) {
    dict.forEach(ele => {
      if (ele.param == key) {
        // 如果首字母是大写
        if (/^[A-Z]+$/.test(key.slice(0, 1))) {
          // 字段名中带有current
          if (key.indexOf('current') > -1) {
            elec.push({
              value: data[key].val,
              unit: ele.sd_name,
              ds: data[key].ds,
              params: key
            })
          } else if (key.indexOf('CaCo3') > -1) { // 首字母大写里排除石灰石
            list.push({
              value: data[key].val,
              unit: ele.param_cn + (ele.dimension ? '(' + ele.dimension + ')' : ''),
              ds: data[key].ds,
              params: key
            })
          }
        } else {
          list.push({
            value: data[key].val,
            unit: ele.param_cn + (ele.dimension ? '(' + ele.dimension + ')' : ''),
            ds: data[key].ds,
            params: key
          })
        }
      }
    })
  }
  // 循环泵电流排序
  const mid = []
  const final = []
  elec.forEach(element => {
    mid.push(element.unit.slice(0, 1))
  })
  mid.sort()
  for (var i = 0; i < mid.length; i++) {
    elec.forEach(elem => {
      if (elem.unit.slice(0, 1) == mid[i]) {
        final.push(elem)
      }
    })
  }
  return {
    elec: final, // 循环泵电流
    list1: list // 初始化页面参数
  }
}

// 添加websocket推送过来的新数据
export const addNewSockData = (diagramDataObj, data) => {
  const { series, x, legend } = diagramDataObj
  for (var key in data) {
    series.forEach(ele => {
      for (var k in data[key]) {
        if (ele.nameCode == k) {
          if (new Date(key).getMinutes() == 0 || new Date(key).getTime() > new Date(x[59]).getTime()) {
            // 每个自然小时清空一次,或者推送过来的时间大于当前小时59分
            ele.data.forEach(item => {
              item.point = null
              item.value = null
              item.k = null
            })
          } else {
            ele.data.forEach(item => {
              if (item.time == key) {
                item.point = data[key][k] ? data[key][k].val : ''
                item.value = data[key][k] ? data[key][k].mult : ''
                item.k = k
              }
            })
          }
        }
      }
    })
    break
  }
  return { series, x, legend }
}

