(function() {
	var li = document.getElementById('header').getElementsByTagName('li');
	var line = document.getElementById('underline');


	for (var i = 0; i < li.length; i++) {
		li[i].onmouseover = function() {
			line.style.left = this.offsetLeft + 'px';
			line.style.width = this.offsetWidth + 'px';
		}
		li[i].onmouseout = function() {
			line.style.left = li[0].offsetLeft +'px';
			line.style.width = li[0].offsetWidth + 'px';
		}
	}

})()