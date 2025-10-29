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

        if(text.includes('just completed')||(text.includes('just posted'))){
            return 'Completed events';
        }
        if(text.includes("live")){
            return 'Live events';
        }
        if(text.includes('record')||text.includes('pb')||text.includes('personal')){
            return 'Achievement';
        }
        return 'Miscellaneous';
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.writtenText.trim().length > 0){
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet

        const match = this.text.match(/(\d+\.?\d*)\s*(mi|km)\s*([\w\s]+?)(?:\s+with RunKeeper|\s+#RunKeeper)/i);

        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}