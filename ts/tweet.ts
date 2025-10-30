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
        if(text.startsWith('just completed')||(text.startsWith('just posted'))){
            return 'Completed events';
        }
        if (text.startsWith('watch my')||text.includes("live")|| text.includes("#rklive")) {
            return 'Live events';
        }
        if(text.startsWith('achieved')||text.includes('record')||text.includes('personal')|| text.includes('achievement')){
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
        let text = this.text.trim();

        // Remove URLs, all hashtags , all @mentions
        text = text
            .replace(/https?:\/\/t\.co\/\S+/g, '')
            .replace(/#\w+/g, '')
            .replace(/@\w+/g, '')
            .trim();

        const completedRegex = /^\s*(Just\s+(completed|posted)\s+a?\s*.*?)(\s*-\s*|Check it out!)/i;
        const match = text.match(completedRegex);

        if (match){
            text = text.replace(completedRegex, ' ');
        }

        return text.trim();
    }

    get activityType():string {
        //TODO: parse the activity type from the text of the tweet
        if (this.source !== 'Completed events') {
            return "";
        }

        const text = this.text;

        const regex = /\d+(\.\d+)?\s*(\bmi|\bkm|miles|kilometers)\s*(\w+)/i;
        const match = text.match(regex);

        if (match && match[3]) {
            // match[3] is the single word captured (e.g., 'run', 'bike', 'walk')
            return match[3].toLowerCase();
        }
        return this.source;
    }

    get distance():number {
        //TODO: prase the distance from the text of the tweet
        if (this.source !== 'Completed events') {
            return 0;
        }

        const text = this.text;

        const conversion = 0.621371;

        const regex = /(\d+(\.\d+)?)\s*(\bmi|\bkm|miles|kilometers)/i;
        const match = text.match(regex);

        if (match) {
            const distance = parseFloat(match[1]);
            const unit = match[3].toLowerCase();

            // Convert kilometers to miles
            if (unit.startsWith('km')) {
                return distance * conversion;
            }
            return distance;
        }
            return 0;
        }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}