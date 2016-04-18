var tag = document.getElementById('tag');
var tagList = document.getElementById('tag-list');
var hobby = document.getElementById('hobby');
var btn = document.getElementById('btn');
var hobbyList = document.getElementById('hobby-list');

var tagArr = [];
var hobbyArr = [];

String.prototype.trim = String.prototype.trim || function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
};

function render(node, data) {
	var str = '';
	for (var i = 0; i < data.length; i++) {
		str += '<li>' + data[i] + '</li>';
	}
	node.innerHTML = str;
}

function saveData(data, origin, max) {
	function save(item) {
		if (origin.indexOf(item) === -1) {
			if (origin.length < max) {
				origin.push(item);
			} else {
				origin.shift();
				origin.push(item);
			}
		}
	}

	if (Object.prototype.toString.call(data) === '[object Array]') {
		for (var i = 0; i < data.length; i++) {
			save(data[i]);
		}
	} else {
		save(data);
	}
}

//事件委托
function delegate(parent, childType, event, callback) {
	parent.addEventListener(event, function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement; 
		if (target.nodeName.toLowerCase() === childType.toLowerCase()) {
			callback(target);
		}
	}, false);
}

delegate(tagList, 'li', 'mouseover', function() {
	var target = arguments[0];
	if (target) {
		target.innerHTML = '点击删除' + target.innerHTML;
	}
});

delegate(tagList, 'li', 'mouseout', function() {
	var target = arguments[0];
	if (target) {
		target.innerHTML = target.innerHTML.slice(4);
	}
});

delegate(tagList, 'li', 'click', function() {
	var target = arguments[0];
	if (target) {
		tagArr.splice(Array.prototype.indexOf.call(tagList.childNodes, target), 1);
		render(tagList, tagArr);
	}
});


tag.addEventListener('keyup', function(e) {
	e = e || window.event;
	var key = e.keyCode;
	if (key === 188 || key === 13 || key === 32) {
		var str = tag.value.trim().replace(/[,，]+/g, '');
		if (str) {
			saveData(str, tagArr, 10);
			render(tagList, tagArr);
		}
		tag.value = '';
	}

}, false);

btn.addEventListener('click', function() {
	var arr = hobby.value.trim().split(/[\s,，、 ]+/g).filter(function(item) {
		return item.length > 0;
	});

	if (arr.length) {
		saveData(arr, hobbyArr, 10);
		render(hobbyList, hobbyArr);
		hobby.value = '';
	}


}, false);