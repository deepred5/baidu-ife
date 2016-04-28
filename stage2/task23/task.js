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

var button = document.getElementsByTagName('input');
var tree = new Tree(document.getElementById('tree'));
var timer = null;
var lock = false;

function check() {
	var search = button[2].value.trim();
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
		if (check()) {
			tree.traverseBF();
			tree.show(button[2].value.trim());
		}
	}
}

button[4].onclick = function() {
	if (!isLock()) {
		if (check()) {
			tree.traverseDF();
			tree.show(button[2].value.trim());
		}
	}
}