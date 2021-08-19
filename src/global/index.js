
export const menu = [
  {
      "id":22,
      "pid":null,
      "mname":"后台",
      "component":"layout",
      "path":"/sys",
      "icon":null,
      "bgUrl":null,
      "refCode":null,
      "showOrder":null,
      "children":[
          {
              "id":28,
              "pid":22,
              "mname":"后台管理",
              "component":"developing",
              "path":"/sys/backStage",
              "icon":null,
              "bgUrl":null,
              "refCode":null,
              "showOrder":null,
              "children":[

              ]
          },
          {
              "id":27,
              "pid":22,
              "mname":"参数设置",
              "component":"developing",
              "path":"/sys/parame",
              "icon":null,
              "bgUrl":null,
              "refCode":null,
              "showOrder":null,
              "children":[

              ]
          },
          {
              "id":23,
              "pid":22,
              "mname":"系统设置",
              "component":"sysSetting",
              "path":"/sys/sysSetting",
              "icon":null,
              "bgUrl":null,
              "refCode":null,
              "showOrder":null,
              "children":[
                  {
                      "id":26,
                      "pid":23,
                      "mname":"角色管理",
                      "component":"roleManagement",
                      "path":"/sys/sysSetting/role",
                      "icon":"role",
                      "bgUrl":null,
                      "refCode":null,
                      "showOrder":null,
                      "children":[

                      ]
                  },
                  {
                      "id":25,
                      "pid":23,
                      "mname":"组织机构",
                      "component":"Organization",
                      "path":"/sys/sysSetting/org",
                      "icon":"org",
                      "bgUrl":null,
                      "refCode":null,
                      "showOrder":null,
                      "children":[

                      ]
                  },
                  {
                      "id":24,
                      "pid":23,
                      "mname":"账号管理",
                      "component":"account",
                      "path":"/sys/sysSetting/account",
                      "icon":"account",
                      "bgUrl":null,
                      "refCode":null,
                      "showOrder":null,
                      "children":[

                      ]
                  }
              ]
          }
      ]
  },
  {
      "id":1,
      "pid":null,
      "mname":"首页",
      "component":"layout",
      "path":"/",
      "icon":"1",
      "bgUrl":null,
      "refCode":null,
      "showOrder":1,
      "children":[

      ]
  },
  {
      "id":5,
      "pid":null,
      "mname":"AIjust商城",
      "component":"layout",
      "path":"/shop",
      "icon":"5",
      "bgUrl":null,
      "refCode":null,
      "showOrder":1,
      "children":[

      ]
  },
  {
      "id":4,
      "pid":null,
      "mname":"运行工具",
      "component":"layout",
      "path":"/tool",
      "icon":"4",
      "bgUrl":null,
      "refCode":null,
      "showOrder":1,
      "children":[
          {
              "id":16,
              "pid":4,
              "mname":"实用小工具",
              "component":"developing",
              "path":"/tool/tool",
              "icon":"6",
              "bgUrl":null,
              "refCode":null,
              "showOrder":0,
              "children":[

              ]
          },
          {
              "id":14,
              "pid":4,
              "mname":"小指标综合分析",
              "component":"developing",
              "path":"/tool/com",
              "icon":"4",
              "bgUrl":null,
              "refCode":null,
              "showOrder":0,
              "children":[

              ]
          },
          {
              "id":13,
              "pid":4,
              "mname":"项目系统图",
              "component":"developing",
              "path":"/tool/sys",
              "icon":"3",
              "bgUrl":null,
              "refCode":null,
              "showOrder":0,
              "children":[

              ]
          },
          {
              "id":11,
              "pid":4,
              "mname":"项目运行分析",
              "component":"developing",
              "path":"/tool/ays",
              "icon":"1",
              "bgUrl":null,
              "refCode":null,
              "showOrder":0,
              "children":[

              ]
          },
          {
              "id":15,
              "pid":4,
              "mname":"石灰石耗用量计算",
              "component":"developing",
              "path":"/tool/math",
              "icon":"5",
              "bgUrl":null,
              "refCode":null,
              "showOrder":1,
              "children":[

              ]
          },
          {
              "id":12,
              "pid":4,
              "mname":"项目运行规程",
              "component":"developing",
              "path":"/tool/pro",
              "icon":"2",
              "bgUrl":null,
              "refCode":null,
              "showOrder":1,
              "children":[

              ]
          }
      ]
  },
  {
      "id":3,
      "pid":null,
      "mname":"知识社区",
      "component":"layout",
      "path":"/knowledge",
      "icon":"3",
      "bgUrl":null,
      "refCode":null,
      "showOrder":1,
      "children":[
          {
              "id":10,
              "pid":3,
              "mname":"案例分享",
              "component":"developing",
              "path":"/knowledge/case",
              "icon":"5",
              "bgUrl":null,
              "refCode":null,
              "showOrder":0,
              "children":[

              ]
          },
          {
              "id":9,
              "pid":3,
              "mname":"专题贴吧",
              "component":"developing",
              "path":"/knowledge/postIt",
              "icon":"4",
              "bgUrl":null,
              "refCode":null,
              "showOrder":0,
              "children":[

              ]
          },
          {
              "id":8,
              "pid":3,
              "mname":"智能问答系统",
              "component":"developing",
              "path":"/knowledge/ask",
              "icon":"3",
              "bgUrl":null,
              "refCode":null,
              "showOrder":0,
              "children":[

              ]
          },
          {
              "id":7,
              "pid":3,
              "mname":"考试系统",
              "component":"developing",
              "path":"/knowledge/exam",
              "icon":"2",
              "bgUrl":null,
              "refCode":null,
              "showOrder":0,
              "children":[

              ]
          },
          {
              "id":6,
              "pid":3,
              "mname":"基础理论",
              "component":"developing",
              "path":"/knowledge/basic",
              "icon":"1",
              "bgUrl":null,
              "refCode":null,
              "showOrder":1,
              "children":[

              ]
          }
      ]
  },
  {
      "id":2,
      "pid":null,
      "mname":"智能模型",
      "component":"layout",
      "path":"/model",
      "icon":"2",
      "bgUrl":null,
      "refCode":null,
      "showOrder":1,
      "children":[
          {
              "id":17,
              "pid":2,
              "mname":"智能分析",
              "component":"intelligentModel",
              "path":"/model/ays",
              "icon":null,
              "bgUrl":null,
              "refCode":null,
              "showOrder":1,
              "children":[
                  {
                      "id":21,
                      "pid":17,
                      "mname":"浆液循环泵电耗分析",
                      "component":"PowerConsum",
                      "path":"/model/ays/power",
                      "icon":"power",
                      "bgUrl":"gj.png",
                      "refCode":"power-csp",
                      "showOrder":1,
                      "children":[

                      ]
                  },
                  {
                      "id":29,
                      "pid":17,
                      "mname":"烟气流量智能分析",
                      "component":"GasFlow",
                      "path":"/model/ays/dust",
                      "icon":"dust_ll",
                      "bgUrl":"dust.png",
                      "refCode":"gas-csp",
                      "showOrder":1,
                      "children":[

                      ]
                  },
              ]
          },
          {
              "id":18,
              "pid":2,
              "mname":"智能优化",
              "component":"intelligentModel",
              "path":"/model/pre",
              "icon":null,
              "bgUrl":null,
              "refCode":null,
              "showOrder":2,
              "children":[
                  {
                      "id":20,
                      "pid":18,
                      "mname":"供浆循环智能优化",
                      "component":"PulpSupply",
                      "path":"/model/pot/slu",
                      "icon":"gj",
                      "bgUrl":"gj.png",
                      "refCode":"slurry-pump",
                      "showOrder":1,
                      "children":[

                      ]
                  }
              ]
          },
          {
              "id":19,
              "pid":2,
              "mname":"智能预测",
              "component":"intelligentModel",
              "path":"/model/pot",
              "icon":null,
              "bgUrl":null,
              "refCode":null,
              "showOrder":3,
              "children":[

              ]
          }
      ]
  }
]
// export const socketUrl = "ws://192.168.59.8:6005";
// export const socketUrl = "ws://183.64.62.154:10025";
// export const socketUrl = "ws://183.64.62.154:16005";
// export const socketUrl = "ws://192.168.10.88:6005";
// export const socketUrl = "ws://192.168.4.19:6005";
// export const socketUrl = "ws://192.168.4.8:6005";
// export const socketUrl = "ws://172.16.3.248:6005";
export const socketUrl = Glob.socketUrl;

// 模板下载url
// export const userExcelTemp = 'http://192.168.59.8:8050/images'; 
// export const userExcelTemp = 'http://183.64.62.154:10023/images'; 
// export const userExcelTemp = 'http://183.64.62.154:16005/images'; 
// export const userExcelTemp = 'http://192.168.10.88:8050/images'; 
// export const userExcelTemp = 'http://192.168.4.19:8050/images'; 
// export const userExcelTemp = 'http://192.168.4.8:8050/images'; 
export const userExcelTemp = Glob.userExcelTemp; 

// 联想吸收循环优化的socketUrl
// export const ass_soc_url = "ws://192.168.4.8:6002";
// export const ass_soc_url = "ws://192.168.59.8:6002";
// export const ass_soc_url = "ws://183.64.62.154:6002";
// export const ass_soc_url = "ws://192.168.10.88:6002";
// export const ass_soc_url = "ws://192.168.4.19:6002";
export const ass_soc_url = Glob.ass_soc_url;