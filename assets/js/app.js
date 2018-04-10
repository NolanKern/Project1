
$('.jumbotron').addClass('animated zoomIn');

var searchAPI = {
    resp: "",
    
    // Method that handles the call to the NASA api
    // Takes an argument for the year that the user would like to get results for
    // Calls the drawResults method once the object is returned from the api
    searchNasa: function(y) {
        // Sets the user selected year to the start and end year parameters for the api
        // This returns only images from that year
        var queryUrl = "https://images-api.nasa.gov/search?year_start=" + y + "&year_end=" + y;

        $.ajax({
          url: queryUrl,
          method: 'GET',
        }).then(function(response){
            // Calling the drawResults method to display the results onto the page
            searchAPI.drawResults(response);
        });
    },

    // Getter for the response object
    getResp: function() {
        return resp;
    },

    // Method for drawing the results to the screen
    drawResults: function(obj) {
        // Sets object key to response object
        // Pointed into the collection array of the object to make calls easier
        this.resp = obj.collection;

        // Pointer to the div that will hold the results
        var resultsDiv = $("#results");

        // For loop to iterate through the first 9 results
        for (var i = 0; i < 9; i++) {

            // If statement checks that each results has keywords
            if (this.resp.items[i].data[0].keywords !== undefined) {
                
                // Construction of the bootstrap Cards that will hold each result
                // Using jquery pointers
                var newCol = $("<div>");
                newCol.addClass("col-4");

                var cardDiv = $("<div>");
                cardDiv.addClass("card");

                // Image reference
                var imgDiv = $("<img>");
                imgDiv.attr("src", this.resp.items[i].links[0].href);
                imgDiv.addClass("card-img-top img-fluid");

                cardDiv.append(imgDiv);

                var bodyDiv = $("<div>");
                bodyDiv.addClass("card-body");

                // Image title
                var title = $("<h5>");
                title.text(this.resp.items[i].data[0].title);
                title.attr('class',"spaceSearch");
                bodyDiv.append(title);

                var newP = $("<p>");
                newP.addClass("card-text");

                // For loop to make each keyword into a separate link
                // Each link will have a class added to help style them
                for (var j = 0; j < this.resp.items[i].data[0].keywords.length; j++) {
                    var link = $("<span>");

                    link.attr("value", resp.items[i].data[0].keywords[j]);
                    link.attr('class',"spaceSearch");
                    link.attr('class', "hvr-underline-from-center");
                    link.text(resp.items[i].data[0].keywords[j]);

                    newP.append(link);
                    newP.append(" | ");
                }
                newP.attr("value",title);
                bodyDiv.append(newP);
                cardDiv.append(bodyDiv);
                newCol.append(cardDiv);
    
                resultsDiv.append(newCol);

                //Have cards "zoom in" as they appear on the screen
                $('.card').addClass('animated zoomIn');

            }
        }
    }
}

// Event listener waiting for the search button to be clicked
$(document).on("click", "#run-search", function() {
    event.preventDefault();
    
    var year = $("#year-input").val().trim();
    // Empties the results div
    $("#results").text("");
    // calls the search object with the users year
    searchAPI.searchNasa(year);
    

});

// This function is called as the user is inputting their year into the form
// It validates the year to be numbers, 4 digits long, and between 1920 and now
function yearValidation(year,ev) {

    var text = /^[0-9]+$/;
    if(ev.type=="blur" || year.length==4 && ev.keyCode!=8 && ev.keyCode!=46) {
      if (year != 0) {
          if ((year != "") && (!text.test(year))) {
  
              //alert("Please Enter Numeric Values Only");
              return false;
          }
  
          if (year.length != 4) {
              //alert("Year is not proper. Please check");
              return false;
          }
          var current_year=new Date().getFullYear();
          if((year < 1920) || (year > current_year))
              {
              //alert("Year should be in range 1920 to current year");
              return false;
              }
          return true;
      } }
  }

// when an underlined keyword is clicked initialize a function
  $(document).on("click",".hvr-underline-from-center", function() {
    //   displays the search result panel
    $(".container-fluid").show();
    // grabs the search term from what is clicked 
    var searchTerm = $(this).text();
    // emptys the text within the wikipedia search results
    $(".card-height").text("");
    // sets input to string and removes any parenthesis
    var string = searchTerm;
    var res = string.split("(");
    // if there is a parenthesis remove anything after (
    if(res.length>1){
        searchTerm= res[0];
        console.log(searchTerm);
    }
    // puts term into wikipedia search
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm +"&format=json&callback=?"; 
    // JSON call
    $.ajax({
        url: url,
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
      // plop data
        success: function(data, status, jqXHR) {
            console.log(data);
            $(".card-height").html();
            for(var i=0;i<data.length;i++){
                // if there is a page description and link for a wiki page then it will display the web pages that the search result returns
                if(data[3][i] && data[1][i] && data[2][i]){
                    $(".card-height").prepend("<div><div class='well'><a href="+data[3][i]+"><h2>" + data[1][i]+ "</h2>" + "<p>" + data[2][i] + "</p></a></div></div>");
                }
            }
        }
    })

});
// allows user to close the wikipedia search div
$(document).on("click", "#close",function(){
    $(".container-fluid").hide();
})