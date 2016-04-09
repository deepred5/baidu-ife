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
/*var chartData = {
  '2016-01-01': 209,
  '2016-01-02': 266,
  '2016-01-03': 206
  '第1周': 209,
  '第2周': 266,
  '第3周': 206
};
*/
var chartData = {};

// 用于随机产生柱状图的背景颜色
function randomColor() {
  var color = ['e7292d', 'f29445', 'cfb185', '60b251', '8e2b6f', 'fbc500'];

  return '#' + color[Math.floor(Math.random() * color.length)];
}

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 格式化标题
 */
function formatTitle() {
  var city = findCity(pageState.nowSelectCity);
  var type = getType(pageState.nowGraTime);
  var title = '<h3>' + city + type + '空气质量指数' + '</h3>';

  function getType(time) {
    switch(time) {
      case 'day':
        return '每日';
        break;
      case 'week':
        return '每周';
        break;
      case 'month':
        return '每月';
        break;
    }
  }

  return title;
}

/**
 * 渲染图表
 */
function renderChart() {
  var chart = document.getElementById('aqi-chart-wrap');
  chart.className = pageState.nowGraTime;
  chart.innerHTML = '';
  var str = formatTitle();

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
  var city = proArr(aqiSourceData);
  return city[index];
}

/**
 * 得到特定城市的数据
 */
function getCityData(index) {
  return aqiSourceData[findCity(index)];
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
 * 把对象的属性保存在数组中
 */
function proArr(obj) {
  var arr = [];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      arr.push(i);
    }
  }
  return arr;
}

/**
 * 日期粒度为'day'时，设置chartData数据
 */
function updateDataByDay() {
  chartData = {};
  var data = getCityData(pageState.nowSelectCity);
  for (var i in data) {
    if (data.hasOwnProperty(i) && !chartData.hasOwnProperty(i)) {
      chartData[i] = data[i];
    }
  }
  // console.log(data);
  // console.log(chartData);
}

/**
 * 日期粒度为'week'时，设置chartData数据
 */
function updateDataByWeek() {
  chartData = {};
  var week = 1;
  var data = getCityData(pageState.nowSelectCity);
  var timeArr = proArr(data);


  var firstDate = new Date(timeArr[0])
  var lastDate = new Date(timeArr[timeArr.length - 1]);
  var firstDay = firstDate.getDay();
  var lastDay = lastDate.getDay() ? lastDate.getDay() : 7;

  if ((lastDate - firstDate) / 86400000 < 7 && (lastDay - firstDay) <= (7 - firstDay)) {
    //只有一周时，计算一周平均值
    for (var i = 0, num = 0; i < timeArr.length; i++) {
      num += data[timeArr[i]];
    }
    chartData['第' + week++ + '周'] = Math.round(num / timeArr.length);

  } else {
    //超过一周时，计算各周平均值
    var firstWeekDays = getRemainDays(firstDate);
    var lastWeekDays = getPassDays(lastDate);
    
    //计算第一周平均值
    for (var i = 0, num = 0; i < firstWeekDays; i++) {
      num += data[timeArr[i]];
    } 

    chartData['第' + week++ + '周'] = Math.round(num / firstWeekDays);

    //计算其余各周平均值
    for (var i = firstWeekDays, index = 1, num = 0; i < timeArr.length - lastWeekDays; i++) {
      num += data[timeArr[i]];
      if (!(index % 7)) {
        chartData['第' + week++ + '周'] = Math.round(num / 7);
        num = 0;
      }
      index++;
    }
    
    //计算最后一周平均值
    for (var i = timeArr.length - lastWeekDays, num = 0; i < timeArr.length; i++) {
      num += data[timeArr[i]];
    }

    chartData['第' + week++ + '周'] = Math.round(num / lastWeekDays);
  }

  
  
  // console.log(data);
  // console.log(chartData);

}

/**
 * 判断是否为闰年
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 根据月份返回天数
 */
function getMonthDays(month, year) {
  var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
 if (isLeapYear(year) && month === 2) {
  return 29
 } else {
  return monthDays[month];
 }
}

/**
 * 日期粒度为'month'时，设置chartData数据
 */
function updateDataByMonth() {
  chartData = {};
  var data = getCityData(pageState.nowSelectCity);
  var timeArr = proArr(data);
  var num = 0;
  var month = 0;
  var arr;
 

  var firstMonth = new Date(timeArr[0]).getMonth();
  var lastMonth = new Date(timeArr[timeArr.length - 1]).getMonth();
  var month = firstMonth;
  var year = new Date(timeArr[0]).getFullYear();
  var begin = 0;
  var end = getMonthDays(month, year) + begin;
  var lastMonthDate = new Date(timeArr[timeArr.length - 1]).getDate();
  var index = 1;
  
 
  if (firstMonth === lastMonth) {
    //只有一个月
    for (var i = 0; i < timeArr.length; i++) {
      num += data[timeArr[i]];
    }
    chartData['第' + index + '月'] = Math.round(num / timeArr.length);
  } else {
      do {
        arr = timeArr.slice(begin, end);
        year = new Date(arr[0]).getFullYear();
        for (var i = 0, num = 0; i < arr.length; i++) {
          num += data[arr[i]];
        }
        chartData['第' + (index++) + '月'] = 
          Math.round(num / getMonthDays(month, year));
        month++;
        begin = end;
        end = end + getMonthDays(month, year);
      } while (end <= timeArr.length - lastMonthDate);
  
      //最后一个月
      for (var i = timeArr.length - lastMonthDate, num = 0; i < timeArr.length; i++) {
        num += data[timeArr[i]];
      }
      chartData['第' + index + '月'] = Math.round(num / lastMonthDate);
    }
    
  }

/**
 * 更新数据
 */
function updateData() {
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
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
 
  // 确定是否选项发生了变化 
  if (isTimeChange()) {

    // 设置对应数据
    updateData();

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
  var city = document.getElementById('city-select').selectedIndex;
  pageState.nowSelectCity = city;

  updateData();


  // 调用图表渲染函数
  renderChart();
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
  var select = document.getElementById('city-select');
  var str = '';

  for (var i in aqiSourceData) {
    if (aqiSourceData.hasOwnProperty(i)) {
      str += '<option>' + i + '</option>';
    }
  }

  select.innerHTML = str;

  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  select.onchange = citySelectChange;

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  // 初始城市为第一项，日期粒度为天
  pageState.nowSelectCity = 0;
  updateDataByDay();
  renderChart();
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