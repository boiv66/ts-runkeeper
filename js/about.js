function displayEarliestAndLatestDate(tweet_array) {
  orderedDates = tweet_array
    .map((a) => a.time)
    .sort(function (a, b) {
      return Date.parse(b) - Date.parse(a);
    });
  // $(document).ready(function()
  // 	{$("#lastDate").text(orderedDates[0].toDateString());}
  // )

  $("#lastDate").text(orderedDates[0].toDateString());
  $("#firstDate").text(orderedDates[orderedDates.length - 1].toDateString());
}

function percentageOf(event, totalEvent) {
  return ((event / totalEvent) * 100).toFixed(2).toString() + "%";
}

function displayWrittenText(tweet_array) {
  let writtenText = 0;
  tweet_array.forEach((tweet) => {
    if (tweet.written) {
      writtenText += 1;
    }
  });

  $(".written").text(writtenText.toString());
  $(".writtenPct").text(percentageOf(writtenText, countEvent(tweet_array)["completed_event"]));
}
function countEvent(tweet_array) {
  event_count = {
    live_event: 0,
    achievement: 0,
    completed_event: 0,
    miscellaneous: 0,
  };
  tweet_array.forEach((tweet) => {
    if (tweet.source === "completed_event") {
   
      event_count["completed_event"] += 1;
    } else if (tweet.source === "achievement") {
      event_count["achievement"] += 1;
    } else if (tweet.source === "live_event") {
      event_count["live_event"] += 1;
    } else {
      event_count["miscellaneous"] += 1;
    }
  });

  return event_count;
}
function displayEventPercentage(tweet_array) {
  const event_count = countEvent(tweet_array);

  $(".completedEvents").text(event_count["completed_event"].toString());
  $(".completedEventsPct").text(
    percentageOf(event_count["completed_event"], tweet_array.length)
  );

  $(".liveEvents").text(event_count["live_event"].toString());
  $(".liveEventsPct").text(
    percentageOf(event_count["live_event"], tweet_array.length)
  );

  $(".achievements").text(event_count["achievement"].toString());
  $(".achievementsPct").text(
    percentageOf(event_count["achievement"], tweet_array.length)
  );

  $(".miscellaneous").text(event_count["miscellaneous"].toString());
  $(".miscellaneousPct").text(
    percentageOf(event_count["miscellaneous"], tweet_array.length)
  );
}

function parseTweets(runkeeper_tweets) {
  //Do not proceed if no tweets loaded
  if (runkeeper_tweets === undefined) {
    window.alert("No tweets returned");
    return;
  }

  tweet_array = runkeeper_tweets.map(function (tweet) {
    return new Tweet(tweet.text, tweet.created_at);
  });

  //This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
  //It works correctly, your task is to update the text of the other tags in the HTML file!
  document.getElementById("numberTweets").innerText = tweet_array.length;

  displayEarliestAndLatestDate(tweet_array);
  displayEventPercentage(tweet_array);
  displayWrittenText(tweet_array);

  tweet_array.forEach((tweet) => {tweet.activityType})

//   console.log(tweet_array[1].text.split(" https")[0]);
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
