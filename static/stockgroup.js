function checkonlinedata() {
    $('#stockcontent').html('')
    $.ajax({
      type: "GET",
      url: 'checkonlinedata',
      dataType: "html",
      success: function(data){
        $('#stockcontent').html('<div style="text-align:left;">' + data + '</div>')
      },
      error: function() {
        $('#stockcontent').html('<div style="text-align:left;">檢查失敗!</div>')
      }
    })
}

function showCandle(url, year) {
    url = url.trim()
    console.log(url);
    $('#stockcontent').html('<img src="/candle?code=' + url + '&year=' + year + '&time=' + new Date().getSeconds() + '" style="width:100%;" />');
}

function showCandleV30(stockId, startDate, endDate) {
    $('#stockcontent').html('<img src="/candleV3?stockId=' + stockId + '&startDate=' + startDate + '&endDate=' + endDate + '" style="width:100%;" />');
}

var pool = []
function insertPool(groupId) {
    pool.forEach((element)=>{
      if(groupId == element) return false;
    })
    pool.append(groupId);
    return true;
}

var lock = false;
var activeGroupId = ''
var stockIds = [];
var stockIdsLength = 0;
var allStocks = [];

function updateAll() {
  if(!lock) {
      lock = true;

      
      // allStocks = ;
      

      $('#stockcontent').html('')        
      $('.quoteList').html('');

      let index = 0;
      if(index < allStocks.length) {
        updateAllStockData(index);
      } else {
        $('.quoteList').append('<li>No items!</li>');
        lock = false;
      } 
        
  } else {
    $('#stockcontent').html('<div style="text-align:left;">請稍等!正在更新中。。。</div>')
  }
}

function updateAllStockData(index)
{
    stockId = allStocks[index]
    
    $.ajax({
        url: '/updatestock',
        async: true,
        data: JSON.stringify({'stockId' : stockId}),
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(returnData){
          $('.quoteList').append('<li>' + returnData +'</li>');
          index++;
          if (index < allStocks.length) { 
            setTimeout(function() {
              updateAllStockData(index);
            }, 1000);
          } else {
            $('.quoteList').append('<li>down</li>');
            lock = false;
            console.log('更新成功')
          }
        },
        error: function(xhr, ajaxOptions, thrownError){
            lock = false;
            console.log(xhr.status);
            console.log(thrownError);
            $('.quoteList').append('<li>Error, Stop!</li>');
        }
    });
}

function updateGroup(groupId) {
    if(!lock) {
        lock = true;

        activeGroupId = groupId
        stockIds = laDataModel[groupId];
        stockIdsLength = laDataModel[groupId].length;

        $('#stockcontent').html('')        
        $('.quoteList').html('');

        let index = -1;
        if(stockIds[0]=='^TWII') index = 0;

        updateStockData(index);

    } else {
      $('#stockcontent').html('<div style="text-align:left;">請稍等!正在更新 '+ activeGroupId +' 群組！</div>')
    }
}

function updateStockData(index)
{
    if(index === -1) {
          $.ajax({
            url: '/updatestock',
            async: false,
            data: JSON.stringify({'stockId' : '^TWII'}),
            type: "POST",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            success: function(returnData){
              $('.quoteList').append('<li>' + returnData +'</li>');
              index++;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
                $('.quoteList').append('<li>Error!</li>');
                return 
            }
        });
    }

    stockId = stockIds[index]
    
    $.ajax({
        url: '/updatestock',
        async: true,
        data: JSON.stringify({'stockId' : stockId}),
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(returnData){
          $('.quoteList').append('<li>' + returnData +'</li>');
          index++;
          if (index < stockIdsLength) { 
            setTimeout(function() {
                updateStockData(index);
            }, 1000);
          } else {
            $('.quoteList').append('<li>down</li>');
            lock = false;
            console.log('更新成功')
          }
        },
        error: function(xhr, ajaxOptions, thrownError){
            lock = false;
            console.log(xhr.status);
            console.log(thrownError);
            $('.quoteList').append('<li>Error, Stop!</li>');
        }
    });
}

function updateStock(stockId)
{        
    $.ajax({
        url: '/updatestock',
        async: true,
        data: JSON.stringify({'stockId' : stockId}),
        type: "POST",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        success: function(returnData){
            $('#stockcontent').html('<div style="text-align:left;">'+ returnData +'</div>')
        },
        error: function(xhr, ajaxOptions, thrownError){
            lock = true;
            console.log(xhr.status);
            console.log(thrownError);
            $('#stockcontent').html('<div style="text-align:left;">更新失敗！</div>')
        }
    });
}

var lockNotify = false;
var processGroup = '';

function notifyGroup(groupId) {
    
    if(!lockNotify) {
        lockNotify = true;
        processGroup = groupId;        
        $('#stockcontent').html('');
        url = '/notifygroup?groupId=' + groupId;
        $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        success: function(data){
            $('#stockcontent').html('<div style="text-align:left;">' + data + '</div>');
            console.log(data);
            lockNotify = false;
        },
        error: function() {
                $('#stockcontent').html('<div style="text-align:left;">通知失敗!</div>');
        }});
    } else {
        $('#stockcontent').html('<div style="text-align:left;">' + '目前正在通知 ' + processGroup + ' 群組</div>');
    }

}

function showHistory(stockId) {
    
    url = '/historydata?stockId=' + stockId;   
    $.ajax({
      type: "GET",
      url: url,
      dataType: "html",
      success: function(data){
        $('#stockcontent').html('<div>' + data + '</div>')
      },
      error: function() {
        $('#stockcontent').html('<div style="text-align:left;">讀取資料失敗!</div>')
      }
    });

}

function showPost(url) {
    
    $.ajax({
      type: "GET",
      url: url,
      dataType: "html",
      success: function(data){
        $('#stockcontent').html('<div style="text-align:left;">' + data + '</div>')
      },
      error: function() {
        $('#stockcontent').html('讀取資料失敗!')
      }
    });

}

function showDescript(stockId) {

    url = '/description?code=' + stockId;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "html",
      success: function(data){
        $('#stockcontent').html('<div style="text-align:left;">' + data + '</div>');
      },
      error: function() {
        $('#stockcontent').html('讀取資料失敗!');
      }
    });

}

function showDividend(stockId) {

    $('#stockcontent').html('<a href="#" onclick="getDividend(\''+ stockId +'\')">重新抓取資料</a>');
    url = '/dividend?code=' + stockId;
    $.ajax({
      type: "GET",
      url: url,
      dataType: "html",
      success: function(data){
        $('#stockcontent').append('<div>' + data + '</div>');
      },
      error: function() {
        $('#stockcontent').html('讀取資料失敗!');
      }
    });

}

function getDividend(stockId) {

    url = '/getdividend?stockId='+stockId;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        success: function(data){
          showDividend(stockId);
          
        },
        error: function() {
          $('#stockcontent').html('更新失敗!');
        }
    });

}

function appendItem(groupId) {
  $('#stockcontent').html(groupId);
}