//Jumbotron Header "zooms in" as page is loaded
$('.jumbotron').addClass('animated zoomIn');

var searchAPI = {
    results: 5,
    resp: "",

    searchNasa: function(y) {
        
        var queryUrl = "https://images-api.nasa.gov/search?year_start=" + y + "&year_end=" + y;
        console.log(queryUrl);
        
        $.ajax({
          url: queryUrl,
          method: 'GET',
        }).then(function(response){ 
            searchAPI.drawResults(response);
        });
    },

    getResp: function() {
        return resp;
    },

    drawResults: function(obj) {
        resp = obj.collection;
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
                title.attr('class',"spaceSearch");
                bodyDiv.append(title);

                var newP = $("<p>");
                newP.addClass("card-text");

                for (var j = 0; j < resp.items[i].data[0].keywords.length; j++) {
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

$(document).on("click", "#run-search", function() {
    event.preventDefault();
    
    var year = $("#year-input").val().trim();
    $("#results").text("");
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


  $(document).on("click",".hvr-underline-from-center", function() {
    $(".container-fluid").show();
    var searchTerm = $(this).text();
    $(".card-height").text("");
    var string = searchTerm;
    var res = string.split("(");
    if(res.length>1){
        searchTerm= res[0];
        console.log(searchTerm);
    }
    var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm +"&format=json&callback=?"; 
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
                if(data[3][i] && data[1][i] && data[2][i]){
                    $(".card-height").prepend("<div><div class='well'><a href="+data[3][i]+"><h2>" + data[1][i]+ "</h2>" + "<p>" + data[2][i] + "</p></a></div></div>");
                }
            }
        }
    })

});

$(document).on("click", "#close",function(){
    $(".container-fluid").hide();
})