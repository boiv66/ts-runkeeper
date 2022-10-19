

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

function countDurationType(tweet_array){
	const durationType = []; 
	tweet_array.forEach((tweet) => {
		if (tweet.activityType === "unknown") {
			return;
		}
		else{
			if (tweet.distance == -1){
				if (!durationType.includes(tweet.activityType))
				durationType.push(tweet.activityType); 
			}
		}

	})
	console.log(durationType); 
	return durationType; 
}

function activity_count(tweet_array){
	const activityCount = {};
	const durationType = countDurationType(tweet_array); 
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
  

  console.log(activityCount)

  const top3Act = sortActivity(activityCount).slice(-3);
  $("#firstMost").text(top3Act[2][0].toString());
  $("#secondMost").text(top3Act[1][0].toString());
  $("#thirdMost").text(top3Act[0][0].toString());
  return top3Act;
}

function findWeekendOrWeekdayLonger(tweet_array, longestAct) {
  const weekRate = { weekend: 0, weekday: 0 };
  tweet_array.forEach((tweet) => {
    const activityType = tweet.activityType.toLowerCase().trim();
    if (activityType === "unknown" || longestAct[0] != activityType) {
      return;
    } else {
      // console.log(activityType);
      if (tweet.time.getDay() == 0 || tweet.time.getDay() == 6) {
        weekRate["weekend"] += tweet.distance / longestAct[1];
      } else {
        weekRate["weekday"] += tweet.distance / longestAct[1];
      }
    }
  });

  const sortWeek = sortActivity(weekRate);
  $("#weekdayOrWeekendLonger").text(sortWeek[1][0].toString());
}

function displayDistanceState(tweet_array, top3Act) {
  const totalDistance = {};
  const averageDistance = {};
  const highestAct = top3Act.map((a) => a[0]);

  tweet_array.forEach((tweet) => {
    const activityType = tweet.activityType.toLowerCase().trim();

    if (activityType === "unknown" || !highestAct.includes(activityType)) {
      // console.log(activityType);
      return;
    } else {
      // console.log(tweet.distance, activityType);
      tweet.distance;
      if (activityType in totalDistance) {
        totalDistance[activityType] += tweet.distance;
      } else {
        // console.log(totalDistance, activityType);
        totalDistance[activityType] = tweet.distance;
      }
    }
  });
  //   console.log(top3Act);
  for (let i = 0; i < top3Act.length; i++) {
    averageDistance[top3Act[i][0]] =
      totalDistance[top3Act[i][0]] / top3Act[i][1];
  }

  const sortAct = sortActivity(averageDistance);
  $("#longestActivityType").text(sortAct[2][0].toString());
  $("#shortestActivityType").text(sortAct[0][0].toString());

  findWeekendOrWeekdayLonger(tweet_array, sortAct[2]);
}

function dataGeneralize(activityCount, xAxis, yAxis){
	graphArray = []; 
	for (const key in activityCount){
		const obj = {}; 
		obj[xAxis] = key; 
		obj[yAxis] = activityCount[key]; 
		graphArray.push(obj); 
	}
	console.log(graphArray); 
	return(graphArray); 

}

function graphFrequentActivity(tweet_array){
//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
const activityCount = activity_count(tweet_array); 
graphData = dataGeneralize(activityCount, "activity", "frequence" ); 
activity_vis_spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "A graph of the number of Tweets containing each type of activity.",
    "data": {
		"values": graphData, 
    },
	//TODO: Add mark and encoding
	"mark": "point",
	"width": 1200, 
	"height": 300, 
	"encoding": {
	  "x": {"field": "activity", "type": "nominal", "axis": {"labelAngle": 0}},
	  "y": {"field": "frequence", "type": "quantitative"}
	}
		// "color": {"field": "Species", "type": "nominal"},
		// "shape": {"field": "Species", "type": "nominal"}
	  
    
  };
  vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
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

  const top3Act = displayMostActivities(tweet_array);

  displayDistanceState(tweet_array, top3Act);

  graphFrequentActivity(tweet_array); 

  

  //TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
  //Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
  loadSavedRunkeeperTweets().then(parseTweets);
});
