var cons_strURLBase = "https://zhugegy.github.io/";
var cons_strURLCur = "cv/";

g_mapCurrentChoosenLabels = {};
g_mapLabelsCount = {};

var g_objTabProperty;
var g_objLabelProperty;

function fetch_data_and_render(strDataLink, funRender)
{
	$.getJSON(strDataLink, function(data) {funRender(data);} );
}

// callback function
function info_table_loaded_inner_callback(strMenuItemName, response)
{
	fetch_data_and_render('../data/table_contents/' + strMenuItemName + '.json', action_with_table_content_data);
}

function menuItems_listener()
{
	strId = this.id;
	strTmpItemName = strId.slice("menu_item_".length);

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

	// Load the content of the controlPanelBox section.
	$("#controlPanelBox").empty();
	var strControlPanelName = g_objTabProperty[strTmpItemName]["control_panel"];
	if (strControlPanelName != null)
	{
		//$("#controlPanelBox").style.display = 'block';
		$("#controlPanelBox").load(cons_strURLBase + cons_strURLCur + "sub_sections/" + strControlPanelName,
								function (response)
								{
									//inner call back
								} );
	}
	else
	{
		$("#controlPanelBox").style.display = 'none';
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

function action_with_table_content_data(jsonData, labelArray=[])
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
			
			// fill in the label
			if (lDataEntries[i].hasOwnProperty('labels'))
			{
				var strLabelList = "";
				var aryStrLabels = lDataEntries[i]['labels']
				for (var j = 0; j < aryStrLabels.length; j++)
				{
					//"<span class=\"label label-programming-language\">JavaScript</span>",
					var strGroup = g_objLabelProperty[aryStrLabels[j]]['group'];
					strTmp = "<span class=\"label " + strGroup + "\">&nbsp;" + aryStrLabels[j] + "&nbsp;</span> ";
					strLabelList += strTmp;
				}

				var strTargetDivName = lDataEntries[i]['entry-id'] + "-label";
				document.getElementById(strTargetDivName).innerHTML = strLabelList;
			}

			//g_mapLabelsCount 所有label的计数器，每次打开网页仅计数一次。
		}
	}

	clickable_tr_post_amendation();
}

function load_body_content()
{
	//display menu
	fetch_data_and_render('../data/menu_items.json', action_with_menu_data);

	//display language switch
	fetch_data_and_render('../data/language_items.json', action_with_language_switch_data);

	// add ripples effect
    $('#menuBox').ripples({esolution: 512, dropRadius: 20, perturbance: 0.04});
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

function init_global_objTabProperty(data)
{
	g_objTabProperty = data;
}

function init_global_objLabelProperty(data)
{
	g_objLabelProperty = data;
}

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
	fetch_data_and_render('../data/global/tab_property.json', init_global_objTabProperty);
	fetch_data_and_render('../data/global/label_property.json', init_global_objLabelProperty);

	load_body_backbone_structure();
}
