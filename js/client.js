
var socket = io.connect('http://localhost:3000');
var historychart = null;
var cpuhistmax = 100;
var memhistmax = 100;
var userhistmax = 100;
var diskhistmax = 100;
var cpuvalues = [];
var uservalues = [];
var diskvalues = [];
var memvalues = [];
var showhistory = 'CPU';
var chartstrokecolor = '#FFF';

getDataSet('CPU');
getDataSet('USERS');
getDataSet('INFO');
getDataSet('MEM');
getDataSet('DISK');
getDataSet('ALERTS');

setInterval(function() {
	getDataSet('CPU');
	getDataSet('USERS');
}, 5000);

setInterval(function() {
	getDataSet('INFO');
	getDataSet('MEM');
	getDataSet('DISK');
	getDataSet('ALERTS');
}, 60000);

$( document ).ready(function() {
	historychart = $("span.history").peity("line", {
		  width: "90%",
		  height: "90%",
		  colour: "transparent",
		  //strokeColour: "#EEE",
		  strokeColour: chartstrokecolor,
		  strokeWidth: 3
	});
});
			
			
socket.on('response', function(data) {
	var retVal = data.response;
	
	switch (data.service) {
		case 'CPU':
			$('#info-cpu').html(retVal);
			if (cpuvalues.length > cpuhistmax){
				cpuvalues.shift();
			}
			cpuvalues.push(retVal);
			break;
		case 'DISK':
			$('#info-disk').html(retVal);
			if (diskvalues.length > diskhistmax){
				diskvalues.shift();
			}
			diskvalues.push(retVal);
			break;
		case 'USERS':
			$('#info-users').html(retVal);
			if (uservalues.length > userhistmax){
				uservalues.shift();
			}
			uservalues.push(retVal);
			break;
		case 'MEM':
			$('#info-mem').html(retVal);
			if (memvalues.length > memhistmax){
				memvalues.shift();
			}
			memvalues.push(retVal);
			break;
		case 'INFO':
			$('#info-version').html(retVal.substring(0, retVal.indexOf("(")));
			break;
		case 'ALERTS':
			if (retVal > 0){
				$("#statusicon").attr("src", "img/WARNINGIcon.png");
			} else {
				$("#statusicon").attr("src", "img/OKIcon.png");
			}
			$('#info-alerts').html(retVal);
			break;
	}
	refreshChart();
});

function getDataSet(strService) {
	var objRequestVars = new Object();
	objRequestVars.service = strService;
	socket.emit('request', objRequestVars);
}


function saveSettings(){
	$('#info-name').html($('#servername').val());
	$('#info-detail').html($('#serverdetail').val());
	$('#myModal').modal('hide');
	
	if ($('input[name=colorscheme]:checked', '#modalbox').val() == 'Light') {
		$('#top').css('background-image', 'url(' + $('input[name=bg]:checked', '#modalbox').val() + ')');
		$('head').append('<link rel="stylesheet" href="../css/light.css" type="text/css" />');
		$('link[rel=stylesheet][href~="../css/fiori.css"]').remove();
	} else if ($('input[name=colorscheme]:checked', '#modalbox').val() == 'Dark') {
		$('#top').css('background-image', 'url(' + $('input[name=bg]:checked', '#modalbox').val() + ')');
		$('link[rel=stylesheet][href~="../css/light.css"]').remove();
		$('link[rel=stylesheet][href~="../css/fiori.css"]').remove();
	} else if ($('input[name=colorscheme]:checked', '#modalbox').val() == 'Fiori') {
		$('#top').removeAttr('style');
		$('head').append('<link rel="stylesheet" href="../css/fiori.css" type="text/css" />');
		$('link[rel=stylesheet][href~="../css/light.css"]').remove();
	}
}

function refreshChart(){
	switch (showhistory) {
		case 'CPU':
			$("span.history").text(cpuvalues.join(","));
			break;
		case 'DISK':
			$("span.history").text(diskvalues.join(","));
			break;
		case 'USERS':
			$("span.history").text(uservalues.join(","));
			break;
		case 'MEM':
			$("span.history").text(memvalues.join(","));
			break;
	}
	historychart.change();
}

function setChart(metric){
	var idname = "#info" + metric;
	showhistory = metric;
	$(".selected").removeClass("selected");
	$(idname).addClass("selected");
	refreshChart();
}