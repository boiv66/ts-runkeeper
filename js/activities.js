var tweetArray = null;
var mostAct = null;

function toggleButton(btn) {

  if (btn.text() == "Show means") {
    $("#distanceVis").hide();
    $("#distanceVisAggregated").show();

    btn.text("Show all activities");
  } else {
    $("#distanceVisAggregated").hide();
    $("#distanceVis").show();

    btn.text("Show means");
  }
}

function visualAverageDistanceGraph() {
  const graphData = findWeekendOrWeekdayLonger(tweetArray, mostAct);
  avg_distance_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the number of Tweets containing each type of activity.",
    data: {
      // "values": [{day: "monday", distance: "20", "type":"bike"}, {day: "monday", "distance": 10, "type": "run"} ]
      // },
      values: graphData,
    },
    //TODO: Add mark and encoding
    mark: "point",
    height: 200 , 
    width: 200, 


    encoding: {
      x: {
        field: "time(day)",
        type: "nominal",
        axis: { labelAngle: 0 },
        sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        // scale: { zero: false },
      },
      y: {
        aggregate: "mean",
        field: "distance",
        type: "quantitative",
        // scale: { zero: false },
      },
      color: { field: "type", type: "nominal" },
    },
  };
  vegaEmbed("#distanceVisAggregated", avg_distance_vis_spec, {
    actions: false,
  });
}

function visualDistanceGraph() {
  const graphData = findWeekendOrWeekdayLonger(tweetArray, mostAct);
  distance_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the number of Tweets containing each type of activity.",
    data: {
      // "values": [{day: "monday", distance: "20", "type":"bike"}, {day: "monday", "distance": 10, "type": "run"} ]
      // },
      values: graphData,
    },
    //TODO: Add mark and encoding
    mark: "point",
    height: 200 , 
    width: 200, 

    encoding: {
      x: {
        field: "time(day)",
        type: "nominal",
        axis: { labelAngle: 0 },
        sort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        // scale: { zero: false },
      },
      y: {
        field: "distance",
        type: "quantitative",
        // scale: { zero: false },
      },
      color: { field: "type", type: "nominal" },
    },
  };
  vegaEmbed("#distanceVis", distance_vis_spec, { actions: false });
}
function displayDistanceStat() {
  $("#aggregate").css("display", "block"); 
  $("#aggregate").css("margin-bottom", "15px"); 

  toggleButton($("#aggregate"));
  visualAverageDistanceGraph();
  visualDistanceGraph();
}

function sortActivity(activityCount) {
  let sortAct = Object.keys(activityCount).map((activity) => [
    activity,
    activityCount[activity],
  ]);
  sortAct.sort(function (act1, act2) {
    return act1[1] - act2[1];
  });
  //   console.log(sortAct);
  return sortAct;
}


function activity_count(tweet_array) {
  const activityCount = {};

  tweet_array.forEach((tweet) => {
    if (tweet.activityType === "unknown") {
      return;
    } else {
      const activityType = tweet.activityType.toLowerCase().trim();
      if (activityType in activityCount) {
        activityCount[activityType] += 1;
      } else {
        activityCount[activityType] = 1;
      }
    }
  });
  return activityCount;
}

function displayMostActivities(tweet_array) {
  const activityCount = activity_count(tweet_array);



  const top3Act = sortActivity(activityCount).slice(-3);
  $("#firstMost").text(top3Act[2][0].toString());
  $("#secondMost").text(top3Act[1][0].toString());
  $("#thirdMost").text(top3Act[0][0].toString());
  return top3Act;
}

function findDay(day) {
  if (day === 0) {
    return "Sun";
  } else if (day === 1) {
    return "Mon";
  } else if (day === 2) {
    return "Tue";
  } else if (day === 3) {
    return "Wed";
  } else if (day === 4) {
    return "Thu";
  } else if (day === 5) {
    return "Fri";
  } else {
    return "Sat";
  }
}

function findWeekendOrWeekdayLonger(tweet_array, highestAct) {
  const graphDistanceData = [];
  tweet_array.forEach((tweet) => {
    const activityType = tweet.activityType.toLowerCase().trim();
    if (activityType === "unknown" || !highestAct.includes(activityType)) {
      return;
    } else {
      object = {};
      object["type"] = activityType;
      object["time(day)"] = findDay(tweet.time.getDay());
      object["distance"] = tweet.distance;
      graphDistanceData.push(object);
    }
  });
  return graphDistanceData;
}

function dataGeneralize(activityCount, xAxis, yAxis) {
  graphArray = [];
  for (const key in activityCount) {
    const obj = {};
    obj[xAxis] = key;
    obj[yAxis] = activityCount[key];
    graphArray.push(obj);
  }

  return graphArray;
}

function graphFrequentActivity(tweet_array) {
  //TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
  const activityCount = activity_count(tweet_array);
  graphData = dataGeneralize(activityCount, "activity", "frequence");
  activity_vis_spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description:
      "A graph of the number of Tweets containing each type of activity.",
    data: {
      values: graphData,
    },
    //TODO: Add mark and encoding
    mark: "point",

    encoding: {
      x: { field: "activity", type: "nominal", axis: { labelAngle: 270 }, sort:"-y"},
      y: { field: "frequence", type: "quantitative", scale: { type: 'log' }}
    // "color": {"field": "Species", "type": "nominal"},
    // "shape": {"field": "Species", "type": "nominal"}
  }}; 
  vegaEmbed("#activityVis", activity_vis_spec, { actions: false });
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
  $("#numberActivities").text(tweet_array.length);
  tweetArray = tweet_array;

  const top3Act = displayMostActivities(tweet_array);
  mostAct = top3Act.map((a) => a[0]);



  $("#longestActivityType").text("run");
  $("#shortestActivityType").text("walk");
  $("#weekdayOrWeekendLonger").text("weekend");


  graphFrequentActivity(tweet_array);

  //TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
  //Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
