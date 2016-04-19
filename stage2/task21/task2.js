//事件绑定
function addEvent(element, type, handler) {
	if (element.addEventListener) {
		element.addEventListener(type, handler, false);
	} else if (element.attachEvent) {
		element.attachEvent('on' + type, handler);
	} else {
		element['on' + type] = handler;
	}
}

//事件委托
function delegate(parent, childType, event, callback) {
	addEvent(parent, event, function(e) {
		e = e || window.event;
		var target = e.target || e.srcElement; 
		if (target.nodeName.toLowerCase() === childType.toLowerCase()) {
			callback(target);
		}
	});
}

//Queue类
function Queue(container) {
	this.items = [];
	this.rightPush = function(element) {
		this.items.push(element);
		this.render();
	}
	this.leftShift = function() {
		this.items.shift();
		this.render();
	}
	this.render = function() {
		var str = '';
		for (var i = 0; i < this.items.length; i++) {
			str += '<li>' + this.items[i] + '</li>';
		}
		container.innerHTML = str;
	}
	this.indexOf = function(element) {
		return this.items.indexOf(element);
	}
	this.delete = function(index) {
		this.items.splice(index, 1);
		this.render();
	}
}

function init() {
	var tag = document.getElementById('tag');
	var tagList = document.getElementById('tag-list');
	var hobby = document.getElementById('hobby');
	var btn = document.getElementById('btn');
	var hobbyList = document.getElementById('hobby-list');

	var tagQue = new Queue(tagList);
	var hobbyQue = new Queue(hobbyList);

	addEvent(tag, 'keyup', function(e) {
		e = e || window.event;
		var key = e.keyCode;
		if (key === 188 || key === 13 || key === 32) {
			var str = tag.value.trim().replace(/[,，]+/g, '');
			if (str && tagQue.indexOf(str) === -1) {
				tagQue.rightPush(str);
			}
			if (tagQue.items.length > 10) {
				tagQue.leftShift();
			}
			tag.value = '';
		}
	});

	addEvent(btn, 'click', function() {
		var arr = hobby.value.trim().split(/[\s,，、 ]+/g).filter(function(item) {
			return item.length > 0;
		});

		if (arr.length) {
			for (var i = 0; i < arr.length; i++) {
				if (hobbyQue.indexOf(arr[i]) === -1) {
					hobbyQue.rightPush(arr[i]);
					if (hobbyQue.items.length > 10) {
						hobbyQue.leftShift();
					}
				}
			}
		}
		hobby.value = '';
	});

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
			tagQue.delete(Array.prototype.indexOf.call(tagList.childNodes, target));
		}
	});

}

init();



