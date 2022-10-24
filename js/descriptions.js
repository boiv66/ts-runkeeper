var tweet_written = null;

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
}

function searchHandler() {
  const key = $("#textFilter").val();
  console.log(key, "s");
  $("#tweetTable tr").remove();

  if (key.trim().length === 0) {
    $("#tweetTable tr").remove();
    $("#searchCount").text("0");
    $("#searchText").text(key);

    return;
  }

  // const key = $("#textFilter").val();
  let tweet_count = 0;
  tweet_written.forEach((tweet) => {
    if (tweet.text.includes(key)) {
      console.log(1)
      tweet_count += 1;
      // const sentimentVal = sentiment(tweet);
      const sentimentVal = '';
      $("#tweetTable").append(tweet.getHTMLTableRow.bind(tweet, tweet_count, sentimentVal));
    }
  });

  $("#searchCount").text(tweet_count.toString());
  $("#searchText").text(key);
}

function addEventHandlerForSearch() {
  //TODO: Search the written tweets as text is entered into the search box, and add them to the table
  $("#textFilter").keyup(searchHandler);
  // var timer;
  // $("#textFilter").keyup(function () {
  //   clearTimeout(timer);
  //   const ms = 100;
  //   const key = $("#textFilter").val();
  //   timer = setTimeout(searchHandler.bind(null, tweet_written, key), ms);
  // });
}

function experssion(tweet) {
  const pattern = /!/g;
  if (tweet.writtenText.match(pattern) != null) {
    return tweet.writtenText.match(pattern).length;
  }
  return 0;
}

function pointEvaluate(index, word) {
  let sentimentValue = 0;
  sentimentArray[index].forEach((sentiment) => {
    const key = Object.keys(sentiment)[0];
    if (word.includes(key)) {
      sentimentValue = sentiment[key];
    }
  });

  return sentimentValue;
}

// function getHashhKey(first_letter) {
//   return (first_letter.charCodeAt(0) - 97) % 26;
// }


function sentiment(tweet) {
  let sentiment = experssion(tweet);
  const wordArray = tweet.writtenText.split(" ");
  let count = 0; 
  wordArray.forEach((word) => {
    if (word.length === 0){
      return; 
    }
    console.log(word)
    const index = getHashKey(word[0].toLowerCase());
    const point = pointEvaluate(index, word);
    if (point === 0){
      return; 
    }
    if (
      wordArray.includes("not") &&
      wordArray.indexOf("not") < wordArray.indexOf(word) && count != 1
    ) {
      sentiment += -point;
      count = 1; 
    } else if (
      wordArray.includes("but") &&
      wordArray.indexOf("but") > wordArray.indexOf(word) && count != 1
    ) {
      sentiment += -point;
      count = 1; 
    }  else {
      sentiment += point;
    }
  });
  if (
    wordArray.includes("too") ||
    wordArray.includes("pretty") ||
    wordArray.includes("very")
  ) {
    sentiment +=  1;
  }
  console.log(sentiment, tweet); 
  return sentiment;
}



//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  addEventHandlerForSearch();
  loadSavedRunkeeperTweets().then(parseTweets);
  const sentimentArray = getSetiment();

});
