function dataget() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var myValue = Browser.inputBox("Enter a number"); 
  sheet.getRange("A1").setValue("Number entered:");
  var b1Range = sheet.getRange("B1");
  b1Range.setValue(myValue);
  var valueToShow = b1Range.getValue() + 1;
  Browser.msgBox("The value you entered plus one is: " + valueToShow);
  
  Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy年M月d日')

}

//SpreadSheet = エクセルファイル
//Sheet       = シート
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
  var now   = today.getTime();

  //Browser.msgBox(data[200][0]);
  //Browser.msgBox(data[200][6]);

    //Browser.msgBox(today);
    //Browser.msgBox(now);
  isTimeString(data[11][6]);
  　　　　//Browser.msgBox(Utilities.formatDate(data[200][0], 'Asia/Tokyo', 'yyyy年M月d日'));

  for(var i = 0; i < data.length;i++){
  //      Logger.log(data[i][0] + "<br>");

     //日付以外,過去の予定はスルーする
     if(!isDate(data[i][6]) 
        || (isDate(data[i][0]) && data[i][0].getTime() < now)){
       continue;
    }
    Logger.log(data[i][0] + "<br>");

    //該当のデータを新シートに反映
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
function setLayout(ss){
    var size = 40;
    var hour = 8;
    ss.insertColumns(4, 10);
  
    for(var i = 5; i <= 28; i++,hour+=i%2) {
      ss.setColumnWidth(i, size);
      ss.getRange(1, i).setValue(hour + ":" + ((i %2 == 1) ? "00":"30"));
    }
  return ss;
}

function dayOfWeek(date){
  var d = ['日', '月', '火', '水', '木', '金', '土'];
  return d[date.getDay()];
}

function isDate(date){
  return is('Date', date);
}

//型チェック
function is(type, obj) {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
}

/*
* H:i - H:iの形式で時間を入力していれば、時刻とみなす
 */
function isTimeString(s){
  // - でスプリット
  var tmp = s.split("-");
  var from = tmp[0];
  var to   = tmp[1];


  // : でスプリット
  // 現在の日付を利用して妥当な数字かを確認
  

}
