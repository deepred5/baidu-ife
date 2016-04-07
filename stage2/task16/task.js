window.onload = function() {
	/**
	 * aqiData，存储用户输入的空气指数数据
	 * 示例格式：
	 * aqiData = {
	 *    "北京": 90,
	 *    "上海": 40
	 * };
	 */
	var aqiData = {};

	/**
	 * 从用户输入中获取数据，向aqiData中增加一条数据
	 * 然后渲染aqi-list列表，增加新增的数据
	 */
	function addAqiData() {

		// 增加String原型的trim()方法
		String.prototype.trim = String.prototype.trim || function() {
			return this.replace(/(^\s*)|(\s*$)/g, '');
		};
		
		var city = document.getElementById('aqi-city-input').value.trim();
		var quality = document.getElementById('aqi-value-input').value.trim();
		var reg1 = /^[\u4e00-\u9fa5a-zA-Z]+$/; // 匹配中英文字符
		var reg2 = /^[0-9]+$/; // 匹配整数

		if (!reg1.test(city)) {
			alert('城市名必须为中英文字符');
		} else if (!reg2.test(quality)) {
			alert('空气质量指数必须为整数');
		} else {
			aqiData[city] = Number(quality);
			document.getElementById('aqi-city-input').value = '';
			document.getElementById('aqi-value-input').value = '';
		}
	}

	/**
	 * 渲染aqi-table表格
	 */
	function renderAqiList() {
		var aqiTable = document.getElementById('aqi-table');

		// 判断data对象是否没有任何属性
		function isEmpty(data) {
			var empty = true;
			for (var i in data) {
				if (data.hasOwnProperty(i)) {
					empty = false;
					break;
				}
			}
			return empty;
		}

		if (!isEmpty(aqiData)) {
			var str = '<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
			for (var i in aqiData) {
				if (aqiData.hasOwnProperty(i)) {
					str += '<tr><td>' + i + '</td><td>' + aqiData[i] + 
							'</td><td><button>删除</button></td></tr>';
				}
			}
			aqiTable.innerHTML = str;
		} else {
			aqiTable.innerHTML = '';
		}

	}

	/**
	 * 点击add-btn时的处理逻辑
	 * 获取用户输入，更新数据，并进行页面呈现的更新
	 */
	function addBtnHandle() {
	  addAqiData();
	  renderAqiList();
	}

	/**
	 * 点击各个删除按钮的时候的处理逻辑
	 * 获取哪个城市数据被删，删除数据，更新表格显示
	 */
	function delBtnHandle(e) {
	  //do sth.
	  var e = e || window.event;
	  var target = e.target || e.srcElement;
	  if (target && target.nodeName.toUpperCase() === 'BUTTON') { // 判断冒泡的元素是否为button
	  	var city = target.parentNode.parentNode.getElementsByTagName('td')[0].innerHTML;
	  	delete aqiData[city];
	  	renderAqiList();
	  }
	 
	}

	function init() {

	  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
	  
	  var addBtn = document.getElementById('add-btn');
	  addBtn.onclick = addBtnHandle;

	  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
	  
	  var aqiTable = document.getElementById('aqi-table');

	  aqiTable.onclick = function(e) {
	  	delBtnHandle(e)
	  };

	}

	init();
}