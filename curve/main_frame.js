var cons_strURLBase = "https://zhugegy.github.io/";
var cons_strURLCur = "curve/";

var cons_charDelimiter = " ";
var cons_nMaxReverseDays = 365 * 200;

var cons_strTimepoints = "1, 2, 7, 14, 32, 128, 512, 1024";
var cons_nTimepintsMax = 96;

// entry point
window.onload = function()
{
	// get current time and display
	var today = new Date();
	$('#today_date').text("Current Time: " + today.toString().substr(0, 24));  //omit the timezone info

	// file the deault timepoints
	$('#timepoints').val(cons_strTimepoints);

	// assign event listener
	$('#cal_button').click(function(){calculate();});

	// simulate the initial click
	$('#cal_button').click();
}

function calculate()
{
	var aryStrTimepints = get_user_intput();

	var aryObjDates = timepoint_calculation(aryStrTimepints);

	table_render(aryStrTimepints, aryObjDates);

}

function get_user_intput()
{
	var strCalculationReady = $('#timepoints').val().trim().replace(/[\D]+/g, cons_charDelimiter).trim();
	var aryStrTimepints = strCalculationReady.split(cons_charDelimiter);

	for (var i = aryStrTimepints.length -1; i >= 0 ; i--)
	{
	    if (parseInt(aryStrTimepints[i]) > cons_nMaxReverseDays)
			{
	        aryStrTimepints.splice(i, 1);
	    }
	}

	return aryStrTimepints;
}

function timepoint_calculation(aryStrTimepints)
{
	var nTimepointsLen = aryStrTimepints.length;
	if (nTimepointsLen > cons_nTimepintsMax)
	{
		nTimepointsLen = cons_nTimepintsMax;
	}

	var aryObjDates = [];

	for (var i = 0; i < nTimepointsLen; i++)
	{
		var date = new Date();

		date.setDate(date.getDate() - parseInt(aryStrTimepints[i]));
		aryObjDates.push(date);
	}

	return aryObjDates;
}

function table_render(aryStrTimepints, aryObjDates)
{
	$("#content_table tr").remove();
	$('#content_table').append('<tr><th>Distance (Days)</th><th>Date</th></tr>');

	for (var i = 0; i < aryObjDates.length; i++)
	{
		$('#content_table tr:last').after('<tr><td>' + aryStrTimepints[i] + '</td><td>' + aryObjDates[i].toString().substr(0, 15) + '</td></tr>');
	}
}
