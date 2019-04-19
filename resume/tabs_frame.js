//var cons_strURLBase = "http://localhost:8000/";
//var cons_strURLCur = "resume/";

var g_curLang = "en";

// Due to diffculty in reading local jason files, the jason content is read via URL data transfer.
// source: https://stackoverflow.com/questions/19440589/parsing-json-data-from-a-url
function getJSON(url) {
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

function menuItems_listener()
{
	alert(this.id);
}

function display_menu_items()
{
	// get the menu items
	var jsonMenuItems = getJSON('https://api.myjson.com/bins/1f9ax4') ;
	//var json = jsonMenuItems('menu_items.json') ;
	lMenuItems = JSON.parse(jsonMenuItems);

	var menuItemsList = document.getElementById("menuItemsList");

	for (var i = 0; i < lMenuItems.length; i++)
	{
		strTmpLink = "<li class=\"menuItem\" id=\"" + lMenuItems[i].id + "\"><a href=\"#" + lMenuItems[i].name + "\">" + 
		"<img src=\"../images/menu/" + lMenuItems[i].name + "_" + g_curLang + "." + lMenuItems[i].image_format + "\" alt=\"" + lMenuItems[i].name + "\"></a></li>";

		//<li class="menuItem"><a href="#home">Home</a></li>
		//<img src="smiley.gif" alt="HTML tutorial" style="width:42px;height:42px;border:0;">

		menuItemsList.innerHTML += strTmpLink;
	}

	$("#contentBox").load("https://zhugegy.github.io/resume/template_test.html");
	//$("#testp").html("hello");
	//$("#contentBox").load(cons_strURLBase + cons_strURLCur + "template_test.html");

	// register the menu items to their corresponding tab model
	var menuItems = document.getElementsByClassName("menuItem");
	for (var i = 0; i < menuItems.length; i++)
	{
		menuItems[i].onclick = menuItems_listener;
	}

}

window.onload = function()
{
	g_curLang = $('html')[0].lang;
	//var cur = document.title;
	var divTable = document.getElementById("table_content_tobefilled");
	divTable.innerHTML += "<tr><td>mytest</td><td>load it</td></tr>";
}
