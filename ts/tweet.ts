class Tweet {
  private text: string;
  time: Date;
  text_content: string;

  constructor(tweet_text: string, tweet_time: string) {
    this.text = tweet_text;
    this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    this.text_content = this.text.split(" https")[0];
  }

  //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
  get source(): string {
    //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.

    if (
      this.text.includes("Just completed a") ||
      this.text.includes("Just posted a")
    ) {
      return "completed_event";
    }
    if (this.text.startsWith("Watch") && this.text.includes("now")) {
      return "live_event";
    }
    if (this.text.toLowerCase().includes("achieved")) {
      return "achievement";
    }

    return "miscellaneous";
  }

  //returns a boolean, whether the text includes any content written by the person tweeting.
  get written(): boolean {
    if (this.text.includes(" - ") && this.source === "completed_event") {
      return true;
    }
    return false;
  }

  get writtenText(): string {
    if (!this.written) {
      return "";
    }
    const splitText = this.text_content.split("- ");
    const writtenText = splitText[splitText.length - 1];
    return writtenText;
  }

  get parseActivity(): { type: string; distance: string } {
    const activityInfo = { type: "", distance: "" };

    let activity_content: any = "";
    if (!this.written) {
      let trimBeginText = this.text_content.split("ed a").pop();
      if (trimBeginText?.startsWith("n")) {
        trimBeginText = trimBeginText.substring(1);
      }
      if (trimBeginText?.includes(" with Runkeeper")) {
        activity_content = trimBeginText
          ? trimBeginText
              .trim()
              .slice(0, trimBeginText?.indexOf(" with Runkeeper"))
          : "";
      } else if (trimBeginText?.includes(" with @Runkeeper")) {
        activity_content = trimBeginText
          ? trimBeginText
              .trim()
              .slice(0, trimBeginText?.indexOf(" with @Runkeeper"))
          : "";
      }
    } else {
      let trimEndText = this.text_content
        ? this.text_content.trim().split(" - ")[0]
        : "";
      activity_content = trimEndText ? trimEndText.split("ed a").pop() : " ";
    }

    if (activity_content?.includes("km")) {
      activityInfo["type"] = activity_content.substring(
        activity_content.indexOf("km") + 3,
        activity_content.length
      );
      activityInfo["distance"] = activity_content
        .substring(0, activity_content.indexOf("km") + 2)
        .trim();
    } else if (activity_content?.includes("mi")) {
      activityInfo["type"] = activity_content.substring(
        activity_content.indexOf("mi") + 3,
        activity_content.length
      );
      activityInfo["distance"] = activity_content
        .substring(0, activity_content.indexOf("mi") + 2)
        .trim();
    } else {
      const workout = activity_content?.trim().split(" in ");

      // // console.log(workout);
      // activityInfo["type"] = workout ? workout[0] : "";

      activityInfo["type"] = "unknown";
      activityInfo["distance"] = "duration";
    }

    if (activityInfo["type"].includes("-")) {
      activityInfo["type"] = activityInfo["type"].slice(
        0,
        activityInfo["type"].indexOf(" -")
      );
    }
    // console.log(activityInfo);
    return activityInfo;
  }

  get activityType(): string {
    if (this.source != "completed_event") {
      return "unknown";
    }

    //TODO: parse the activity type from the text of the tweet
    return this.parseActivity.type;
  }

  get distance(): number {
    if (this.source != "completed_event") {
      return 0;
    }
    //TODO: prase the distance from the text of the tweet
    const distanceAmount = this.parseActivity.distance;
    // console.log(distanceAmount);
    if (distanceAmount.includes("km")) {
      let mileConversion: number = +distanceAmount.split(" ")[0];
      mileConversion = mileConversion / 1.609;
      // console.log(mileConversion, distanceAmount);
      return mileConversion;
    } else if (distanceAmount.includes("mi")) {
      // console.log(+distanceAmount.split(" ")[0], distanceAmount)
      return +distanceAmount.split(" ")[0];
    } else {
      return 0;
    }
  }

  getHTMLTableRow(rowNumber: number): string {
    //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
    const tweet_content = this.text.slice(0, this.text.indexOf("http"));
    const tweet_link = this.text.slice(
      this.text.indexOf("http"),
      this.text.indexOf("#Runkeeper") - 1
    );
    return `<tr>
    <td>${rowNumber} </td>
    <td>${this.activityType}</td>
    <td> ${tweet_content} <a href="${tweet_link}">${tweet_link}</a>  #Runkeeper</td>
    </tr>`;
  }
}
