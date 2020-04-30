var cons_strURLBase = "https://zhugegy.github.io/";
var cons_strURLCur = "cv/";

//var cons_isDebug = false;
var cons_isDebug = true;

g_mapCurrentChoosenLabels = {};
g_mapLabelsCount = {};

var g_objTabProperty;

function init_global_objTabProperty(data)
{
	g_objTabProperty = data;
}

var g_objLabelProperty;

function init_global_objLabelProperty(data)
{
	g_objLabelProperty = data;
}

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
		if (strMenuItemName == "basic_information")
		{
				__fetch_data_and_render('https://api.myjson.com/bins/9klq7', action_with_table_content_data);
		}
		else if (strMenuItemName == "personal_experience")
		{
				__fetch_data_and_render('https://api.myjson.com/bins/s1jec', action_with_table_content_data);
		}
		else if (strMenuItemName == "skill_list")
		{
				//__fetch_data_and_render('https://api.myjson.com/bins/8kc3p', action_with_table_content_data);
				__fetch_data_and_render('https://api.jsonbin.io/b/5e6a2b8640f2f82b294b105f/19', action_with_table_content_data);
		}
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

	// Load the content of the controlPanelBox section.
	$("#controlPanelBox").empty();
	var strControlPanelName = g_objTabProperty[strTmpItemName]["control_panel"];
	if (strControlPanelName != null)
	{
		$("#controlPanelBox").load(cons_strURLBase + cons_strURLCur + "sub_sections/" + strControlPanelName,
								function (response)
								{
									//inner call back
								} );
	}

	// Load the content of the infoTableBox section.
	// Content is initially empty, which will be filled in the callback function with the proper data according to strTmpItemName.
	$("#infoTableBox").empty();
	var strInfoTableName = g_objTabProperty[strTmpItemName]["info_table"];
	if (strInfoTableName != null)
	{
		$("#infoTableBox").load(cons_strURLBase + cons_strURLCur + "sub_sections/" + strInfoTableName,
								function (response)
								{
									info_table_loaded_inner_callback(strTmpItemName, response);
								} );
	}

	// Load the content of the footerBox section.
	$("#footerBox").empty();
	var strFooterName = g_objTabProperty[strTmpItemName]["footer"];
	if (strFooterName != null)
	{
		$("#footerBox").load(cons_strURLBase + cons_strURLCur + "sub_sections/" + strFooterName,
								function (response)
								{
									//inner call back
								} );
	}

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
		if (lLanguageItems[i]['link'] != null)
		{
				divLanguageArea.innerHTML += "<a href = \"" + lLanguageItems[i]["link"] + "\">" + lLanguageItems[i]["content"] + "</a>";
		}
	}
}

function clickable_tr_post_amendation()
{
	$(".clickabletr").click(function ()
		{
			$(this).toggleClass("light_darktr");

			var strHiddenID = "#" + this.id + "Hidden";
			var strShownID = "#" + this.id + "Shown";
			var strReplacementID = "#" + this.id + "Replacement";
			if ($(strHiddenID).is(":hidden"))
			{
		    //$(strHiddenID).slideDown("slow");
				//$(strHiddenID).slideToggle();
				$(strHiddenID).show();
				$(strShownID).hide();
				$(strReplacementID).show();
  		}
			else
			{
				$(strReplacementID).hide();
				$(strShownID).show();
		    $(strHiddenID).hide();
  		}
		});
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

			while (strContentTmp.indexOf('±') > -1)
			{
			  strContentTmp = strContentTmp.replace('±', lDataEntries[i]['entry-id']);
			}

			var strTargetDivName = lDataEntries[i]["field"] + "_tobefilled";
			document.getElementById(strTargetDivName).innerHTML += strContentTmp;
		}
	}

	clickable_tr_post_amendation();
}

function load_body_content()
{
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
		__fetch_data_and_render('https://api.myjson.com/bins/19y410', action_with_language_switch_data);
	}
	else
	{
		fetch_data_and_render('../data/language_items.json', action_with_language_switch_data);
	}

	// add ripples effect
  //$('#menuBox').ripples({esolution: 512, dropRadius: 20, perturbance: 0.04});

}

function load_body_backbone_structure()
{
	var request = new XMLHttpRequest();
	request.open('GET', '../HTMLBodyBackbone/HTMLBodyBackbone.txt', true);
	request.responseType = 'blob';
	request.onload = function() {
		var reader = new FileReader();
		reader.readAsText(request.response);
		reader.onload =  function(e){
			var bodyArea = document.getElementsByTagName('body')[0];
			bodyArea.innerHTML = e.target.result;

			load_body_content();
		};
	};
	request.send();

}

// used only in dubug
function __read_json_sync(strPath, funAction)
{
	__fetch_data_and_render(strPath, funAction);
}

function read_json_sync(strPath, funAction)
{
	$.ajaxSetup({
				async: false
		});

	$.getJSON(strPath, function(data) {funAction(data);} );

	$.ajaxSetup({
				async: true
	});
}

// skill_list相关的全局表
// 1. object全局 g_objLabelProperty：a. group b. score
// 2. Map 全局 g_1 (g_mapCurrentChoosenLabels)： 当前用户所选lables
// 3. Map 全局 g_2 (g_mapLabelsCount):  所有label的计数器，每次打开网页仅计数一次。

/*
	1. 点击skill tab
	2. load 3 sections
	3. tables inner call
		3.1 显示control panel内容
			3.1.1 if g_2 is {empty}, 统计data里面的所有lable个数
			3.1.2 render control panel， class="clickable_lable", id="lable-raw_name", checked与否检查g_1状态, 位置查询g_objLabelProperty
			3.1.3 $(.clickable_lable).onclick = 修改 g_1状态; toggle checkedclass
		3.2 分批次显示tables 内容： 1. matched label个数  2. 同样个数，根据score分显示顺序
*/

// 测试样本：
// 1. ArticleInsight: JavaScript, MEAN, MongoDB, HTML, CSS, AWS Cloud, Programming
// 2. Simple Forum: Java, Spring, MySQL, HTML, CSS, Programming
// 3. PacMan: Time Traveller: C++, Programming
// 4. Das-Boot: C++, MFC, Programming
// 5.

// entry point
window.onload = function()
{
	//initilize the global variables
	if (cons_isDebug)
	{
		//debug
		__read_json_sync('https://api.myjson.com/bins/b504x', init_global_objTabProperty);
		__read_json_sync('https://api.myjson.com/bins/ntr1d', init_global_objLabelProperty);
	}
	else
	{
		//release
		read_json_sync('../data/global/tab_property.json', init_global_objTabProperty);
		read_json_sync('../data/global/label_property.json', init_global_objLabelProperty);
	}

	if (cons_isDebug)
	{
		//debug : only for debug propose, when body backbone is embeded statically in HTML file rather than loaded dynamically.
		load_body_content();
	}
	else
	{
		//release
		load_body_backbone_structure();
	}
}
