let dict = {
    sumDevicePower: '循环泵总耗电量(KWh)',
    sumPower: '发电量(kWh)',
    so2Hdh: '耗电量(kWh)/减排量(t)',
    devicePowerPop: '占比电耗(%)',
    so2Jp: '二氧化硫减排量(t)',
}
//获取对象第一条数据
let getFirstData = (obj) => {
    for (var key in obj) {
        return obj[key]
    }
}
// 处理返回结果，拼凑字段
export const formatterCurveData = (obj) => {
    let xData = [];
    let series = [];
    let firstData = getFirstData(obj);
    //循环出x轴的刻度
    for (var key in obj) {
        xData.push(key)
    }
    // 循环y轴的值
    for (var k in firstData) {
        if (/^[A-Z]+$/.test(k.slice(0, 1))) {
            let arr = [];
            for (var key in obj) {
                if (k.indexOf('mult') < 0) {
                    arr.push({
                        point: obj[key][k],
                        value: obj[key]['mult_' + k]
                    })
                }
            }
            if (k.indexOf('mult') < 0) {
                series.push({
                    name: k.slice(0, 1) + '泵(KWh)',
                    type: 'line',
                    smooth: true,
                    data: arr
                })
            }
        } else {
            let arr = [];
            for (var key in obj) {
                if (k.indexOf('mult') < 0) {
                    arr.push({
                        point: obj[key][k],
                        value: obj[key]['mult_' + k]
                    })
                }
            }
            if (k.indexOf('mult') < 0) {
                series.push({
                    name: dict[k],
                    type: 'line',
                    smooth: true,
                    // symbol: "none",
                    connectNulls: true,
                    data: arr
                })
            }
        }
    }
    // 标题排序
    let lineTitle = [];
    let finalSeries = [];
    series.forEach(ele => {
        lineTitle.push(ele.name)
    })
    lineTitle.sort();
    lineTitle.forEach(ele => {
        series.forEach(item => {
            if (ele == item.name) {
                finalSeries.push(item)
            }
        })
    })
    return {
        x: xData,
        series: finalSeries
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
                color: "#ffffff",
                fontSize: 12
            },
            formatter(res) {
                var html = "";
                res.forEach((item, idx) => {
                    !idx ? html += `${item.name}<br/>` : null;
                    html += `
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
                    ${item.seriesName}:${item.data.point || ""}${item.unit || ""}<br/>
                    `
                })
                return html
            }
        },
        legend: {
            textStyle: {
                color: "rgba(105, 255, 249, 1)",
                fontSize: 12
            },
            inactiveColor: "rgba(255,255,255,0.3)",
            top: 10,
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
        color: ["#10CFCB", "#FF0700", "#F8E71C", "#30E600", "#004CFF", "#8B8BFF", "#CDB091", "#C96E9F", "#FF6400", "#686868", "#FFFFFF", "#A52FFF", "#398E1A"],
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: obj.x,
            axisLabel: {
                show: true,
                align: 'center',
                textStyle: {
                    color: '#ffffff',  //更改坐标轴文字颜色
                    fontSize: 12     //更改坐标轴文字大小
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
            show: false,
            axisLine: {
                lineStyle: {
                    //轴线颜色
                    color: '#ffffff',
                    width: 1, //轴线宽度
                }
            },
            splitLine: {  //分隔线
                lineStyle: {
                    color: 'rgba(255,255,255,0.1)',
                    width: 1
                }
            }
        },
        series: obj.series
    }
}
//拼凑泵耗电量结构
export const getElectricity = (obj) => {
    let arry = [];
    let list = [];
    arry.push({ value: obj['sumDevicePower'], unit: '总耗电量' })
    // 拿出首字母大写的字段
    for (var key in obj) {
        if (/^[A-Z]+$/.test(key.slice(0, 1))) {
            list.push(key.slice(0, 1))
        }
    }
    // 排序
    list.sort();
    for (var i = 0; i < list.length; i++) {
        for (var k in obj) {
            if (k.slice(0, 1) == list[i]) {
                // 按顺序push进数组
                arry.push({ value: obj[k] > 0 ? obj[k] : 0 , unit: list[i] + '泵' })
            }
        }
    }
    return arry
}