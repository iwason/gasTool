function collectInformation() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Overview');
  var Holidays = getHolidays(ss);
  var ns = setLayout(ss.insertSheet());

  //日付,時刻枠,レッスン数のmap
  var lessonDataMap = mergeMap(createDataMap(sheet),Holidays);

  //授業の対象
  var timeList = ["8:00","8:30","9:00","9:30",
    "10:00","10:30","11:00","11:30","12:00","12:30",
    "13:00","13:30","14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30"];

  var color;
  //前回< 祝日 <今回　
  //行開始位置
  var i = 2;
  for (var lessonDate in lessonDataMap) {
    //   Logger.log(lessonDate);
    ns.getRange(i,1).setValue(lessonDate);
    ns.getRange(i,2).setValue(dayOfWeek(new Date(lessonDate)));

    //該当の日付のリスト
    //dataList[lessonDate];
    for (var j=0,k=3;j<timeList.length;j++,k++){
      if(lessonDataMap[lessonDate] == "Holiday"){
        ns.getRange(i,3).setValue(lessonDate + "はPHの祝日のためレッスンはできません。");
        ns.getRange(i,3,1,timeList.length).merge();
      }
      lessonCount = lessonDataMap[lessonDate][timeList[j]] ? lessonDataMap[lessonDate][timeList[j]]:0;

      //Logger.log(lessonDate + " " + timeList[j] + "のレッスン数：" + lessonCount + "<br>");

      ns.getRange(i,k).setValue(lessonCount);
      /*
      switch(criteria){
        case Trial:
          color = "";
          break;
        case LineTest:
          color = "";
          break;
        case Regular:
          color = "";
          break;
        case Trial && LineTest:
          break;

      }
      ns.getRange(i,k).setBackground();
      */

    }

    i++;
  }

}

/**
 * 最後の有効な時刻データを取得
 * @param singleColumnRange
 * @returns {*}
 */
function getLastRow(singleColumnRange){
  var seek = function(dataSet){
    var lastDataIndex = 0;
    for(var i=0; i < dataSet.length;i++){
      if(isTimeString(dataSet[i][0])){
        lastDataIndex = i;
      }
    }
    return lastDataIndex;

  };
  return seek(singleColumnRange)+1;

}

/**
 * 全体のシートからデータを収集し、
 * 加工しやすいようにmapにとして生成する
 * @param sheet
 */
function createDataMap(sheet){
  //入力されているデータサイズ　(B列に入力されている)
  var data = sheet.getRange('B:H').getValues();
  var lastRow = getLastRow(sheet.getRange('H:H').getValues());
  var lessonDate = "";
  var lessonTime;
  var lessonDataMap = {};
  //入力データの加工
  for (var i = getStartIndex(data); i < lastRow; i++) {
    if (!isTimeString(data[i][6])) {
      continue;
    }
    //日付がある場合は結合列とみなし、同じ日程に投入する
    if (isDate(data[i][0])){
      lessonDate = Utilities.formatDate(data[i][0], 'Asia/Tokyo', 'yyyy/M/d');
      if (lessonDataMap[lessonDate] == undefined){
        lessonDataMap[lessonDate] = {};
      }
    }
    //レッスン対象枠を取得
    lessonTime = convertTimeRangeToSlotList(data[i][6]);

    for (var j = 0; j < lessonTime.length; j++){
      if(lessonDataMap[lessonDate][lessonTime[j]] == undefined){
        lessonDataMap[lessonDate][lessonTime[j]] = 0;
      }
      //必要な人数を取得
      lessonDataMap[lessonDate][lessonTime[j]] += data[i][4];
    }

    //該当のデータを新シートに反映
  }
  return lessonDataMap;

}

function mergeMap(lessonDataMap,Holidays){
  var map = {};
  for(var key in lessonDataMap){
    map[key] = lessonDataMap[key];
  }
  
  for(key in Holidays){
    map[Holidays[key]] = "Holiday";
  }
  
  return map;
}

function objectSort(object) {
  //戻り値用新オブジェクト生成
  var sorted = {};
  //キーだけ格納し，ソートするための配列生成
  var array = [];
  //for in文を使用してオブジェクトのキーだけ配列に格納
  for (key in object) {
    //指定された名前のプロパティがオブジェクトにあるかどうかチェック
    if (object.hasOwnProperty(key)) {
      //if条件がtrueならば，配列の最後にキーを追加する
      array.push(key);
    }
  }
  //配列のソート
  array.sort();
  //配列の逆ソート
  //array.reverse();
  //キーが入った配列の長さ分だけfor文を実行
  for (var i = 0; i < array.length; i++) {
    /*戻り値用のオブジェクトに
     新オブジェクト[配列内のキー] ＝ 引数のオブジェクト[配列内のキー]を入れる．
     配列はソート済みなので，ソートされたオブジェクトが出来上がる*/
    sorted[array[i]] = object[array[i]];
  }
  //戻り値にソート済みのオブジェクトを指定
  return sorted;
}

/**
 * 祝日を取得
 * @param ss
 * @returns {Array}
 */
function getHolidays(ss){
  var tmp = ss.getSheetByName('PH Holidays').getRange('A:A').getValues();
  tmp.shift();
  var Holidays = [];
  tmp.forEach(function(value) {
    if(value[0].length != 0){
      Holidays.push(Utilities.formatDate(value[0], 'Asia/Tokyo', 'yyyy/M/d'));
    }
  });
  return Holidays;
}

/**
 * データ・セットの開始位置を取得
 * @param dataSet
 * @returns {number}
 */
function getStartIndex(dataSet){
  var now = new Date().getTime();
  for (var i = 0; i < dataSet.length; i++) {
    //日付以外,過去の予定はスルーする
    if (!isTimeString(dataSet[i][6])|| (isDate(dataSet[i][0]) && dataSet[i][0].getTime() < now)) {
      continue;
    }
    //過去データを除外
    if(isDate(dataSet[i][0]) && dataSet[i][0].getTime() >= now ){
      return i;
    }
  }
}

/**
 *  calendarを作る
 */
function setLayout(ss) {
  var size = 40;
  var hour = 8;
  ss.insertColumns(2, 10);
  ss.setColumnWidth(2, size);

  for (var i = 3; i <= 28; i++, hour += i % 2) {
    ss.setColumnWidth(i, size);
    ss.getRange(1, i).setValue(hour + ":" + ((i % 2 == 1) ? "00" : "30"));
  }
  return ss;
}

function dayOfWeek(date) {
  var d = ['日', '月', '火', '水', '木', '金', '土'];
  return d[date.getDay()];
}

function isDate(date) {
  return is('Date', date);
}

//型チェック
function is(type, obj) {
  var clas = Object.prototype.toString.call(obj).slice(8, -1);
  return obj !== undefined && obj !== null && clas === type;
}

/*
 * H:i-H:iの形式で時間を入力していれば、時刻とみなす
 * 時刻選択の自由度によっては正規表現を変える
 */
function isTimeString(s) {
  return s.length != 0
    && s.match(/^([1-9]|1[0-9]):(0[0-9]|[1-5][0-9])-([1-9]|1[0-9]):(0[0-9]|[1-5][0-9])$/);

}

/**
 * H:iの時刻形式を、30分刻みの文字列に変換する
 * ex 10:15 -> 10:00
 *     10:55 -> 10:30
 */
function convertTimeStringToSlotString(s) {
  var time = s.split(":");
  var min = parseInt(time[1]) < 30 ? "00" : "30";
  return time[0] + ":" + min;
}

/**
 * H:i-H:iの範囲時刻に対して、対象の時刻枠を返す
 * ex 10:15-10:30 -> ["10:00"]
 *    10:55-11:10 -> ["10:30","11:00"]
 */
function convertTimeRangeToSlotList(s) {
  var timeRange = s.split("-");
  var from = convertTimeStringToSlotString(timeRange[0]);
  var to = convertTimeStringToSlotString(timeRange[1]);

  var array = [from];
  //終了が枠ちょうどの時間の場合は、その時間開始の枠は消費されることをカウントしない。
  if (from != to && to != timeRange[1]) {
    array.push(to);
  }
  return array;
}



