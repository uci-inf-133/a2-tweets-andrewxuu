const distance_conversion = 1/1.609;

class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const text = this.text.toLowerCase();

        if(text.includes('just completed a')||(text.includes('just posted a'))
        || text.includes('i just completed an activity') || text.includes('completed a')){
            return 'Completed events';
        }
        if(text.includes("live")|| text.includes("#rklive")){
            return 'Live events';
        }
        if(text.includes('record')||text.includes('pb')||text.includes('personal')|| text.includes('achievement') || text.includes('set a goal')){
            return 'Achievement';
        }
        return 'Miscellaneous';
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return this.writtenText.trim().length > 0;
    }

    get writtenText():string {
    //TODO: parse the written text from the tweet
    
        const text = this.text.trim();

        const match = text.match(/(\bJust completed a|\bJust posted a|\bAchieved a new personal record|\bI just completed an activity)/i);

        if (match && match.index !== undefined) {
            const written = text.substring(0, match.index).trim();

            const cleaned = written.replace(/https:\/\/t\.co\/\S+\s*#Runkeeper/i, '').trim();
            if (cleaned.length > 0) {
                return cleaned;
            }
        }

        if (this.source == 'Miscellaneous' && !text.includes('with @Runkeeper.')) {
        return text;
        }

        return "";
    }

    get activityType():string {
        return this.source;
        //TODO: parse the activity type from the text of the tweet
    }

    get distance():number {
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}