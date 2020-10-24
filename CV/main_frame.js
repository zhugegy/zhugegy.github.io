var const_strSkillList = 'skill_list';
var const_data_API = 'https://api.github.com/repos/zhugegy/zhugegy.github.io/commits/master';

var g_mapLabelSelected = {};

var g_mapLabelsCount = {};
var g_bLabelsCountedSignal = false;

var g_mapLabelsWeight = {};
var g_lLabelWeightSorted = [];

var g_objTabProperty = {};
var g_objLabelProperty = {};

var g_strLastCommitDate = '2020-07-08';

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

function fetch_data_API_and_render(strDataLink, funRender)
{
	var jsonRawData = getJSON(strDataLink) ;
	var data = JSON.parse(jsonRawData);
	funRender(data);
}

function fetch_data_and_action(strDataLink, funRender, objAddition)
{
	$.getJSON(strDataLink, function(data) {funRender(data, objAddition);} );
}

function clickable_labels_listener()
{
	if (g_mapLabelSelected[this.id] === false)
	{
		g_mapLabelSelected[this.id] = true;
	}
	else
	{
		g_mapLabelSelected[this.id] = false;
	}

	this.classList.toggle("label-selected");
}

function menuItems_listener()
{
	strId = this.id;
	strTmpItemName = strId.slice("menu_item_".length);

	if (strTmpItemName === "skill_list" && window.screen.availWidth < 750)
	{
		alert("Sorry! This page is not available on mobile devices yet.")
		return;
	}

	if (strTmpItemName === "skill_list")
	{
		// When the user scrolls down 20px from the top of the document, show the button
		window.onscroll = function() {scrollFunction()};
	}
	else
	{
		window.onscroll = null;
	}

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
		$("#controlPanelBox").css("display", "block");
		$("#controlPanelBox").load("../sub_sections/" + g_objTabProperty[strTmpItemName]['control_panel'],
								function (response)
								{
									control_panel_manipulaton({'tab': strTmpItemName});
								} );
	}
	else
	{
		$("#controlPanelBox").css("display", "none");
	}

	// Load the content of the footerBox section.
	$("#footerBox").empty();
	if (g_objTabProperty[strTmpItemName].hasOwnProperty('footer'))
	{
		$("#footerBox").load("../sub_sections/" + g_objTabProperty[strTmpItemName]['footer'],
								function (response)
								{
									//inner call back
									$("#footer_last_commit_time").html(g_strLastCommitDate);
									$("#footer_last_commit_time_year").html(g_strLastCommitDate.substring(0,4));
								} );
	}

}

function skill_list_refresh()
{
	$("#infoTableBox").empty();
	$("#infoTableBox").load("../sub_sections/info_table.html",
								function (response)
								{
									fetch_data_and_action('../data/table_contents/skill_list.json', action_with_table_content_data, {'tab': 'skill_list'});
								} );
}

function skill_list_reset()
{
	for (let key in g_mapLabelSelected)
	{
		g_mapLabelSelected[key] = false;
	}

	
	$('#controlPanelBox .label').removeClass("label-selected");
}

function generate_skill_list_control_panel_labels()
{
	var strLang = $('html')[0].lang;

	for (var i = 0; i < g_lLabelWeightSorted.length; i++)
	{
		var strGroup = g_objLabelProperty[g_lLabelWeightSorted[i]]['group'];
		var strDisplay = g_objLabelProperty[g_lLabelWeightSorted[i]][strLang];
		var strCount = g_mapLabelsCount[g_lLabelWeightSorted[i]].toString();
		var strClassSelected = "";
		if (g_mapLabelSelected[g_lLabelWeightSorted[i]] === true)
		{
			strClassSelected = "label-selected ";
		}

		var strTmp = "<span class=\"label clickable " + strClassSelected + strGroup + "\" id=\"" + g_lLabelWeightSorted[i] + "\">&nbsp;" + strDisplay + " <small>(" + strCount + ")</small>" + "&nbsp;</span> ";
		
		document.getElementById(strGroup).innerHTML += strTmp;
	}

	var domClickableLabels = document.getElementsByClassName("label clickable");
	for (var i = 0; i < domClickableLabels.length; i++)
	{
		domClickableLabels[i].onclick = clickable_labels_listener;
	}
}

function control_panel_manipulaton(objAddition)
{
	if (objAddition['tab'] === 'skill_list' && g_bLabelsCountedSignal === true)
	{
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
		if (lMenuItems[i].isDisplayed === true)
		{
			strTmpLink = "<li class=\"menuItem\" id=\"" + lMenuItems[i].id + "\"><a href=\"#" + lMenuItems[i].name + "\">" + 
			"<img src=\"../images/menu/" + lMenuItems[i].name + "_" + strLang + "." + lMenuItems[i].image_format + "\" alt=\"" + lMenuItems[i].name + "\"></a></li>";

			menuItemsList.innerHTML += strTmpLink;
		}
	}

	// register the menu items for user interactions later on
	var menuItems = document.getElementsByClassName("menuItem");
	for (var i = 0; i < menuItems.length; i++)
	{
		menuItems[i].onclick = menuItems_listener;
	}

	document.getElementById('menu_item_basic_information').click();
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
function initialization_count_label_appearance_times(lSkillListEntires)
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
					g_mapLabelSelected[lSkillListEntires[i]['labels'][j]] = false;
				}
			}
		} 
	}

	// select "featured" label as default in session beginning
	g_mapLabelSelected["label-id-Featured"] = true;
	 
	var lLabelWeightUnsorted = Object.keys(g_mapLabelsCount);
	for (var i = 0; i < lLabelWeightUnsorted.length; i++)
	{
		g_mapLabelsWeight[lLabelWeightUnsorted[i]] = cal_label_weight(lLabelWeightUnsorted[i]);
	}

	// sort the labels by ~appearance times~ weights, from ~more to less~ big to small
	g_lLabelWeightSorted = Object.keys(g_mapLabelsWeight).sort(function(a,b){return g_mapLabelsWeight[b] - g_mapLabelsWeight[a]});
	
	g_bLabelsCountedSignal = true;
	generate_skill_list_control_panel_labels();
}

function get_matched_label(objEntry)
{
	var lStrMatchedLabelID = [];
	for (var i = 0; i < objEntry['labels'].length; i++)
	{
		if (g_mapLabelSelected[objEntry['labels'][i]] === true)
		{
			lStrMatchedLabelID.push(objEntry['labels'][i]);
		}
	}
	
	return lStrMatchedLabelID;
}

function cal_label_total_weight(lLabels)
{
	nWeight = 0;
	for (var i = 0; i < lLabels.length; i++)
	{
		nWeight += g_mapLabelsWeight[lLabels[i]];
	}

	return nWeight;
}

function is_entry_a_above_entry_b(objEntryA, objEntryB)
{
	var nTrue = -1;
	var nFalse = 1;

	// check 1: the number of matched labels
	var lStrMatchedLabelsA = get_matched_label(objEntryA);
	var lStrMatchedLabelsB = get_matched_label(objEntryB);
	if (lStrMatchedLabelsA.length > lStrMatchedLabelsB.length)
	{
		return nTrue;
	}
	else if (lStrMatchedLabelsA.length < lStrMatchedLabelsB.length)
	{
		return nFalse;
	}

	// check 2: the total weight of matched labels
	var nTotalWeightA = cal_label_total_weight(lStrMatchedLabelsA);
	var nTotalWeightB = cal_label_total_weight(lStrMatchedLabelsB);
	if (nTotalWeightA > nTotalWeightB)
	{
		return nTrue;
	}
	else if (nTotalWeightA < nTotalWeightB)
	{
		return nFalse;
	}

	// check 3: time - latest entry will be above
	if (objEntryA['timestamp'] > objEntryB['timestamp'])
	{
		return nTrue;
	}
	else if (objEntryA['timestamp'] < objEntryB['timestamp'])
	{
		return nFalse;
	}

	return nFalse;
}

function action_with_table_content_data(jsonData, objAddition)
{
	var lDataEntries = jsonData;
	var strLang = $('html')[0].lang;
	var strContentPropertyName = 'content_' + strLang;

	if (objAddition['tab'] === const_strSkillList  && $.isEmptyObject(g_mapLabelsCount))
	{
		initialization_count_label_appearance_times(lDataEntries);
	}

	if (objAddition['tab'] === const_strSkillList)
	{
		objFirstItem = lDataEntries.shift();
		lDataEntries.sort(function(a, b){return is_entry_a_above_entry_b(a, b)});
		lDataEntries.unshift(objFirstItem);
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
				var aryStrLabels = entry_label_sorting(lDataEntries[i]['labels']);
				for (var j = 0; j < aryStrLabels.length; j++)
				{
					var strGroup = g_objLabelProperty[aryStrLabels[j]]['group'];
					var strDisplay = g_objLabelProperty[aryStrLabels[j]][strLang];
					var strClassSelected = "";
					if (g_mapLabelSelected[aryStrLabels[j]] === true)
					{
						strClassSelected = "label-selected ";
					}
					strTmp = "<span class=\"label " + strClassSelected + strGroup + "\">&nbsp;" + strDisplay + "&nbsp;</span> ";
					strLabelList += strTmp;
				}

				var strTargetDivName = lDataEntries[i]['entry-id'] + "-label";
				document.getElementById(strTargetDivName).innerHTML = strLabelList;
			}
		}
	}

	clickable_tr_post_amendation();
}

function cal_label_weight(strLabelID)
{
	var nPoints = 0;
	strGroup = g_objLabelProperty[strLabelID]['group'];

	switch (strGroup) {
		case "label-entry-type":
			nPoints += 14000000;
			break;
		case "label-feature":
			nPoints += 12000000;
			break;
		case "label-programming-language":
			nPoints += 10000000;
			break;
		case "label-technology-framework":
			nPoints += 8000000;
			break;
		case "label-platform":
			nPoints += 6000000;
			break;
		default:
			break;
	}

	nPoints += g_mapLabelsCount[strLabelID] * 32;
	nPoints += g_objLabelProperty[strLabelID]['same-level-adjustment-weight'];

	return nPoints;
}

function entry_label_sorting(lLabels)
{
	/* To optimize the performance, the following line can be skipped, 
	   resulting in each individual entry's minor label misorders that are merely noticeable. */
	lLabels.sort(function(a, b){return g_mapLabelsWeight[b] - g_mapLabelsWeight[a]});
	
	var lLabelsSelected = [];
	var lLabelsNotSelected = [];
	
	for (var i = 0; i < lLabels.length; i++)
	{
		if (g_mapLabelSelected[lLabels[i]] === true)
		{
			lLabelsSelected.push(lLabels[i]);
		}
		else
		{
			lLabelsNotSelected.push(lLabels[i]);
		}
	}

	return lLabelsSelected.concat(lLabelsNotSelected);
}

function load_body_content()
{
	//display menu
	fetch_data_and_action('../data/menu_items.json', action_with_menu_data, {});

	//display language switch
	fetch_data_and_action('../data/language_items.json', action_with_language_switch_data, {});

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

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
	  document.getElementById("back_to_top_btn").style.display = "block";
	} else {
	  document.getElementById("back_to_top_btn").style.display = "none";
	}
  }
  
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
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

function get_last_commit_time(data)
{
	console.log('call to GitHub API');
	var strDate = data['commit']['author']['date'];

	// Unauthorized call to GitHub API is limited to maximum 60 times per hour per IP address.
	/* For calls exceeding 60 times in that one hour, server will return error message json:
	    {
		  "message": "API rate limit exceeded for xxx.xxx.xxx.xxx. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)",
		  "documentation_url": "https://developer.github.com/v3/#rate-limiting"
		}
       Source: https://developer.github.com/v3/#rate-limiting
	*/
	if (strDate !== undefined)
	{
		g_strLastCommitDate = strDate.substring(0,10);
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

// entry point
window.onload = function()
{
	//initilize the global variables
	fetch_data_API_and_render(const_data_API, get_last_commit_time)
	fetch_data_and_action('../data/global/tab_property.json', init_global_variable, {'name': 'tab'});
	fetch_data_and_action('../data/global/label_property.json', init_global_variable, {'name': 'label'});
	
	load_body_backbone_structure();
}
