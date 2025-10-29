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

//Tweet Dates

	let earliestDate = tweet_array[0].time;
	let latestDate = tweet_array[0].time;

	for (let i = 1; i < tweet_array.length; i++){
		const currentDate = tweet_array[i].time;

		if(currentDate < earliestDate){
			earliestDate = currentDate;
		}

		if(currentDate > latestDate){
			latestDate = currentDate;
		}
	}

	const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
	};

	const formattedEarliest = earliestDate.toLocaleDateString(undefined, dateOptions);
    const formattedLatest = latestDate.toLocaleDateString(undefined, dateOptions);


    document.getElementById('firstDate').innerText = formattedEarliest;
    document.getElementById('lastDate').innerText = formattedLatest;

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});