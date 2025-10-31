function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	const DAY_ORDER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const getDayName = (date) => DAY_ORDER[date.getDay()];
	const MI_TO_KM = 1.60934;

	const activity_tweets = tweet_array
        .filter(tweet => tweet.activityType && tweet.activityType.length > 0);

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const activityData = tweet_array
        .filter(tweet => tweet.activityType && tweet.activityType.length > 0)
        .map(tweet => ({ activity: tweet.activityType }));

	//A plot of how many of each type of activity exists in the dataset
	activity_vis_spec = {
	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	"description": "A graph of the number of Tweets containing each type of activity.",
	"data": {
		"values": activityData
	},
		"mark": {"type": "bar"},
        "encoding": {
            "y": {
                "aggregate": "count",
                "field": "activity",
                "type": "quantitative",
                "title": "Number of Tweets"
            },
            "x": {
                "field": "activity",
                "type": "nominal",
                "sort": {"field": "count", "op": "count", "order": "descending"},
                "title": "Activity Type"
            },
			"color": {"field": "activity", "type": "nominal", "legend": null}
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});


	const activity_counts = activityData.reduce((counts, d) => {
        counts[d.activity] = (counts[d.activity] || 0) + 1;
        return counts;
    }, {});

    const top_activities = Object.entries(activity_counts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([activityName]) => activityName);

	const topActivityData = tweet_array
        .filter(tweet => top_activities.includes(tweet.activityType))
        .map(tweet => ({
            activity: tweet.activityType,
            // Convert distance (in miles per Tweet.distance getter) to KM
            distance_km: tweet.distance * MI_TO_KM,
            day: getDayName(tweet.time)
        }))
        .filter(d => d.distance_km > 0);

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.

	//A plot of the distances by day of the week for all of the three most tweeted-about activities. 
	const distance_vis_unaggregated = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Unaggregated distances for top 3 activities by day of the week.",
    	"title": {
			"text": "Individual Activity Distances by Day of Week",
			"anchor": "middle"
		},
		"width": 300,
		"data": { "values": topActivityData },
		"mark": {
			"type": "point",
			"tooltip": true,
			"filled": false,
			"strokeWidth": 1,
			"opacity": 0.6
		},
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": DAY_ORDER,
				"title": "time (day)"
			},
			"y": {
				"field": "distance_km",
				"type": "quantitative",
				"title": "distance (km)"
			},
			"color": {"field": "activity", "type": "nominal", "title": "Activity"} 
		}
	};

	//A plot of the distances by day of the week for all of the three most tweeted-about activities, aggregating the activities by the mean.
    const distance_vis_aggregated = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Average distances for top 3 activities by day of the week (Aggregated Mean).",
		"title": {
			"text": "Average Activity Distance by Day of Week",
			"anchor": "middle"
		},
		"width": 300,
		"data": { "values": topActivityData },
		"mark": {
			"type": "point",
			"tooltip": true,
			"filled": false,
			"strokeWidth": 1,
			"opacity": 0.6
		},
		"encoding": {
			"x": {
				"field": "day",
				"type": "ordinal",
				"sort": DAY_ORDER,
				"title": "time (day)"
			},
			"y": {
				"field": "distance_km",
				"aggregate": "mean",
				"type": "quantitative",
				"title": "mean distance (km)"
			},
			"color": {"field": "activity", "type": "nominal", "title": "Activity"},
		}
	};

    const distanceVisContainer = document.getElementById('distanceVis');
    const distanceVisAggregatedContainer = document.getElementById('distanceVisAggregated');


	//button logic 
    vegaEmbed(distanceVisContainer, distance_vis_unaggregated, { actions: false });
    distanceVisAggregatedContainer.style.display = 'none';

    let isAggregated = false;

    document.getElementById('aggregate').addEventListener('click', () => {
        isAggregated = !isAggregated;

        if (isAggregated) {

            vegaEmbed(distanceVisAggregatedContainer, distance_vis_aggregated, { actions: false });
            distanceVisAggregatedContainer.style.display = 'block';
            distanceVisContainer.style.display = 'none';
            document.getElementById('aggregate').innerText = 'Show individual activities';
        } else {
            distanceVisContainer.style.display = 'block';
            distanceVisAggregatedContainer.style.display = 'none';
            document.getElementById('aggregate').innerText = 'Show means';
        }
    });


	//text answers based off graph data
	document.getElementById('numberActivities').innerText = Object.keys(activity_counts).length;
    document.getElementById('firstMost').innerText = top_activities[0] || 'N/A';
    document.getElementById('secondMost').innerText = top_activities[1] || 'N/A';
    document.getElementById('thirdMost').innerText = top_activities[2] || 'N/A';

	const mean_distances = topActivityData.reduce((acc, d) => {
        acc[d.activity] = (acc[d.activity] || []).concat(d.distance_km);
        return acc;
    }, {});

    const activity_means = Object.keys(mean_distances).map(activity => ({
        activity: activity,
        mean: math.mean(mean_distances[activity])
    }));

    const longestActivity = activity_means.reduce((a, b) => (a.mean > b.mean ? a : b)).activity;
    const shortestActivity = activity_means.reduce((a, b) => (a.mean < b.mean ? a : b)).activity;


    const weekendDays = ["Sat", "Sun"];
    const day_type_distances = topActivityData.reduce((acc, d) => {
        const type = weekendDays.includes(d.day) ? 'Weekend' : 'Weekday';
        acc[type] = (acc[type] || []).concat(d.distance_km);
        return acc;
    }, {});

    const weekday_mean = math.mean(day_type_distances['Weekday']);
    const weekend_mean = math.mean(day_type_distances['Weekend']);
    const longerDayType = weekday_mean > weekend_mean ? 'weekdays' : 'weekends';

    document.getElementById('longestActivityType').innerText = longestActivity;
    document.getElementById('shortestActivityType').innerText = shortestActivity;
    document.getElementById('weekdayOrWeekendLonger').innerText = longerDayType;
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});