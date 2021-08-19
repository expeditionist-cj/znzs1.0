// 初始参数
export const params = {
    "11_A": [

        {
            "vaule": 45.0,
            name: "催化剂初始活性",
            unit: ""
        },
        {
            name: "催化剂用量",
            unit: "m3",
            vaule: "100.0"
        },
        {
            name: "催化剂比表面积 ",
            unit: "m2/m3",
            vaule: "20.0"
        },
        {
            name: "催化剂面速度",
            unit: " m/h",
            vaule: "10.0"
        },
        {
            "initAct": 45.0,
            "amount": 100.0,
            "ssa": 20.0,
            "sv": 10.0,
            "startUseDay": "2018/6/30",
            "dsLife": 24000,
            name: "催化剂开始使用时间",
            unit: " m/h",
            vaule: "2018/6/30"
        },
        {
            "initAct": 45.0,
            "amount": 100.0,
            "ssa": 20.0,
            "sv": 10.0,
            "startUseDay": "2018/6/30",
            "dsLife": 24000,
            name: "设计寿命",
            unit: "  h",
            vaule: "24000"
        },
    ],
    "11_B": [{
            "vaule": 45.0,
            name: "催化剂初始活性",
            unit: ""
        },
        {
            name: "催化剂用量",
            unit: "m3",
            vaule: "100.0"
        },
        {
            name: "催化剂比表面积 ",
            unit: "m2/m3",
            vaule: "20.0"
        },
        {
            name: "催化剂面速度",
            unit: " m/h",
            vaule: "10.0"
        },
        {
            "initAct": 45.0,
            "amount": 100.0,
            "ssa": 20.0,
            "sv": 10.0,
            "startUseDay": "2018/6/30",
            "dsLife": 24000,
            name: "催化剂开始使用时间",
            unit: " m/h",
            vaule: "2018/6/30"
        },
        {
            "initAct": 45.0,
            "amount": 100.0,
            "ssa": 20.0,
            "sv": 10.0,
            "startUseDay": "2018/6/30",
            "dsLife": 24000,
            name: "设计寿命",
            unit: "  h",
            vaule: "24000"
        },
    ],
    "22_A": {
        "initAct": 45.0,
        "amount": 100.0,
        "ssa": 20.0,
        "sv": 10.0,
        "startUseDay": "2018/6/30",
        "dsLife": 24000
    },
    "22_B": {
        "initAct": 45.0,
        "amount": 100.0,
        "ssa": 20.0,
        "sv": 10.0,
        "startUseDay": "2018/6/30",
        "dsLife": 24000
    }
}

export const basicInfo = {
    "11_A@2020-11-02": {
        "did": 1120,
        "tm": "2020-11-02 20:00:00",
        "outSmkFlow": 378499.7,
        "inNoxCv": 993.57,
        "outNOxCv": 12.04,
        "noxRate": 98.74,
        "nh3Amount": 208.6,
        "naRate": 2.98,
        "smkTmpr": 372.18
    },
    "11_A@2020-11-03": {
        "did": 1124,
        "tm": "2020-11-03 20:00:00",
        "outSmkFlow": 440792.2,
        "inNoxCv": 934.14,
        "outNOxCv": 11.26,
        "noxRate": 98.72,
        "nh3Amount": 239.71,
        "naRate": 3.51,
        "smkTmpr": 373.44
    },
    "11_A@2020-11-04": {
        "did": 1125,
        "tm": "2020-11-04 20:00:00",
        "outSmkFlow": 585709.9,
        "inNoxCv": 961.97,
        "outNOxCv": 12.75,
        "noxRate": 98.64,
        "nh3Amount": 210.46,
        "naRate": 3.04,
        "smkTmpr": 377.44
    },
    "11_B@2020-11-02": {
        "did": 1120,
        "tm": "2020-11-03 20:00:00",
        "outSmkFlow": 440792.2,
        "inNoxCv": 934.14,
        "outNOxCv": 11.26,
        "noxRate": 98.72,
        "nh3Amount": 239.71,
        "naRate": 3.51,
        "smkTmpr": 373.44
    },
    "11_B@2020-11-03": {
        "did": 1124,
        "tm": "2020-11-03 20:00:00",
        "outSmkFlow": 440792.2,
        "inNoxCv": 934.14,
        "outNOxCv": 11.26,
        "noxRate": 98.72,
        "nh3Amount": 239.71,
        "naRate": 3.51,
        "smkTmpr": 373.44
    },
    "11_B@2020-11-04": {
        "did": 1125,
        "tm": "2020-11-04 20:00:00",
        "outSmkFlow": 585709.9,
        "inNoxCv": 961.97,
        "outNOxCv": 12.75,
        "noxRate": 98.64,
        "nh3Amount": 210.46,
        "naRate": 3.04,
        "smkTmpr": 377.44
    }
}

export const suggestData = {
    "1120": {
        "sg": "催化剂失活严重1，建议及时更换; 剩余可用时间：300小时",
        "lines": [{
            "outSmkFlow": 485753.3,
            "naRate": 3.1,
            "outNOxCv": 10.8,
            "useHour": 63.5,
            "act": 44.4,
            "smkTmpr": 370.7,
            "inNoxCv": 965.9,
            "nnRate": 1.0,
            "noxRate": 98.8,
            "nh3Amount": 201.9,
            "outSmkFlow_s": 48.57533,
            "naRate_s": 31,
            "outNOxCv_s": 10.8,
            "useHour_s": 63.5,
            "act_s": 44.4,
            "smkTmpr_s": 37.07,
            "inNoxCv_s": 96.59,
            "nnRate_s": 1.0,
            "noxRate_s": 98.8,
            "nh3Amount_s": 20.9
        }, {
            "outSmkFlow": 479626.5,
            "naRate": 3.4,
            "outNOxCv": 11.4,
            "useHour": 64.9,
            "act": 44.8,
            "smkTmpr": 380.7,
            "inNoxCv": 933.7,
            "nnRate": 1.0,
            "noxRate": 98.8,
            "nh3Amount": 235.0
        }, {
            "outSmkFlow": 477568.2,
            "naRate": 2.5,
            "outNOxCv": 10.6,
            "useHour": 65.4,
            "act": 43.1,
            "smkTmpr": 371.7,
            "inNoxCv": 864.7,
            "nnRate": 1.0,
            "noxRate": 98.7,
            "nh3Amount": 178.2
        }],
        "lifeHour": 300
    },
    "1124": {
        "sg": "催化剂失活严重，建议及时更换; 剩余可用时间：300小时",
        "lines": [{
            "outSmkFlow": 485753.3,
            "naRate": 3.1,
            "outNOxCv": 10.8,
            "useHour": 63.5,
            "act": 44.4,
            "smkTmpr": 370.7,
            "inNoxCv": 965.9,
            "nnRate": 1.0,
            "noxRate": 98.8,
            "nh3Amount": 201.9
        }, {
            "outSmkFlow": 479626.5,
            "naRate": 3.4,
            "outNOxCv": 11.4,
            "useHour": 64.9,
            "act": 44.8,
            "smkTmpr": 380.7,
            "inNoxCv": 933.7,
            "nnRate": 1.0,
            "noxRate": 98.8,
            "nh3Amount": 235.0
        }, {
            "outSmkFlow": 477568.2,
            "naRate": 2.5,
            "outNOxCv": 10.6,
            "useHour": 65.4,
            "act": 43.1,
            "smkTmpr": 371.7,
            "inNoxCv": 864.7,
            "nnRate": 1.0,
            "noxRate": 98.7,
            "nh3Amount": 178.2
        }],
        "lifeHour": 300
    },
    "1125": {
        "sg": "催化剂失活严重，建议及时更换;催化剂可用剩余时间：300小时",
        "lines": [{
            "outSmkFlow": 485753.3,
            "naRate": 3.1,
            "outNOxCv": 10.8,
            "useHour": 63.5,
            "act": 44.4,
            "smkTmpr": 370.7,
            "inNoxCv": 965.9,
            "nnRate": 1.0,
            "noxRate": 98.8,
            "nh3Amount": 201.9
        }, {
            "outSmkFlow": 479626.5,
            "naRate": 3.4,
            "outNOxCv": 11.4,
            "useHour": 64.9,
            "act": 44.8,
            "smkTmpr": 380.7,
            "inNoxCv": 933.7,
            "nnRate": 1.0,
            "noxRate": 98.8,
            "nh3Amount": 235.0
        }, {
            "outSmkFlow": 477568.2,
            "naRate": 2.5,
            "outNOxCv": 10.6,
            "useHour": 65.4,
            "act": 43.1,
            "smkTmpr": 371.7,
            "inNoxCv": 864.7,
            "nnRate": 1.0,
            "noxRate": 98.7,
            "nh3Amount": 178.2
        }],
        "lifeHour": 300
    }
}
export const dict = {
    "outSmkFlow": '烟气量(nm3/h)',
    "naRate": '氨空比',
    "outNOxCv": '出口Nox浓度(mg/Nm3)',
    "useHour": '服役时间',
    "act": '活性',
    "smkTmpr": '烟气温度(°C)',
    "inNoxCv": '入口Nox浓度(mg/Nm3)',
    "nnRate": '氨氮比',
    "noxRate": '脱硝效率(%)',
    "nh3Amount": '喷氨量(kg/h)'
}

export const getoption = (obj) => {
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
                console.log(res);
                res.forEach((item, idx) => {
                    !idx ? html += `时间：${item.axisValue}<br/>` : null;
                    html += `
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
                    ${item.seriesName}:${item.data.pointValue || ""}${item.data.unit || ""}<br/>
                    `

                })
                return html
            }
        },
        // 标题
        legend: {
            textStyle: {
                color: "rgba(105, 255, 249, 1)", //选中时的颜色
                fontSize: 12
            },
            inactiveColor: "rgba(255,255,255,0.3)", //未选中时的颜色
            top: 10,
            selected: obj.legend, //设置默认选中
            data: obj.legend,
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
            left: '6%',
            right: '6%',
            bottom: 30,
            top: '20%',
            containLabel: false
        },
        color: ["#10cfcb", "#ff514c", "#ffd64a", "#30e600", "#004CFF", "#0000ff", "#c2e4ff", "#c80180", "#008fff", "#7469fb", "#8E551A", "#B59835"],
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: obj.x,
            axisLabel: {
                show: true,
                align: 'center',
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.32)', //更改坐标轴文字颜色
                    fontSize: 12 //更改坐标轴文字大小
                }
            },
            axisLine: {
                lineStyle: {
                    //轴线颜色
                    color: 'rgba(255, 255, 255, 0.32)',
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
                    color: 'rgba(255, 255, 255, 0.32)',
                    width: 1, //轴线宽度
                }
            },
            splitLine: { //分隔线
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    width: 1
                }
            }
        },
        series: obj.y
    }
}

export const getoption1 = (obj) => {
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
                console.log(res);
                res.forEach((item, idx) => {
                    !idx ? html += `时间：${item.axisValue}<br/>` : null;
                    html += `
                  <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
                  ${item.seriesName}:${item.data || ""}<br/>
                  `

                })
                return html
            }
        },
        // 标题
        legend: {
            textStyle: {
                color: "rgba(105, 255, 249, 1)", //选中时的颜色
                fontSize: 12
            },
            inactiveColor: "rgba(255,255,255,0.3)", //未选中时的颜色
            top: 10,
            selected: obj.legend, //设置默认选中
            data: obj.legend,
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
            left: '6%',
            right: '6%',
            bottom: 30,
            top: '20%',
            containLabel: false
        },
        color: ["#10cfcb", "#ff514c", "#ffd64a", "#30e600", "#004CFF", "#0000ff", "#c2e4ff", "#c80180", "#008fff", "#7469fb", "#8E551A", "#B59835"],
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: obj.x,
            axisLabel: {
                show: true,
                align: 'center',
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.32)', //更改坐标轴文字颜色
                    fontSize: 12 //更改坐标轴文字大小
                }
            },
            axisLine: {
                lineStyle: {
                    //轴线颜色
                    color: 'rgba(255, 255, 255, 0.32)',
                    width: 1, //轴线宽度
                }
            }
        },
        yAxis: {
            type: 'value',
            show: true,
            axisLine: {
                lineStyle: {
                    //轴线颜色
                    color: 'rgba(255, 255, 255, 0.32)',
                    width: 1, //轴线宽度
                }
            },
            splitLine: { //分隔线
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    width: 1
                }
            }
        },
        series: obj.y
    }
}
