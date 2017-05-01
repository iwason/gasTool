function example() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var myValue = Browser.inputBox("Enter a number"); 
  sheet.getRange("A1").setValue("Number entered:");
  var b1Range = sheet.getRange("B1");
  b1Range.setValue(myValue);
  var valueToShow = b1Range.getValue() + 1;
  Browser.msgBox("The value you entered plus one is: " + valueToShow);
  
  for(i=0;valueToShow < 1000;i++){
    cell = sheet.getRange("Bi");     
    cell.setValue(++valueToShow);
  }   
}

function in2mm(inNum) { // インチからミリメーターへの単位換算関数
  var outNum = 0;     //  変数outNumが答えを保持、初期値は０
  var factor = 25.4;  // 入力値をfactor変数で計算してアウトプット
  if (typeof inNum != "number") {  // 数値であることをチェック
    return("error: input must be a number");  // エラーメッセージを返す
  }
  outNum = inNum * factor;  // 答えを計算
  return outNum;  // 公式のあるセルへ答えを返す
}

function　showMenuBar(){
  // メニューを表示
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('QR Code').addItem('作成する', 'generateQrRode').addToUi();
}
function generateQrRode() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var image, response;
 
  for (var i = 0,j=1; i < data.length; i++) {
    response = UrlFetchApp.fetch("http://chart.apis.google.com/chart?cht=qr&chs=150x150&chl=" + data[i][0]); // A列のURL
    image = response.getBlob();
    //奇数なら３列目、偶数なら６列目
    colum=3+i%2*3;
    //2の倍数なら、行を増やさずに
    sheet.insertImage(image, colum, j+1);
    
    columStr = i%2 ==0 ? "C" : "F";
    //URLを突っ込む
    sheet.getRange(columStr+ j).setValue(data[i][0]);   
    //偶数なら行を増やさない
    j+=i%2*8;

  }
}