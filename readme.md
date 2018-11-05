# select2input
Modified Select2 based on text input rather than on select element

## Usage:

    $("#elementid").vojjinSelect({
        action: '',
        func: '',
        delayOnType: 600,
        preload: false,
        data: [],
        sort: 2,
        maxShowEmpty: 0,
        emptyResult: "No matches",
        showEmptyResult: true,
        hideEmptyResultAfter: 1500,
        maxToRetrieve: 0,
        tooManyResults: "Displaying first {1} items",
        showTooManyResult: true,
        hideTooManyResultAfter: 1500
    });
    
## Parameters:

action - php or any other script returning search results, default empty string

func - function for retrieving id or text, default empty string

delayOnType - ms delay to wait after keypress before performing search, defaulot 600ms

preload - if set to true, all items will be loaded into memory and there will be no more http requests, default false

data - if not empty array, action and preload are ignored and data are used to performe selection, default empty array

sort - sort by id (1) or text (2), ignored when data array is not empty, default 2

maxShowEmpty - maximum items to show when search string is empty, preload is false and data is empty (when using http request to get data). Usefull if result array is too big

emptyResult - text to display if there are no matches, default "No matches"

showEmptyResult - boolean, if set emptyResult will be displayed, default true

hideEmptyResultAfter - hide displayed emptyReult text after X milliseconds, 0 to disable hiding, default 1500 ms

maxToRetrieve - maximum items to retrieve if preload is false and data is empty (when using http request to get data). Usefull if result array is too big. 0 to show all results

tooManyResults - Text to display if list is shortened, default "Displaying first {1} items"

showTooManyResult - boolean, if set tooManyResults will be displayed, default true

hideTooManyResultAfter - hide displayed tooManyResults text after X milliseconds, 0 to disable hiding, default 1500 ms

## Forms:

if you need to use ID value, read "#elementid_vojjinsel_id" value. To use text value, just read original text input value.

## Javascript:

to get currently selected id: `let id = $("#elementid").vojjinSelect({func:"getid"}));`

to get currently selected text: `let text = $("#elementid").vojjinSelect({func:"gettext"}));`

## Events:

There is only one event, called 'myChange' when you select an item from the list

Example:

    $("#myInputText").on("myChange",function(){
        alert($(this).vojjinSelect({func:"getid"}));
    });
        
        
## Sample:

    $("#myInputText").vojjinSelect({
      action:'/include/someaction.php',
      sort:1,
      showTooManyResult:false
    });

## Data format:

Data should be array of value objects. Object should have parameters `id` which will be used for element id, `t` for display text. If you need extra text to be searched but not displayed, use `q` parameter which will be searched instead of `t` 

Example data format:

    [
      {id:1, t:"John Malkowich", q:"Johh Malkowich, movie Con Air"},
      {id:1, t:"Tina Turner", q:"Tina Turner, movie Mad Max III"},
      {id:1, t:"Nicolas Cage", q:"Nicolas Cage, movie Con Air"},
      {id:1, t:"Johny Depp", q:"Johny Depp, movie Chocolate"},
    ]  

When returning from php script, data should be json_encoded.

    return json_encode([
      ["id"=>1, "t"=>"John Malkowich", "q"=>"Johh Malkowich, movie Con Air"],
      ["id"=>1, "t"=>"Tina Turner", "q"=>"Tina Turner, movie Mad Max III"],
      ["id"=>1, "t"=>"Nicolas Cage", "q"=>"Nicolas Cage, movie Con Air"],
      ["id"=>1, "t"=>"Johny Depp", "q"=>"Johny Depp, movie Chocolate"],
    ]);  
