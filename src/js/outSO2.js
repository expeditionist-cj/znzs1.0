 //获取对象第一条数据
 let getFirstData = (obj) => {
   for (var key in obj) {
     return obj[key]
   }
 }

 // 处理返回结果，拼凑字段
 export const formatterCurveData = (data, dict) => {
   let xData = [];
   let yDatas = [];
   let firstData = getFirstData(data);
   //循环出x轴的刻度
   for (var time in data) {
     let t = time.split('.')[0]
     let l = t.slice(0, 14);
     let r = t.slice(-3);
     for (var j = 0; j < 60; j++) {
       if (j < 10) {
         xData.push(l + '0' + j + r);
         yDatas.push({
           value: null,
           point: null,
           time: l + '0' + j + r,
           k: null
         })
       } else {
         xData.push(l + j + r);
         yDatas.push({
           value: null,
           point: null,
           time: l + j + r,
           k: null
         })
       }
     }
     break; //只循环一次，凑出当前小时内所有分钟刻度
   }
   let series = [];
   let lineTitle = [];
   // 循环出y轴的值
   for (var k in firstData) {
     for (var m in firstData[k]) {
       dict.forEach(ele => {
         if (ele.param == m && m.indexOf("Limit") < 0) {
           let arr = []
           for (var key in data) {
             arr.push({
               value: data[key][k][m] ? data[key][k][m].mult : "",
               point: data[key][k][m] ? data[key][k][m].val : "",
               time: key.split('.')[0],
               k: m
             })
           }
           //时间排序
           let mid = [];
           let final = [];
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
           let yData = JSON.parse(JSON.stringify(yDatas));
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
             name: k.indexOf('current') > 0 ? ele.sd_name + '(' + ele.dimension + ')' : (ele.param_cn + (ele.dimension ? '(' + ele.dimension + ')' : '')),
             type: 'line',
             smooth: true,
             // symbol: "none",
             connectNulls: true,
             nameCode: m,
             data: yData
           })
           lineTitle.push(k.indexOf('current') > 0 ? ele.sd_name + '(' + ele.dimension + ')' : (ele.param_cn + (ele.dimension ? '(' + ele.dimension + ')' : '')))
         }
       })
     }
   }
   // 标题排序
   let legend = {};
   lineTitle.sort();
   let finalSeries = [];
   lineTitle.forEach(ele => {
     legend[ele] = true
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
         color: "#ffffff",
         fontSize: 12
       },
       formatter(res) {
         var html = "";
         res.forEach((item, idx) => {
           !idx ? html += `${item.data.time}<br/>` : null;
           html += `
                    <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${item.color};"></span>
                    ${item.seriesName}:${item.data.point || ""}${item.unit || ""}<br/>
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
       selected: obj.legend //设置默认选中
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
       show: false,
       axisLine: {
         lineStyle: {
           //轴线颜色
           color: '#ffffff',
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
     series: obj.series
   }
 }
//  转换数据结构
export const getOutSData = (data)=>{
  let list = []
  let ringList = []
  data.forEach(ele => {
    if(ele.upLimit) {
      ringList.push({
        value: ele.val || '',
        cn: ele.cn,
        an: ele.an,
        ds: ele.ds || 0,
        od: ele.od,
        limit: ele.upLimit
      })
    }else{
      list.push({
        val: ele.val || '',
        cn: ele.cn,
        an: ele.an,
        ds: ele.ds || 0,
        od: ele.od
      })
    }
  });
  return {
    list,
    ringList
  }
}
 // 根据字典转换数据结构，获取对应参数的中文名
 export const getCustomData = (param, dict) => {
   delete param.sg;
   delete param.date;
   let arr1 = []
   let arr2 = []
   let arr3 = []
   let list = []
   let ringList = []
   for (let k in param) {
     let data = param[k]
     Object.keys(data).map(key => {
       dict.forEach(ele => {
         if (key == ele.param) {
           if (key.indexOf("Cv") > -1) {
             arr1.push({
               value: data[key].val,
               unit: ele.param_cn + (ele.dimension ? '(' + ele.dimension + ')' : ''),
               ds: data[key].ds,
             })
           } else if (key.indexOf("Limit") > -1) {

             arr2.push({
               value: data[key].val,
               attr: key
             })
           } else {
             arr3.push({
               value: data[key].val,
               unit: ele.param_cn + (ele.dimension ? '(' + ele.dimension + ')' : ''),
               ds: data[key].ds,
               attr: key
             })
           }
         }
       })
     })
     list.push(arr1)
     arr3.forEach(ele => {
       arr2.forEach(item => {
         let mid = item.attr.slice(0, 1).toUpperCase() + item.attr.slice(1, 3)
         if (ele.attr.indexOf(mid) > -1) {
           ringList.push({
             value: ele.value,
             unit: ele.unit,
             ds: ele.ds,
             limit: item.value
           })
         }
       })
     })
   }
   return {
     list,
     ringList
   }
 }

 // 添加websocket推送过来的新数据
 export const addNewSockData = (diagramDataObj, data) => {
   let {
     series,
     legend,
     x
   } = diagramDataObj;
   for (var key in data) {
     for (var m in data[key]) {
       series.forEach(ele => {
         for (var k in data[key][m]) {
           if (ele.nameCode == k) {
             if (new Date(key).getMinutes() == 0 || new Date(key).getTime() > new Date(x[59]).getTime()) {
               // 每个自然小时清空一次,或者推送过来的时间大于当前小时59分
               ele.data.forEach(item => {
                 item.point = null;
                 item.value = null;
                 item.k = null;
               })
             } else {
               ele.data.forEach(item => {
                 if (item.time == key) {
                   item.point = data[key][m][k] ? data[key][m][k].val : ""
                   item.value = data[key][m][k] ? data[key][m][k].mult : ""
                   item.k = k
                 }
               })
             }
           }
         }
       });
     }
     break;
   }
   return {
     series,
     x,
     legend
   }
 }
