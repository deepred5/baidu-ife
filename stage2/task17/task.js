/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {
  // '2016-01-01': 209,
  // '2016-01-02': 266,
  // '2016-01-03': 206
  // '第1周': 209,
  // '第2周': 266,
  // '第3周': 206
};

// 用于随机产生柱状图的背景颜色
function randomColor() {
  var color = ['e7292d', 'f29445', 'cfb185', '60b251', '8e2b6f', 'fbc500'];

  return '#' + color[Math.floor(Math.random() * color.length)];
}

// 记录当前页面的表单选项
var pageState = {
  // nowSelectCity: -1,
  nowSelectCity: 1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  var chart = document.getElementById('aqi-chart-wrap');
  chart.className = pageState.nowGraTime;
  chart.innerHTML = '';
  var str = '';

  for (var i in chartData) {
    if (chartData.hasOwnProperty(i)) {
      str += '<div style="height: ' + chartData[i] + 'px; background: ' + randomColor() + ';"' 
              + 'title="date: ' + i + ' \nnum: ' + chartData[i] + '\ncity: ' + 
              findCity(pageState.nowSelectCity) + '"></div>';
    }
  }

  chart.innerHTML = str;
}

/**
 * 判断日期粒度是否发生改变
 */
function isTimeChange() {
    var time = document.getElementsByName('gra-time');
    var timeChanged = false;

    for (var i = 0; i< time.length; i++) {
      if (time[i].checked && time[i].value !== pageState.nowGraTime) {
        timeChanged = true;
        pageState.nowGraTime = time[i].value;
        break;
      }
    }
    
    return timeChanged;
  }

/**
 * 查找城市名
 */
function findCity(index) {
  var city = [];
  for (var i in aqiSourceData) {
    if (aqiSourceData.hasOwnProperty(i)) {
      city.push(i);
    }
  }
  return city[index];
}



/**
 * 根据当天判断这周还剩几天
 */
function getRemainDays(today) {
  return today.getDay() ? 8 - today.getDay() : 1;
}

/**
 * 根据当天判断这周已经过了几天
 */
function getPassDays(today) {
  return today.getDay() ? today.getDay() : 7;
}


/**
 * 日期粒度为'day'时，设置chartData数据
 */
function updateDataByDay() {
  chartData = {};
  var data = aqiSourceData[findCity(pageState.nowSelectCity)];
  for (var i in data) {
    if (data.hasOwnProperty(i) && !chartData.hasOwnProperty(i)) {
      chartData[i] = data[i];
    }
  }
  console.log(data);
  console.log(chartData);
}

/**
 * 日期粒度为'week'时，设置chartData数据
 */
function updateDataByWeek() {
  chartData = {};
  var timeArr = [];
  var week = 1;
  var data = aqiSourceData[findCity(pageState.nowSelectCity)];

  for (var i in data) {
    if (data.hasOwnProperty(i)) {
      timeArr.push(i);
    }
  }

  var firstWeekDays = getRemainDays(new Date(timeArr[0]));
  var lastWeekDays = getPassDays(new Date(timeArr[timeArr.length - 1]));
  
  for (var i = 0, num = 0; i < firstWeekDays; i++) {
    num += data[timeArr[i]];
  } 

  chartData['第' + week++ + '周'] = Math.round(num / firstWeekDays);

  for (var i = firstWeekDays, index = 1, num = 0; i < timeArr.length - lastWeekDays; i++) {
    num += data[timeArr[i]];
    if (!(index % 7)) {
      chartData['第' + week++ + '周'] = Math.round(num / 7);
      num = 0;
    }
    index++;
  }
  
  for (var i = timeArr.length - lastWeekDays, num = 0; i < timeArr.length; i++) {
    num += data[timeArr[i]];
  }

  chartData['第' + week++ + '周'] = Math.round(num / lastWeekDays);
  console.log(data);
  console.log(chartData);

}

/**
 * 日期粒度为'month'时，设置chartData数据
 */
function updateDataByMonth() {
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
 
  // 确定是否选项发生了变化 
  if (isTimeChange()) {

    // 设置对应数据
    switch (pageState.nowGraTime) {
      case 'day':
        updateDataByDay();
        break;
      case 'week':
        updateDataByWeek();
        break;
      case 'month':
        updateDataByMonth();
        break;
    }

    // 调用图表渲染函数
    renderChart();
  }


  
  
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 

  // 设置对应数据

  // 调用图表渲染函数
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radio = document.getElementsByName('gra-time');
  for (var i = 0; i < radio.length; i++) {
    radio[i].onclick = graTimeChange;
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项

  // 给select设置事件，当选项发生变化时调用函数citySelectChange

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();
// renderChart();