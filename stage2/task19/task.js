var dataArr = [];
var stateArr = [];
var compare = [];
var list = document.getElementById('list');
var bubble = document.getElementById('bubble-sort');
var random = document.getElementById('random');
var text = document.getElementById('text');
var leftIn = document.getElementById('unshift');
var rightIn = document.getElementById('push');
var leftOut = document.getElementById('shift');
var rightOut = document.getElementById('pop');
var h3 = document.getElementsByTagName('h3')[0];
var timer = null;

String.prototype.trim = String.prototype.trim || function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
};

function isRight(num) {
	if (!num.length) {
		alert('请输入数据');
		return false;
	} else if (!(/^\d+$/.test(num))) {
		alert('请输入数字');
		return false
	} else if (parseInt(num) < 10 || parseInt(num) > 100) {
		alert('请输入10~100以内的数字');
		return false;
	} else {
		return true;
	}
}

function getNum() {
	return text.value.trim();
}

function render(arr) {
	var str = '';
	for (var i = 0; i < arr.length; i++) {
		str += '<li style="height: ' + arr[i] * 3 + 'px"' + 'title=" ' + arr[i] + '"></li>';
	}
	list.innerHTML = str;
}


function bubbleSort(arr) {
	var flag = true;

	for (var i = 0; i < arr.length && flag; i++) {
		flag = false;

		for (var j = 0; j < arr.length - i - 1; j++) {
			if (arr[j] > arr[j+1]) {
				var temp = arr[j];
				arr[j] = arr[j+1];
				arr[j+1] = temp;
				flag = true;
			}
			stateArr.push(arr.slice()); // 通过slice复制表示当前状态的数组

			// 通过闭包存入要比较的两个位置
			(function(index) {
				compare.push([j, j+1]);
			} (j))
		}
	}
}

function showCompare(arr) {
	
	var item = list.getElementsByTagName('li');
	item[arr[0]].setAttribute('class', 'compare');
	item[arr[1]].setAttribute('class', 'compare');
}

function animate() {
	if (stateArr.length) {
		showCompare(compare.shift());
		setTimeout(function() {render(stateArr.shift());}, 500);
		// render(stateArr.shift());
	} else {
		clearInterval(timer);
		h3.innerHTML = '冒泡排序完成';
	}
}

function setIn(type) {
	if (dataArr.length >= 60) {
		alert('队列元素个数不能超过60');
	} else {
		var num = getNum();
		if (isRight(num)) {
			dataArr[type](parseInt(num));
			render(dataArr);
		}
	}
}

function setOut(type) {
	if(dataArr.length) {
		alert(dataArr[type]());
		render(dataArr);
	} else {
		alert('队列为空');
	}
}

function clearInfo() {
	if(h3.hasChildNodes()) {
		h3.innerHTML = '';
	}
}

leftIn.onclick = function() {
	clearInfo();
	setIn(this.id);
};

rightIn.onclick = function() {
	clearInfo();
	setIn(this.id);
};

leftOut.onclick = function() {
	clearInfo();
	setOut(this.id);
};

rightOut.onclick = function() {
	clearInfo();
	setOut(this.id);
};

bubble.onclick = function() {
	if (dataArr.length) {
		clearInfo();
		clearInterval(timer);
		bubbleSort(dataArr);
		timer = setInterval(animate, 1000);
	} else {
		alert('队列为空');
	}
};

random.onclick = function() {
	clearInfo();
	dataArr = [];

	for (var i = 0; i < 10; i++) {
		dataArr.push(Math.floor(Math.random() * 91 + 10));
	}

	render(dataArr);
};

list.onclick = function(e) {
	clearInfo();
	e = e || window.event;
	var target = e.target || e.srcElement;
	if (target.nodeName === 'LI') {
		dataArr.splice(Array.prototype.indexOf.call(list.childNodes, target), 1);
		render(dataArr);
	}
};
