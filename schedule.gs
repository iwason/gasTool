function collectInformation() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Overview');
  var tmp = ss.getSheetByName('PH Holidays').getRange('A:A').getValues();
  tmp.shift();
  //祝日のリスト
  var Holidays = tmp.filter(String);

  //出力先
//  var ns = setLayout(SpreadsheetApp.getActiveSpreadsheet().insertSheet());

  //入力されているデータサイズ　(B列に入力されている)
  var data = sheet.getRange('B:H').getValues();

  var today = new Date();
  var now = today.getTime();

  //Browser.msgBox(Utilities.formatDate(data[200][0], 'Asia/Tokyo', 'yyyy年M月d日'));

  //日付,時刻枠,レッスン数のmap
  var lessonDataMap = {};
  if (!lessonDataMap["日付"]) lessonDataMap["2017/05/17"] = {};

  debug["2017/05/17"]["10:00"] = 1;

  //入力データの加工
  for (var i = 0; i < data.length; i++) {
    //日付以外,過去の予定はスルーする
    if (!isTimeString(data[i][6])
      || (isDate(data[i][0]) && data[i][0].getTime() < now)) {
      continue;
    }

    //

    //debug = convertTimeRangeToSlotList(data[i][6]);
    //Logger.log(debug + "<br>");

    //該当のデータを新シートに反映
  }


  //出力データの加工

  //出力
  for (var lessonDate in lessonDataMap) {
    //該当の日付のリスト
    dataList[lessonDate];
    for (var lessonTime in lessonDataMap[lessonDate]) {
      Browser.msgBox(lessonTime + "の値：" + lessonDataMap[lessonDate][lessonTime] + "<br>");
    }
  }


  //Browser.msgBox(sheet.getRange(1,2,sheet.getLastRow(),2).getLastRow());
//  Browser.msgBox(sheet.getLastRow())
//  Browser.msgBox(sheet.getRange(sheet.getLastRow(), 8).getValue());
//  Browser.msgBox(sheet.getRange(238, 2).getValue());

  //SpreadSheet取得
  //Browser.msgBox(SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName());
  Browser.msgBox(Logger.getLog());

}

/**
 *  calendarを作る
 */
function setLayout(ss) {
  var size = 40;
  var hour = 8;
  ss.insertColumns(4, 10);

  for (var i = 5; i <= 28; i++, hour += i % 2) {
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
    && s.match(/^(0[0-9]|1[0-9]):(0[0-9]|[1-5][0-9])-(0[0-9]|1[0-9]):(0[0-9]|[1-5][0-9])$/);

}

/*
 * H:iの時刻形式を、30分刻みの文字列に変換する
 * ex 10:15 -> 10:00
 *     10:55 -> 10:30
 */
function convertTimeStringToSlotString(s) {
  var time = s.split(":");
  var min = parseInt(time[1]) < 30 ? "00" : "30";
  return time[0] + ":" + min;
}

/*
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

