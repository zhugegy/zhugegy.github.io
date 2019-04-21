var cons_strURLBase = "https://zhugegy.github.io/";
var cons_strURLCur = "cv/";

var cons_isDebug = true;

// Due to diffculty in reading local jason files, the jason content is read via URL data transfer.
// source: https://stackoverflow.com/questions/19440589/parsing-json-data-from-a-url
function getJSON(url)
{
	var resp;
	var xmlHttp;

	resp  = '';
	xmlHttp = new XMLHttpRequest();

	if(xmlHttp != null)
	{
		xmlHttp.open( "GET", url, false );
		xmlHttp.send( null );
		resp = xmlHttp.responseText;
	}

	return resp ;
}

// (temporary) local approach (only for fast debug propose). 'strDataLink' should be from 3rd party JSON storage service.
function __fetch_data_and_render(strDataLink, funRender)
{
	var jsonRawData = getJSON(strDataLink) ;
	var data = JSON.parse(jsonRawData);
	funRender(data);
}

// (recommended) remote approach. 'strDataLink' resides within my GitHub.io domain. Not locally debuggable.
function fetch_data_and_render(strDataLink, funRender)
{
	$.getJSON(strDataLink, function(data) {funRender(data);} );
}

// callback function
function info_table_loaded_inner_callback(strMenuItemName, response)
{
	// (optional) do something with the response (a html file with just an empty table)

	// Fill in the table 
	if (cons_isDebug)
	{
		__fetch_data_and_render('https://api.myjson.com/bins/zw1k4', action_with_table_content_data);
	}
	else
	{
		fetch_data_and_render('../data/table_contents/' + strMenuItemName + '.json', action_with_table_content_data);
	}	
}

function menuItems_listener()
{
	strId = this.id;
	strTmpItemName = strId.slice("menu_item_".length);

	// Load the content of the infoTableBox section. 
	// Content is initially empty, which will be filled in the callback function with the proper data according to strTmpItemName.
	$("#infoTableBox").load(cons_strURLBase + cons_strURLCur + "sub_sections/info_table.html", 
							function (response) 
							{
								info_table_loaded_inner_callback(strTmpItemName, response);
							} );
}

function action_with_menu_data(jsonData)
{
	var lMenuItems = jsonData;
	var strLang = $('html')[0].lang;
	var menuItemsList = document.getElementById("menuItemsList");

	for (var i = 0; i < lMenuItems.length; i++)
	{
		//<li class="menuItem"><a href="#home">Home</a></li>
		//<img src="smiley.gif" alt="HTML tutorial" style="width:42px;height:42px;border:0;">
		strTmpLink = "<li class=\"menuItem\" id=\"" + lMenuItems[i].id + "\"><a href=\"#" + lMenuItems[i].name + "\">" + 
		"<img src=\"../images/menu/" + lMenuItems[i].name + "_" + strLang + "." + lMenuItems[i].image_format + "\" alt=\"" + lMenuItems[i].name + "\"></a></li>";

		menuItemsList.innerHTML += strTmpLink;
	}

	// register the menu items for user interactions later on
	var menuItems = document.getElementsByClassName("menuItem");
	for (var i = 0; i < menuItems.length; i++)
	{
		menuItems[i].onclick = menuItems_listener;
	}
}

function action_with_language_switch_data(jsonData)
{
	var lLanguageItems = jsonData;
	var divLanguageArea = document.getElementsByClassName("switchLanguageDropDownContent")[0];

	for (var i = 0; i < lLanguageItems.length; i++)
	{
		divLanguageArea.innerHTML += "<a href = \"" + lLanguageItems[i]["link"] + "\">" + lLanguageItems[i]["content"] + "</a>";
	}
}

function action_with_table_content_data(jsonData)
{
	var lDataEntries = jsonData;
	var strLang = $('html')[0].lang;
	var strContentPropertyName = 'content_' + strLang;

	for (var i = 0; i < lDataEntries.length; i++)
	{
		if(lDataEntries[i].hasOwnProperty(strContentPropertyName))
		{
			strContentTmp = lDataEntries[i].format.join("");
			
			var j = 0;
			while (strContentTmp.indexOf('$') > -1)
			{
			  strToWriteIn = lDataEntries[i][strContentPropertyName][j];
			  strContentTmp = strContentTmp.replace('$', strToWriteIn);
			  j++;
			}

			var strTargetDivName = lDataEntries[i]["field"] + "_tobefilled";
			document.getElementById(strTargetDivName).innerHTML += strContentTmp;
		}
	}
}

function load_body_content()
{
	//var reader = new FileReader();
	//reader.onload = function(){
	//	  var text = reader.result;
	//	  alert(text)
	//	};
	//reader.readAsText('../data/HTMLBodyArea.txt');

	var fs = require('fs');
 
	fs.readFile('../data/HTMLBodyArea.txt', 'utf8', function(err, data) 
		{  
		if (err)
		{	
			throw err;
		} 
		alter(data);
		});

	var bodyArea = document.getElementsByTagName('body')[0];

}

// entry point
window.onload = function()
{
	load_body_content()


	//display menu
	if (cons_isDebug)
	{
		__fetch_data_and_render('https://api.myjson.com/bins/1f9ax4', action_with_menu_data);	
	}
	else
	{
		fetch_data_and_render('../data/menu_items.json', action_with_menu_data);	
	}	
	
	
	//display language switch 
	if (cons_isDebug)
	{
		__fetch_data_and_render('https://api.myjson.com/bins/w7ev8', action_with_language_switch_data);	
	}
	else
	{
		fetch_data_and_render('../data/language_items.json', action_with_language_switch_data);	
	}	
}
