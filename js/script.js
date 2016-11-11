
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    // use jquery to collect the street address and city that users type in
    // use the address and city to fill in the end of the url string that's being used to collect the image
    // then append the resulting image to the page inside an image tag with the class "bgimg"
    // and set the source to a string where the street address and city were collected from the form at the top
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    console.log (cityStr);
    //var wikipediaCityStr = cityStr.replace(" ", "_");
    //console.log(wikipediaCityStr);
    var address = streetStr + ', ' + cityStr;

    $greeting.text("So, Jackie wants to live at " + address + "?");   

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="bgimg" src=" ' + streetviewUrl + '">');

    // Your NYTimes AJAX request goes here
    var nytimesUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nytimesUrl += '?' + $.param({
    'api-key': "e6267c16637c4fdf89737ef1312b7ca4",
    'q': cityStr});
    console.log(nytimesUrl);

    $.ajax({
        url: nytimesUrl,
        method: 'GET',
    }).done(function(result) {
     console.log(result);
     $nytHeaderElem.text('New York Times Articles About ' + cityStr);
     articles = result.response.docs;
     for (var i = 0; i < articles.length; i++) {
        var article = articles[i];
        $nytElem.append('<li class="article">' + '<a href="'+article.web_url+'">' +article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
     }
    }).fail(function(err) {
        $nytElem.append("New York Times Articles Could Not Be Loaded");
    });

    var wikipediaUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +cityStr+ "&format=json&callback=wikiCallback";
    console.log(wikipediaUrl);

    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Failed to get Wikipedia resources.");
    }, 8000);

    $.ajax({
        url: wikipediaUrl,
        method: 'GET',
        dataType: "jsonp",
        // jsonp: "callback",
        success: function(response) {
            console.log(response);
            var articleList = response[1];
            var articleSummary = response[2];
            var articleUrl = response[3];

            for (var i = 0; i <articleList.length; i++) {
                articleStr = articleList[i];
                summaryStr = articleSummary[i];
                articleUrlStr = articleUrl[i];
                var url = "http://en.wikipedia.org/wiki" + articleStr;
                $wikiElem.append('<li><a href = "' + articleUrlStr + '">' + articleStr + '</a>' + "</br> " + summaryStr + '</li>');
            }
            //test

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
}

$('#form-container').submit(loadData);
