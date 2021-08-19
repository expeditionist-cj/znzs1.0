// 正式环境
// export const version = "1.2.3";
// export const versionTime = "20201230001";
// 测试环境
export const version = Glob.version;
export const versionTime = Glob.versionTime;


export const cas = false; // cas 为true 为单点登录版本，cas为false为单机登录版本||||||| .r29731


/*
上线需要改动的文件：
1, version.js 
    version
    versionTime
    
2, global/index.js
    export const socketUrl  
    export const userExcelTemp  
    export const ass_soc_url 
*/




