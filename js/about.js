function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	const totalTweets = tweet_array.length;

	const formatPercentage = (count) => {
        const percentage = (count / totalTweets) * 100;
        return math.format(percentage, { notation: 'fixed', precision: 2 }) + '%';
    };


	document.getElementById('numberTweets').innerText = totalTweets;

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
        day: 'numeric',
		timeZone: 'UTC'
	};

	const formattedEarliest = earliestDate.toLocaleDateString(undefined, dateOptions);
    const formattedLatest = latestDate.toLocaleDateString(undefined, dateOptions);


    document.getElementById('firstDate').innerText = formattedEarliest;
    document.getElementById('lastDate').innerText = formattedLatest;


//Category Counts

	let completedCount = 0;
    let liveEventCount = 0;
    let achievementCount = 0;
    let miscellaneousCount = 0;
    let completedWithTextCount = 0;

	for (const tweet of tweet_array) {
        switch (tweet.source) {
            case "Completed events":
                completedCount++;
                if (tweet.written) {
                    completedWithTextCount++;
                }
                break;
            case "Live events":
                liveEventCount++;
                break;
            case "Achievement":
                achievementCount++;
                break;
            case "Miscellaneous":
            default:
                miscellaneousCount++;
                break;
        }
	}


	// Completed Events
    document.querySelector('.completedEvents').innerText = completedCount;
    document.querySelector('.completedEventsPct').innerText = formatPercentage(completedCount);
    document.querySelectorAll('.completedEvents').forEach(element => {
        element.innerText = completedCount;
    });

    // Live Events
    document.querySelector('.liveEvents').innerText = liveEventCount;
    document.querySelector('.liveEventsPct').innerText = formatPercentage(liveEventCount);

    // Achievements
    document.querySelector('.achievements').innerText = achievementCount;
    document.querySelector('.achievementsPct').innerText = formatPercentage(achievementCount);

    // Miscellaneous
    document.querySelector('.miscellaneous').innerText = miscellaneousCount;
    document.querySelector('.miscellaneousPct').innerText = formatPercentage(miscellaneousCount);


//User-written Tweets
    // Calculate the percentage
    const writtenValue = completedCount > 0 ? (completedWithTextCount / completedCount) * 100 : 0;
    const written = math.format(writtenValue, { notation: 'fixed', precision: 2 }) + '%';

    // Update the HTML spans
    document.querySelector('.written').innerText = completedWithTextCount;
    document.querySelector('.writtenPct').innerText = written;

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});