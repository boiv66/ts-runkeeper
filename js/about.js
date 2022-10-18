
function displayEarliestAndLatestDate(tweet_array){
	orderedDates = tweet_array.map(a => a.time).sort(function(a,b){return Date.parse(a) > Date.parse(b)});
	document.getElementById('lastDate').innerText = orderedDates[0].toDateString();
	document.getElementById('firstDate').innerText = orderedDates[orderedDates.length-1].toDateString(); 
}

function displayEventPercentage(tweet_array){
	event_count = {live_event:0, }
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// console.log(tweet_array[1].time); 
	// orderedDates = tweet_array.sort(function(a,b){
	// 	return Date.parse(a) > Date.parse(b)});
	// console.log(orderedDates)
	displayEarliestAndLatestDate(tweet_array);
	displayEventPercentage(tweetarray); 
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});