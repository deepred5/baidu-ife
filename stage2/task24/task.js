function Tree(root) {
	this.root = root || null;
	this.nodeArr = [];
}

// 深度优先遍历
Tree.prototype.traverseDF = function(callback) {
	this.clear();
	var self = this; // 立即执行函数里的this默认指向window，使用self保存正确this

	(function recurse(currentNode) {
		self.nodeArr.push(currentNode);
		for (var i = 0; i < currentNode.children.length; i++) {
			recurse(currentNode.children[i]);
		}
		callback ? callback(currentNode) : null;
	})(this.root);
};

// 广度优先遍历
Tree.prototype.traverseBF = function(callback) {
	this.clear();
	var queue = [];
	queue.push(this.root);
	var currentNode = queue.shift();
	this.nodeArr.push(currentNode);

	while(currentNode) {
		for (var i = 0; i < currentNode.children.length; i++) {
			queue.push(currentNode.children[i]);
		}
		callback ? callback(currentNode) : null;
		currentNode = queue.shift();
		currentNode ? this.nodeArr.push(currentNode) : null;
	}
};

// 动画效果,搜索效果
Tree.prototype.show = function(search) {
	lock = true;
	var i = 0;
	var find = false;
	var self = this; // setInterval,setTimeout函数中的this默认是window,使用self保存正确this
	timer = setInterval(function() {
		self.nodeArr[i].style.background = '#e7292d';
		if (search && self.nodeArr[i].firstChild.nodeValue.trim() === search) {
			self.nodeArr[i].style.background = '#f29445';
			find = true;
		}
		if (i !== 0) {
			if (!search || self.nodeArr[i-1].firstChild.nodeValue.trim() !== search) {
				self.nodeArr[i-1].style.background = '#fff';
			}
		}
		i++;
		if (i === self.nodeArr.length) {
			clearInterval(timer);
			setTimeout(function() {
				self.nodeArr[i-1].style.background = '#fff';
				if (search && !find) {
				alert('没有找到' + search);
				}
			}, 500);
			lock = false;
		}
	}, 500);

};

// 还原
Tree.prototype.clear = function() {
	this.nodeArr.forEach(function(item) {
		item.style.background = '#fff';
	});
	this.nodeArr.length = 0;
};

function getElementsByClassName(className, parent) {
	parent = parent || document;
	if (parent.getElementsByClassName) {
		return parent.getElementsByClassName(className);
	} else {
		var nodes = parent.getElementsByTagName('*');
		var arr = [];
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].className.indexOf(className) !== -1) {
				arr.push(nodes[i]);
			}
		}
		return arr;
	}
}

// 删除节点
function deleteNode() {
	var nodes = getElementsByClassName('selected');

	// nodes会动态改变，所以用len保存最初的长度
	for (var i = 0, len = nodes.length; i < len; i++) {
		nodes[0].parentNode.removeChild(nodes[0]);
	}
}

// 增加节点
function addNode(text) {
	var nodes = getElementsByClassName('selected');
	for (var i = 0; i < nodes.length; i++) {
		var div = document.createElement('div');
		div.innerHTML = text;
		nodes[i].appendChild(div);
	}
}


var button = document.getElementsByTagName('input');
var treeContent = document.getElementById('tree');
var tree = new Tree(treeContent);
var timer = null;
var lock = false;

function check(node) {
	var search = getText(node);
	if (search === '') {
		alert('请输入数据');
		return false;
	}
	return true;
}

function isLock() {
	if (lock) {
		alert('正在遍历中！');
	}
	return lock;
}

function getText(node) {
	return node.value.trim();
}

// 事件代理, 点击显示选中
treeContent.onclick = function(e) {
	e = e || window.event;
	var target = e.target || e.srcElement;

	if (target.nodeName.toLowerCase() === 'div') {
		if (target.className === 'selected') {
			target.className = '';
		} else {
			target.className = 'selected';
		}
	}
};

button[0].onclick = function() {
	if (!isLock()) {
		tree.traverseBF();
		tree.show();
	}
};

button[1].onclick = function() {
	if (!isLock()) {
		tree.traverseDF();
		tree.show();
	}
};

button[3].onclick = function() {
	if (!isLock()) {
		if (check(button[2])) {
			tree.traverseBF();
			tree.show(getText(button[2]));
		}
	}
}

button[4].onclick = function() {
	if (!isLock()) {
		if (check(button[2])) {
			tree.traverseDF();
			tree.show(getText(button[2]));
		}
	}
}

button[6].onclick = function() {
	addNode(getText(button[5]));
};

button[7].onclick = function() {
	deleteNode();
}