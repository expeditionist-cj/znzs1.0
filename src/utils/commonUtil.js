import request from '@/utils/request';
// 获取url ？后面的字符
export const getQueryString = (name) => {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 导出
export const excel = (url, query) => {
        return request({
            url,
            method: 'get',
            params: query,
            responseType: 'arraybuffer'
        })
    }
    // 将对象序列化
export const serraliz_obj = (obj) => {
    let str = "";
    _.forOwn(obj, (value, key) => {
        str += key + "=" + value + "&";
    });
    str.substr(0, str.length - 1);
    return str
}

// 下载excel模板
export const downLoadCustomExcel = (worksheet, tableStr) => {
    var uri = "data:application/vnd.ms-excel;base64,";
    // 真正要导出（下载）的HTML模板
    var exportTemplate = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"
                xmlns="http://www.w3.org/TR/REC-html40">
                <head><meta charset='UTF-8'><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
                    <x:Name>${worksheet}</x:Name>
                        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
                    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
                </head>
                <body>
                    ${tableStr}
                </body>
                </html>`;
    //下载模板
    var a = document.createElement("a");
    a.download = worksheet + ".xls";
    a.href = uri + window.btoa(unescape(encodeURIComponent(exportTemplate)));
    a.click();
}