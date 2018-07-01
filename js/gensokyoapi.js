"use strict";

var NebPay = require("nebpay");
var nebPay = new NebPay();
var serialNumber;
var options = {
    goods: {        //commodity description
        name: "example"
    },
    enableDebug : false,
    listener: listener //specify a listener function for browser extension, which will handle the tx result
};
var browser = function getBrowserInfo() { //获取浏览器名称
    return 'chrome'
}();
var mainContractAddress = "n1xKPYRDMNzw1T3ZbsbECx3aYnZ45GQBLrP";
var testContractAddress = "n1qgK1j6wWPZYFhHEZQ2LnMnEZvHKSDLoAC";

function onSimulateCallClick(contractAddress,func,args,callback) {  //call查询调用函数，（合约地址，函数名，参数，回调）
	var to  = contractAddress;
	var value = '0';
	var callFunction = func;
	var callArgs = args;
	nebPay.simulateCall(to, value, callFunction, callArgs, {
	    qrcode: {
	        showQRCode: false
	    },
	    goods: {
	        name: "test",
	        desc: "test goods"
	    },
	    //enableDebug: true,
	    listener: callback 
	});
}




function newTransaction(contractAddress,val,callFunction,callArgs,callback) {  //合约交易调用函数，（合约地址，价格，函数名，参数，回调）
	if (browser == 'chrome') {
		if (typeof(webExtensionWallet) === "undefined") {
			alert("请先安装星云谷歌拓展钱包.")
		} else {
		    var to = contractAddress;
		    var value = val;
		    var callFunction = callFunction;
			var callArgs = callArgs;
			serialNumber = nebPay.call(to, value, callFunction, callArgs, {
			    enableDebug: true,
			    listener: callback
			});
			//setTimeout(() => {
			//	onrefreshClick();
			//}, 1000);
		}
	} else {
		alert('请在谷歌浏览器下输入');
	}
}



function onrefreshClick() {
	nebPay.queryPayInfo(serialNumber) //search transaction result from server (result upload to server by app)
		.then(function(resp) {
			console.log('----------------queryPayInfo-----------');
			console.log(resp);
		})
		.catch(function(err) {
			console.log('----------------queryPayInfo-----------');
			console.log(err);
		});
}


function listener(resp) {
    console.log("resp: " + JSON.stringify(resp))
    //document.getElementById("resultFromExtension").value = JSON.stringify(resp)
}





function timeStamp2String(time) {
    if (time == 0) {
        return "";
    } else {
    var datetime = new Date(); 
    datetime.setTime(1e3 * time);
    var year = datetime.getFullYear(); 
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1; 
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate(); 
    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours(); 
    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes(); 
    var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds(); 
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second; 
    }
}

function timeStamp2String2(time) {
    if (time == 0) {
        return "";
    } else {
        var datetime = new Date();
        datetime.setTime(1e3 * time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
        var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
        var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
        var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
        var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
        return year + "-" + month + "-" + date;
    }
}

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}