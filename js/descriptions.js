function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }
  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  //TODO: Filter to just the written tweets
  tweet_written = tweet_array.filter((tweet) => tweet.written);
  console.log(tweet_written.length); 
  addEventHandlerForSearch(tweet_written);
}

function searchHandler(tweet_written, key) {
  console.log(key, "s"); 
  
  $("#tweetTable tr").remove();

  if (key.trim().length === 0){
    $("#tweetTable tr").remove();
    return; 
  }

  // const key = $("#textFilter").val();
  let tweet_count = 0;
  tweet_written.forEach((tweet) => {
    if (tweet.text.includes(key)) {
      tweet_count += 1;
      $("#tweetTable").append(tweet.getHTMLTableRow.bind(tweet, tweet_count));
    }
  });

  $("#searchCount").text(tweet_count.toString());
  $("#searchText").text(key);
}

function addEventHandlerForSearch(tweet_written) {
  //TODO: Search the written tweets as text is entered into the search box, and add them to the table
  // $("#textFilter").keyup(searchHandler.bind(null, tweet_written));
  var timer;
  $("#textFilter").keyup(function () {
    clearTimeout(timer);
    const ms = 100;
    const key = $("#textFilter").val();
    timer = setTimeout(searchHandler.bind(null, tweet_written, key), ms);
  });
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
