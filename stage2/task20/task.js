
var arr = [];
var searchIndex = [];
var text = document.getElementById('text');
var leftIn = document.getElementById('unshift');
var rightIn = document.getElementById('push');
var leftOut = document.getElementById('shift');
var rightOut = document.getElementById('pop');
var search = document.getElementById('search');
var searchBtn = document.getElementById('search-btn');
var list = document.getElementById('list');

String.prototype.trim = String.prototype.trim || function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
};

function getData(ele) {
	return ele.value.trim();
}

function isRight(data) {
	if (!data.length) {
		alert('请输入数据');
		return false;
	} else {
		return true;
	}
}


function render() {
	var str = '';
	arr.forEach(function(item, index) {
		str += '<li>' + item + '</li>';
	});
	list.innerHTML = str;
}

function setIn(type) {
	var data = getData(text);
	if (isRight(data)) {
		data = data.split(/[\s,，、 ]+/g);
		data.forEach(function(item, index) {
			arr[type](item);
		});
		render();
	}
}

function setOut(type) {
	if(arr.length) {
		alert(arr[type]());
		render();
	} else {
		alert('队列为空');
	}
}

leftIn.onclick = function() {
	setIn(this.id);
}

rightIn.onclick = function() {
	setIn(this.id);
}

leftOut.onclick = function() {
	setOut(this.id);
};

rightOut.onclick = function() {
	setOut(this.id);
};

searchBtn.onclick = function() {
	var data = getData(search);
	searchIndex.length = 0;
	if (isRight(data) && arr.length) {

		for (var i = 0; i < list.childNodes.length; i++) {
			list.childNodes[i].removeAttribute('class');
		}

		arr.forEach(function(item, index) {
			if (item.indexOf(data) !== -1) {
				searchIndex.push(index);
			}
		});
	}

	if (searchIndex.length) {
		searchIndex.forEach(function(item) {
			list.childNodes[item].setAttribute('class', 'selected');
		})
	}

}

list.onclick = function(e) {
	e = e || window.event;
	var target = e.target || e.srcElement;
	if (target.nodeName === 'LI') {
		arr.splice(Array.prototype.indexOf.call(list.childNodes, target), 1);
		render();
	}
};

