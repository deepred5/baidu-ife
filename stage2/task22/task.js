function NodeTreeTraverse(root) {
	this.root = root || null;
	this.nodeArr = [];
	this.timer = null;
}

// 还原
NodeTreeTraverse.prototype.clear = function() {
	this.nodeArr.forEach(function(item) {
		item.style.background = '#fff';
	});
	this.nodeArr.length = 0;
	clearInterval(this.timer);
};

// 先序遍历
NodeTreeTraverse.prototype.preOrderTraverse = function(node) {
	if (node !== null) {
		this.nodeArr.push(node);
		this.preOrderTraverse(node.firstElementChild);
		this.preOrderTraverse(node.lastElementChild);
	}
};

// 中序遍历
NodeTreeTraverse.prototype.inOrderTraverse = function(node) {
	if (node !== null) {
		this.inOrderTraverse(node.firstElementChild);
		this.nodeArr.push(node);
		this.inOrderTraverse(node.lastElementChild);
	}
};

// 后序遍历
NodeTreeTraverse.prototype.postOrderTraverse = function(node) {
	if (node !== null) {
		this.postOrderTraverse(node.firstElementChild);
		this.postOrderTraverse(node.lastElementChild);
		this.nodeArr.push(node);
	}
};

// 显示动画效果
NodeTreeTraverse.prototype.show = function() {
	var i = 0;
	var that = this; // setInterval,setTimeout函数中的this默认是window,使用that保存正确this
	this.timer = setInterval(function() {
		that.nodeArr[i].style.background = '#e7292d';
		if (i !== 0) {
			that.nodeArr[i-1].style.background = '#fff';
		}
		i++;
		if (i === that.nodeArr.length) {
			clearInterval(that.timer);
			setTimeout(function() {that.nodeArr[i-1].style.background = '#fff';}, 1000);
		}
	}, 1000);

};

function init() {
	var tree = new NodeTreeTraverse(document.getElementById('tree'));
	var button = document.getElementsByTagName('input');

	button[0].onclick = function() {
		tree.clear();
		tree.preOrderTraverse(tree.root);
		tree.show();
	};

	button[1].onclick = function() {
		tree.clear();
		tree.inOrderTraverse(tree.root);
		tree.show();
	};

	button[2].onclick = function() {
		tree.clear();
		tree.postOrderTraverse(tree.root);
		tree.show();
	};
}

init();

