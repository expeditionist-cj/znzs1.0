
// 比较当前id的父级id，拿到父级的name
export let compare = (obj, current) => {
    let result = '';
    function f(obj, current) {
        if (obj.deptId == current) {
            result = obj.name;
            return result
        } else if (obj.children.length > 0) {
            for (var key in obj.children) {
                f(obj.children[key], current)
            }
        }
        return result
    }
    let res = f(obj, current)
    return res;
} 