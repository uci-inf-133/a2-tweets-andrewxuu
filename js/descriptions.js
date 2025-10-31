let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	writtenTweets = runkeeper_tweets
        .map(tweet => new Tweet(tweet.text, tweet.created_at))
        .filter(tweet => tweet.written);

	filterAndDisplayTweets('');
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const searchInput = document.getElementById('textFilter');

    searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase().trim();

        document.getElementById('searchText').textContent = searchText;

        filterAndDisplayTweets(searchText);
    });
}

function filterAndDisplayTweets(searchText) {

    const filteredTweets = writtenTweets.filter(tweet => {
        const searchableContent = `${tweet.text} ${tweet.activityType}`.toLowerCase();

        return searchableContent.includes(searchText);
    });

    document.getElementById('searchCount').textContent = filteredTweets.length;

    updateTable(filteredTweets, searchText);
}

function updateTable(tweets, filterText) {
    const tableBody = document.getElementById('tweetTable');

    tableBody.innerHTML = '';

    const regex = filterText ? new RegExp(filterText, 'gi') : null;

    tweets.forEach((tweet, index) => {
        const rowHTML = tweet.getHTMLTableRow(index + 1);

        tableBody.insertAdjacentHTML('beforeend', rowHTML);

        const row = tableBody.lastElementChild;

        if (regex && row) {
            const activityCell = row.cells[1];
            activityCell.innerHTML = activityCell.textContent.replace(regex, match => `<mark>${match}</mark>`);

            const linkElement = row.cells[2].querySelector('a');
            if (linkElement) {
                linkElement.innerHTML = linkElement.textContent.replace(regex, match => `<mark>${match}</mark>`);
            }
        }
    });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});