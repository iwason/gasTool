/**
 *
 * QRコード作成用スクリプト。
 * 印刷用に固定値を利用
 *
 */
function generateQrRode() {
  var data = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
 　　var sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
  var image, response;

  for (var i = 0,row=1; i < data.length; row+=i%2*10,i++) {
    //GoogleAPIでQRコードを作成
    response = UrlFetchApp.fetch("https://chart.googleapis.com/chart?cht=qr&chs=135x135&chl=" + data[i][0]);
    image = response.getBlob();
    
    //10個置きに微調整
    if(i%10 == 0 && i > 0){
      //row-=1;
      //行の高さ 10個印刷したら、
      sheet.setRowHeight(row,5);
      sheet.setRowHeight(row-1,5);
      sheet.setRowHeight(row-2,5);
      sheet.setRowHeight(row-3,10);
      row++;
    }

    colum=2;
    columStr="B";
    //偶数回数なら３列目、偶数なら６列目に画像を配置
    if(i%2 ==1){
      colum=5;
      columStr="E";
    }
    
    //画像とURLを挿入
    sheet.getRange(columStr+ row).setValue(data[i][0]).setFontSize(14);
    //名前の入力
    sheet.getRange(columStr+(row+1)).setValue(data[i][1]);
    //sheet.insertImage(image, colum, row+1);

    sheet.insertImage(image, colum, row+2);

  }
}
