```javascript

let filters = {
  formatMoney: function (val, num, unit) {
    num = num || 2
    unit = unit || '$'
    if (typeof val === 'number') {
      return unit + val.toFixed(num)
    }
  },
	//状态数字换文字
	// 预约状态 1:待处理 2：已鉴别 3：已取消 4:已过期
	statusFormat: function (val) {
		if(val == 1){
			return '待处理';
		}else if(val == 2){
			return '已处理';
		}else if(val == 3){
			return '已取消';
		}else if(val == 4){
			return '已过期';
		}else{
			return ''
		}
	}
}
export default {
  install: function (Vue) {
    for (var key in filters) {
      Vue.filter(key, filters[key])
    }
  }
}

```