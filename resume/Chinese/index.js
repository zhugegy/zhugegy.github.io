var g_lBooks;  //full book list
var g_lnBookNum = [];  /* same size as g_lBooks, storing integers,
						  assisting the cart book number functionality */
var g_nCurrentDisplayedBookNum = 0;  //counts the number of displayed books in the table

function display_books(lToBeDisplayed, bIsSelected)
{
	var table = document.getElementById("bookList");

	// display info to indicate user's invalid input (bIsSelected == true && list length == 0)
	if (bIsSelected == true && lToBeDisplayed.length == 0)
	{
		var row = table.insertRow(-1);
		row.bgColor = "red";
		row.insertCell(0);row.insertCell(1);
		row.insertCell(2).innerHTML = "No search results!";
		row.insertCell(3);row.insertCell(4);row.insertCell(5);
		row.insertCell(6);row.insertCell(7);

		g_nCurrentDisplayedBookNum += 1;

		return
	}

	// display the books in the list
	for (var i = lToBeDisplayed.length - 1; i >= 0; i--)
	/* reason of revesed order of iteration:
	   due to the filter order in list_books() (first filter category, then filter key words),
	   we want to display the items of the most relevance (within the same category,
	   but unfortunately does not contain the search key words) as top as possible.
	*/
	{
		var row = table.insertRow(-1);

		// if this is a selected display, highlight the rows with a different background.
		if (bIsSelected)
		{
			row.bgColor = "yellow";
		}

		// diffreniate the checkbox-es with different id (using this book's title), but
		// within a same class for later referrence.
		var cellCheckBox = row.insertCell(0);
		cellCheckBox.innerHTML = "<input type=\"checkbox\" id=\"" +
		lToBeDisplayed[i].title +
		"\" class = \"cartChoice\">";

		var cellImg = row.insertCell(1);
		strTmpImg = "<img src=\"../" +
		lToBeDisplayed[i].img +
		"\"alt=\"Book Image\" width=\"80\" height=\"100\"/>";
		cellImg.innerHTML = strTmpImg;

		var cellTitle = row.insertCell(2);
		cellTitle.innerHTML = lToBeDisplayed[i].title;

		var cellAuthors = row.insertCell(3);
		cellAuthors.innerHTML = lToBeDisplayed[i].authors;

		var cellYear = row.insertCell(4);
		cellYear.innerHTML = lToBeDisplayed[i].year;

		var cellPrice = row.insertCell(5);
		cellPrice.innerHTML = lToBeDisplayed[i].price;

		var cellPulisher = row.insertCell(6);
		cellPulisher.innerHTML = lToBeDisplayed[i].publisher;

		var cellCategory = row.insertCell(7);
		cellCategory.innerHTML = lToBeDisplayed[i].category;
	}

	// update the current number of displayed books, for later referrence
	g_nCurrentDisplayedBookNum += lToBeDisplayed.length;
}

function clear_book_table()
{
	var table = document.getElementById("bookList");

	// delete current table content
	while (g_nCurrentDisplayedBookNum != 0)
	{
		table.deleteRow(-1);
		g_nCurrentDisplayedBookNum--;
	}
}

// AGGREGATE (search_key_word AND category)
function list_books(searchWord, filterWord)
{
	// get a clean table for further opeartion
	clear_book_table();

	// if this is a full display (happens when the page is initially loaded),
	// just display the full book list, do not bother selecting.
	var bFullDisplay = searchWord.length == 0 && (filterWord.length == 0 || filterWord.localeCompare("All") == 0);
	if (bFullDisplay == true)
	{
		display_books(g_lBooks, false)
		return
	}

	// begin to form two lists: one list contains the books that match user's search criteria,
	//                          the other list contains the rest books
	var lBooksMatch = [];
	var lBooksNotMatch = []

	// filter books based on category
	var lBooksMatch_Filter = [];

	if (filterWord.localeCompare("All") == 0 || filterWord.length ==0)
	{
		lBooksMatch_Filter = g_lBooks;
	}
	else
	{
		for (var i = 0; i < g_lBooks.length; i++)
		{
			// compare category
			if (g_lBooks[i].category.localeCompare(filterWord) == 0)
			{
				lBooksMatch_Filter.push(g_lBooks[i]);
			}
			else
			{
				lBooksNotMatch.push(g_lBooks[i]);
			}
		}
	}


	// question:
	// "The Search and Filter functions should work together and combine the result of each other."
	// -----------
	// COMBINE (a OR b) the two filters or AGGREGATE (a AND b) the idential results
	// of the two filters?
	// -----------
	// CURRENT IMPLEMENTATION: AGGREGATE (a AND b)

	// search books' title based on key words
	// use regex for better performance
	searchWord = searchWord.replace(/\s/ig, "[\\s\\S]*");
	searchWord = "[\\s\\S]*" + searchWord + "[\\s\\S]*";
	regExpTmp = new RegExp(searchWord, "i");
	for (var i = 0; i < lBooksMatch_Filter.length; i++)
	{
		if (lBooksMatch_Filter[i].title.search(regExpTmp) != -1)
		{
			lBooksMatch.push(lBooksMatch_Filter[i]);
		}
		else
		{
			lBooksNotMatch.push(lBooksMatch_Filter[i]);
		}
	}

	// First, display the selected books on the topmost rows.
	display_books(lBooksMatch, true)

	// Then, display the rest books.
	display_books(lBooksNotMatch, false)
}

// IMPLEMENTATION: COMBINE (search_key_word OR category)
function __list_books_v2(searchWord, filterWord)
{
	// get a clean table for further opeartion
	clear_book_table();

	// if this is a full display (happens when the page is initially loaded),
	// just display the full book list, do not bother selecting.
	var bFullDisplay = searchWord.length == 0 && (filterWord.length == 0 || filterWord.localeCompare("All") == 0);
	if (bFullDisplay == true)
	{
		display_books(g_lBooks, false)
		return
	}

	// begin to form two lists: one list contains the books that match user's search criteria,
	//                          the other list contains the rest books
	var lBooksMatch = [];
	var lBooksNotMatch = []

	// filter books based on category
	if (filterWord.localeCompare("All") == 0 || filterWord.length ==0)
	{
		lBooksMatch = g_lBooks;
	}
	else
	{
		for (var i = 0; i < g_lBooks.length; i++)
		{
			// compare category
			if (g_lBooks[i].category.localeCompare(filterWord) == 0)
			{
				lBooksMatch.push(g_lBooks[i]);
			}
			else
			{
				lBooksNotMatch.push(g_lBooks[i]);
			}
		}
	}


	// question:
	// "The Search and Filter functions should work together and combine the result of each other."
	// -----------
	// COMBINE (a OR b) the two filters or AGGREGATE (a AND b) the idential results
	// of the two filters?
	// -----------
	// CURRENT IMPLEMENTATION: COMBINE (a OR b)

	// search books' title based on key words
	// use regex for better performance
	var lBooksEventuallyNotMatch = []

	searchWord = searchWord.replace(/\s/ig, "[\\s\\S]*");
	searchWord = "[\\s\\S]*" + searchWord + "[\\s\\S]*";
	regExpTmp = new RegExp(searchWord, "i");
	for (var i = 0; i < lBooksNotMatch.length; i++)
	{
		if (lBooksNotMatch[i].title.search(regExpTmp) != -1)
		{
			lBooksMatch.push(lBooksNotMatch[i]);
		}
		else
		{
			lBooksEventuallyNotMatch.push(lBooksNotMatch[i]);
		}
	}

	// First, display the selected books on the topmost rows.
	display_books(lBooksMatch, true)

	// Then, display the rest books.
	display_books(lBooksEventuallyNotMatch, false)
}

function user_inits_search()
{
	var searchString = document.getElementById("searchStringContent").value;
	var filterString = document.getElementById("filterStringContent").value;

	list_books(searchString, filterString);
	//__list_books_v2(searchString, filterString);
}

function user_inits_add_to_cart()
{
	var nBookNumCounter = 0;
	var checkboxes = document.querySelectorAll(".cartChoice");

	for (var i = 0; i < checkboxes.length; i++)
	{
		if (checkboxes[i].checked == true)
		{
			strTitle = checkboxes[i].id;

			for (var j = 0; j < g_lBooks.length; j++)
			{
				if (g_lBooks[j].title.localeCompare(strTitle) == 0)
				{
					g_lnBookNum[j]++;
					nBookNumCounter++;
					break;
				}
			}
		}
	}

	if (nBookNumCounter == 1)
	{
		alert("Successfully added " + nBookNumCounter.toString(10) + " book to your cart.");
	}
	else if (nBookNumCounter != 0)
	{
		alert("Successfully added " + nBookNumCounter.toString(10) + " books to your cart.");
	}
	else
	{
		alert("No book is selected!");
	}

	display_cart_content_num();

}

function user_inits_reset_the_cart()
{
	var r = confirm("Reset the cart?");
	if (r == true)
	{
  		for (var i = 0; i < g_lBooks.length; i++)
		{
			g_lnBookNum[i] = 0;
		}

		display_cart_content_num();

		display_cart();
	}
}

function user_inits_cart()
{
	display_cart();
}

function display_cart()
{
	var strDisplay = "";

	for (var i = 0; i < g_lBooks.length; i++)
	{
		if (g_lnBookNum[i] != 0)
		{
			strDisplay += g_lBooks[i].title;
			strDisplay += "\r\n"
			strDisplay += "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t x";
			strDisplay += g_lnBookNum[i].toString(10);
			strDisplay += "\r\n"
			strDisplay += "\r\n"
		}
	}

	if (strDisplay.length == 0)
	{
		alert("The cart is empty.");
	}
	else
	{
		alert(strDisplay);
	}
}

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

function display_cart_content_num()
{
	var nCounter = 0;
	for (var i = 0; i < g_lnBookNum.length; i++)
	{
		nCounter += g_lnBookNum[i];
	}

	var num = document.getElementById("displayCartNum");
	num.innerHTML = "(" + nCounter.toString(10) + ")";
}

window.onload = function()
{
	// initialize the full book list via json reading and parsing
	var gjson = getJSON('https://api.myjson.com/bins/182vtq') ;
	//var gjson = getJSON('data.json') ;
	g_lBooks = JSON.parse(gjson);

	// initialize the array that stores the cart book number
	for (var i = 0; i < g_lBooks.length; i++)
	{
		g_lnBookNum[i] = 0;
	}

	// initialize and display current cart content number (to "(0)")
	display_cart_content_num()


	// display the full book list (no filter restriction is set)
	list_books("","")


	// set both "search" and "Filter" button to the same handler function
	document.getElementById("searchTitleButton").onclick = user_inits_search;
	document.getElementById("filterCategoryButton").onclick = user_inits_search;

	// set event function for "Add to cart" button
	document.getElementById("addToCartButton").onclick = user_inits_add_to_cart;

	// set event function for "Reset the cart" button
	document.getElementById("resetCartButton").onclick = user_inits_reset_the_cart;

	// set event function for "Cart" button
	document.getElementById("displayCartButton").onclick = user_inits_cart;

}
