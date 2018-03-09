//Variables - Servers
var SocketIOServer_Ticker	= 'https://secure.cdn.technistock.net:8001';
var SocketTicker;

var maxStockDisplay 	= 14;
var market_Up			= 0;
var market_Down			= 1;
var market_Unch			= 2;

var popupTicker = null;

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
// E N C R Y P T I O N 
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
var EncryptionPassword 	= 'T3chnist0ck';

function EncryptData(objectToEncrypt){
	var json_text 		= JSON.stringify(objectToEncrypt, null, 2);
	var encryptedObject = CryptoJS.AES.encrypt(json_text, EncryptionPassword);
	
	return encryptedObject;
}

function DecryptData(objectToDecrypt){
	var decryptedObject = CryptoJS.AES.decrypt(objectToDecrypt, EncryptionPassword);
	var json_text 		= JSON.parse(decryptedObject.toString(CryptoJS.enc.Utf8));
	
	return json_text;
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
// F U N C T I O N S
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function addCommas(nStr){
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
	
    while (rgx.test(x1)){
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
	
	return x1 + x2;
}

function closeTicker(){	
	$('#tickerON', window.parent.frames["main"].document).attr("class", "unselectedLabel");
	$('#tickerOFF', window.parent.frames["main"].document).attr("class", "redLabel");
	$("#mainMiddle", window.parent.frames["main"].document).css("height","185px");
	$(".stockPositionMainDataWithScroll", window.parent.frames["main"].document).css("height","108px");
	$(".extendRow", window.parent.frames["main"].document).css("display","block");
	top.document.getElementById("frameRow").rows = "0,*";
	top.ticker.location.href = "about:blank";
}	


function openTicker(){
	var a = String(window.opener.top.frames["right"].location);
	var page = "/ticker.asp";
	
	$('#tickerON', window.opener.top.frames["main"].document).attr("class", "greenLabel");
	$('#tickerOFF', window.opener.top.frames["main"].document).attr("class", "unselectedLabel");
	$("#mainMiddle", window.opener.top.frames["main"].document).css("height","185px");
	$(".stockPositionMainDataWithScroll", window.opener.top.frames["main"].document).css("height","108px");
	$(".extendRow", window.opener.top.frames["main"].document).css("display","none");
	
	window.opener.top.document.getElementById("frameRow").rows = "86px,*";
	window.opener.top.frames["ticker"].location.href = (a.substring(a.length - 9) == "blank.asp") ? page+"?t=1" : page+"?t=2";
	
}			
			
function detachTicker(){	
	closeTicker();
	$('#tickerON', window.parent.frames["main"].document).attr("class", "greenLabel");
	$('#tickerOFF', window.parent.frames["main"].document).attr("class", "unselectedLabel");
	
	
	
	popupTicker = window.open("ticker.asp?t=3", "", "toolbar=no, scrollbars=no, resizable=no, top=0, left=0, width=1250, height=60px");

	
}

window.onbeforeunload = function(){
	try {
		$('#tickerON', window.opener.top.frames["main"].document).attr("class", "unselectedLabel");
		$('#tickerOFF', window.opener.top.frames["main"].document).attr("class", "redLabel");
	}catch (r) {}
}

	
function attachTicker(){
	window.close();
	openTicker();
}
			
function goToQuotesBNA(scode){	
	if(typeof window.parent.frames["main"] == "undefined"){
		if($('#lnkWatchList', window.opener.top.frames["main"].document).length > 0)
		{
			$('#secCode', window.opener.top.frames["main"].document).val(scode);
			$('#lnkWatchList', window.opener.top.frames["main"].document).val(scode);
			$('#lnkWatchList', window.opener.top.frames["main"].document).click();
		}
		else
		{
			window.opener.top.frames["main"].location.href = "/quotes.asp?type=si&subitem=bna&code="+scode; 
			$('#btnGoSI', window.opener.top.frames["main"].document).click(); 
		}
	}else{
		if($('#lnkWatchList', window.parent.frames["main"].document).length > 0)
		{
			$('#secCode', window.parent.frames["main"].document).val(scode);
			$('#lnkWatchList', window.parent.frames["main"].document).val(scode);
			$('#lnkWatchList', window.parent.frames["main"].document).click();
		}
		else
		{
			window.parent.frames["main"].location.href = "/quotes.asp?type=si&subitem=bna&code="+scode; 
			$('#btnGoSI', window.parent.frames["main"].document).click(); 
		}
	}
}

function disconnectTicker(){
	SocketTicker.disconnect();
}

function connectTicker(){
	SocketTicker.socket.connect();
}



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
// M A I N
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
$(document).ready(function(){
	
	var ctr 	= 1;
	var loopCtr = 1;
	var aaa = 1;
	 	
	var SocketTicker = io.connect(SocketIOServer_Ticker, {secure: true, /*'reconnect':true, 'reconnection delay': 5000}*/
			//reconnect : false
			reconnect : true, 
			'reconnection delay': 5000,
			'max reconnection attempts': 10,
			'connect timeout': 10000
	});
	
	SocketTicker.on('disconnect', function() 
	{
		//console.log('disconnected.'); 
		
		//this.connect(callback);
	});
	
	SocketTicker.on('TS-Ticker', function(data){
		
		var dataFeed = DecryptData(data);
		
		var seccode = dataFeed.seccode.toString(),
			rowx	= "Tick" + ctr,
			price	= dataFeed.price.toString(),
			volume	= dataFeed.volume.toString(),
			buyer	= dataFeed.buyer.toString(),
			seller	= dataFeed.seller.toString();
			
		if (parseFloat(price) < .50){
			price = parseFloat(price).toFixed(4);
		}else{
			price = parseFloat(price).toFixed(2);
		}
		
		var elemBody = 	'<div class="row2 TickSeccode" style="margin:-1px;">'+seccode+'</div>'+
						'<div class="row2 TickPrice" style="margin:-1px 0px 0px 10px;">'+addCommas(price)+'</div>'+
						'<div class="row2 TickVolume" style="margin:-1px;">'+addCommas(volume)+'</div>'+
						'<div class="row2 TickBuyer" style="margin:-1px;">'+buyer+'</div>'+
						'<div class="row2 TickSeller" style="margin:-1px 0px 0px 10px;">'+seller+'</div>';
					
		var elem = 	"<div id='"+rowx+"' onClick=\"goToQuotesBNA('"+seccode+"');\" data-id='"+ctr+"' class='direction box' style='cursor:pointer;font-size:11px;padding:0px 10px 50px;background-color:transparent;width:85px;float:right;'>"+
						elemBody +
					'</div>';
					

		if (ctr <= maxStockDisplay){
			$(elem).prependTo("#wrapper");
			ctr++;
		}else{
			while (loopCtr < ctr){
				if(loopCtr == (ctr-1)){		
				
					$("#Tick" + maxStockDisplay).html(elemBody);
					$("#Tick" + maxStockDisplay).attr("onClick","goToQuotesBNA('"+seccode+"')");			
					
				}else{
					
					$("#Tick" + loopCtr).attr("onClick",$("#Tick" + (loopCtr + 1)).attr("onClick"));
					$("#Tick" + loopCtr).html($("#Tick"+(loopCtr+1)).html());	
					$("#Tick" + loopCtr).removeClass().addClass(($("#Tick" + (loopCtr + 1)).attr("class")))	
				}
				loopCtr++;
			}
				
			loopCtr = 1;
		}
		
		$("#Tick" + parseInt(ctr - 1)).removeClass("upColor-a downColor-a unchangeColor-a crossColor-a box");
				
		if (dataFeed.buyer.toString() == dataFeed.seller.toString()){
			$("#Tick" + (ctr-1)).addClass("crossColor-a");
		}else if (dataFeed.flag.toString() == market_Up){
			$("#Tick" + (ctr-1)).addClass("upColor-a");
		}else if (dataFeed.flag.toString() == market_Down){
			$("#Tick" + (ctr-1)).addClass("downColor-a");
		}else if (dataFeed.flag.toString() == market_Unch){
			$("#Tick" + (ctr-1)).addClass("unchangeColor-a");
		}else{
			$("#Tick" + (ctr-1)).addClass("upColor-a");
		}
		
		seccode = '';
	});
});