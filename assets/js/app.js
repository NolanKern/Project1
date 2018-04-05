var searchAPI = {
    results: 5,
    resp: "",

    searchNasa: function(y) {
        
        //var queryUrl = "https://images-api.nasa.gov/search?q=" + qy + "&year_start=" + y + "&year_end=" + y;
        var queryUrl = "https://images-api.nasa.gov/search?year_start=" + y + "&year_end=" + y;
        console.log(queryUrl);
        
        $.ajax({
          url: queryUrl,
          method: 'GET',
        }).then(function(response){
            console.log(response);
            
            searchAPI.drawResults(response);
        });
    },

    getResp: function() {
        return resp;
    },

    drawResults: function(obj) {
        resp = obj.collection;
        console.log(resp);

        var resultsDiv = $("#results");
        //resp.items.length
        for (var i = 0; i < 9; i++) {
            if (!(resp.items[i].data[0].keywords === undefined)) {
                
                var newCol = $("<div>");
                newCol.addClass("col-4");

                var cardDiv = $("<div>");
                cardDiv.addClass("card");

                var imgDiv = $("<img>");
                imgDiv.attr("src", resp.items[i].links[0].href);
                imgDiv.addClass("card-img-top img-fluid");

                cardDiv.append(imgDiv);

                var bodyDiv = $("<div>");
                bodyDiv.addClass("card-body");

                var title = $("<h5>");
                title.text(resp.items[i].data[0].title);
                bodyDiv.append(title);

                var newP = $("<p>");
                newP.addClass("card-text");

                for (var j = 0; j < resp.items[i].data[0].keywords.length; j++) {
                    var link = $("<a>");
                    link.attr("href", "");
                    link.text(resp.items[i].data[0].keywords[j]);
                    newP.append(link);
                    newP.append(" ");
                }

                bodyDiv.append(newP);
                cardDiv.append(bodyDiv);
                newCol.append(cardDiv);
    
                resultsDiv.append(newCol);
            }


        }


    }

}

$(document).on("click", "#run-search", function() {
    event.preventDefault();
    
    var year = $("#year-input").val().trim();
    
    searchAPI.searchNasa(year);
    

});

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
