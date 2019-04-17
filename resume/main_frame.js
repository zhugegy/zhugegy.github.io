var cons_strURLBase = "https://zhugegy.github.io/";
var cons_strURLCur = "resume/";

var g_curLang = "cn";

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
	strId = this.id;
	strTmpFileName = strId.slice("menu_item_".length) + "_tab_" + g_curLang;
	$("#contentBox").load(cons_strURLBase + cons_strURLCur + "tabs/" + strTmpFileName + ".html");
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

	//$("#contentBox").load("https://zhugegy.github.io/resume/template_test.html");
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
	display_menu_items()
	

	// display the full book list (no filter restriction is set)


	// set both "search" and "Filter" button to the same handler function
	//document.getElementById("searchTitleButton").onclick = user_inits_search;
	//document.getElementById("filterCategoryButton").onclick = user_inits_search;

	// set event function for "Add to cart" button
	//document.getElementById("addToCartButton").onclick = user_inits_add_to_cart;

	// set event function for "Reset the cart" button
	//document.getElementById("resetCartButton").onclick = user_inits_reset_the_cart;

	// set event function for "Cart" button
	//document.getElementById("displayCartButton").onclick = user_inits_cart;

}
