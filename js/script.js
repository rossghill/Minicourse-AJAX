
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
    var $street = $('#street').val();
    var $city = $('#city').val();
    var img_url = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + $street + ", " + $city
    var fixed_url = img_url.replace(/\ /g, '%20')
    $body.append('<img class="bgimg" src="' + fixed_url + '">');

    // NYT
    var $nyt_list = $("#nytimes-articles");
    var nyt_url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    nyt_url += '?' + $.param({
        'api-key': "032aebc04bc840608af4bf041209ce50",
        'q': $city
    });
    $.getJSON(nyt_url, function(data) {
        $nytHeaderElem.text('New York Times articles about ' + $city);
        var articles = data.response.docs;
        $.each(articles, function(article) {
            $nyt_list.append('<li class="article"><a href=' + articles[article].web_url + '>' + articles[article].snippet + '</a></li>');
            })
        }).fail(function (e) {
            $nytHeaderElem.text('Sorry, articles could not be loaded'); 
        });

    // Wikipedia
    var $wiki_list = $("#wikipedia-links");    
    var wiki_url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="
    var fixed_wiki_url = wiki_url + $city.replace(/\ /g, '%20')
    $.ajax({
        url: fixed_wiki_url,
        dataType: "jsonp",
        success: function(response) {
            var wiki_articles = response[1];
            var wiki_links = response[3];
            $.each(wiki_articles, function(article) {
                $wiki_list.append('<li class="article"><a href=' + wiki_links[article] + '>' + wiki_articles[article] + '</a></li>');
            })
        }
    }); 
    return false;
};

$('#form-container').submit(loadData);