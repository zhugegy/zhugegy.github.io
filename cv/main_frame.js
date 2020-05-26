var const_strSkillList = 'skill_list';

var g_mapCurrentChoosenLabels = {};
var g_mapLabelsCount = {};
var g_bLabelsCountedSignal = false;
var g_lLabelCountSorted = [];

var g_objTabProperty = {};
var g_objLabelProperty = {};


function fetch_data_and_action(strDataLink, funRender, objAddition)
{
	$.getJSON(strDataLink, function(data) {funRender(data, objAddition);} );
}

function menuItems_listener()
{
	strId = this.id;
	strTmpItemName = strId.slice("menu_item_".length);
	g_strCurrentTabName = strTmpItemName;

	// Load the content of the infoTableBox section.
	// Content is initially empty, which will be filled in the callback function with the proper data according to strTmpItemName.
	$("#infoTableBox").empty();
	if (g_objTabProperty[strTmpItemName].hasOwnProperty('info_table'))
	{
		$("#infoTableBox").load("../sub_sections/" + g_objTabProperty[strTmpItemName]['info_table'],
								function (response)
								{
									fetch_data_and_action('../data/table_contents/' + strTmpItemName + '.json', action_with_table_content_data, {'tab': strTmpItemName});
								} );
	}

	// Load the content of the controlPanelBox section.
	$("#controlPanelBox").empty();
	if (g_objTabProperty[strTmpItemName].hasOwnProperty('control_panel'))
	{
		//$("#controlPanelBox").style.display = 'block';
		$("#controlPanelBox").load("../sub_sections/" + g_objTabProperty[strTmpItemName]['control_panel'],
								function (response)
								{
									control_panel_manipulaton({'tab': strTmpItemName});
								} );
	}
	// else
	// {
	// 	$("#controlPanelBox").style.display = 'none';
	// }

	// Load the content of the footerBox section.
	$("#footerBox").empty();
	if (g_objTabProperty[strTmpItemName].hasOwnProperty('footer'))
	{
		$("#footerBox").load("../sub_sections/" + g_objTabProperty[strTmpItemName]['footer'],
								function (response)
								{
									//inner call back
								} );
	}

}

function generate_skill_list_control_panel_labels()
{
	var strLang = $('html')[0].lang;

	for (var i = 0; i < g_lLabelCountSorted.length; i++)
	{
		var strGroup = g_objLabelProperty[g_lLabelCountSorted[i]]['group'];
		var strDisplay = g_objLabelProperty[g_lLabelCountSorted[i]][strLang];
		var strCount = g_mapLabelsCount[g_lLabelCountSorted[i]].toString();
		
		var strTmp = "<span class=\"label clickable " + strGroup + "\">&nbsp;" + strDisplay + " <small>(" + strCount + ")</small>" + "&nbsp;</span> ";
		

		//$(strDivId).innerHTML += strTmp;
		var domA = document.getElementById(strGroup);
		domA.innerHTML += strTmp;
	}
}

function control_panel_manipulaton(objAddition)
{
	if (objAddition['tab'] === 'skill_list' && g_bLabelsCountedSignal === true)
	{
		alert("do it");
		generate_skill_list_control_panel_labels();
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

function action_with_menu_data(jsonData, objAddition)
{
	var lMenuItems = jsonData;
	var strLang = $('html')[0].lang;
	var menuItemsList = document.getElementById("menuItemsList");

	for (var i = 0; i < lMenuItems.length; i++)
	{
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

function action_with_language_switch_data(jsonData, objAddition)
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

// happens only once per session
function count_label_appearance_times(lSkillListEntires)
{
	for (var i = 0; i < lSkillListEntires.length; i++)
	{
		if (lSkillListEntires[i]['labels'] !== undefined)
		{
			for (var j = 0; j < lSkillListEntires[i]['labels'].length; j++)
			{
				if (g_mapLabelsCount.hasOwnProperty(lSkillListEntires[i]['labels'][j]))
				{
					g_mapLabelsCount[lSkillListEntires[i]['labels'][j]] += 1;
				}
				else
				{
					g_mapLabelsCount[lSkillListEntires[i]['labels'][j]] = 1;
				}
			}
		} 
	}

	//console.log(g_mapLabelsCount);
	// sort the labels by appearance times, from more to less
	g_lLabelCountSorted = Object.keys(g_mapLabelsCount).sort(function(a,b){return g_mapLabelsCount[b]-g_mapLabelsCount[a]});
	g_bLabelsCountedSignal = true;
	generate_skill_list_control_panel_labels();
}

function action_with_table_content_data(jsonData, objAddition)
{
	var lDataEntries = jsonData;
	var strLang = $('html')[0].lang;
	var strContentPropertyName = 'content_' + strLang;

	if (objAddition['tab'] === const_strSkillList  && $.isEmptyObject(g_mapLabelsCount))
	{
		count_label_appearance_times(lDataEntries);
	}


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
					var strDisplay = g_objLabelProperty[aryStrLabels[j]][strLang];
					strTmp = "<span class=\"label " + strGroup + "\">&nbsp;" + strDisplay + "&nbsp;</span> ";
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
	fetch_data_and_action('../data/menu_items.json', action_with_menu_data, {});

	//display language switch
	fetch_data_and_action('../data/language_items.json', action_with_language_switch_data, {});

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

function init_global_variable(data, objAddition)
{
	if (objAddition['name'] === 'tab')
	{
		g_objTabProperty = data;
	}
	else if (objAddition['name'] === 'label')
	{
		g_objLabelProperty = data;
	}
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
	fetch_data_and_action('../data/global/tab_property.json', init_global_variable, {'name': 'tab'});
	fetch_data_and_action('../data/global/label_property.json', init_global_variable, {'name': 'label'});
	
	load_body_backbone_structure();
}
