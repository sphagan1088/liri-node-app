// store data from keys.js
var dataKeys = require("./keys.js");

var Twitter = require("twitter");

var Spotify = require("node-spotify-api");

var axios = require("axios");

var fs = require("fs");



var spotify = new Spotify ({
    "id": "2b255bc033d3434799579f225e716ed7",
    "secret": "beb1a71357f547ff987091c250a39c49"
});

function getInputAction(inputCommand, commandData) {
    switch (inputCommand) {
        case "my-tweets":
            showTweets();
            break;

        case "spotify-this-song":
           showSpotify(commandData);
            break;

        case "movie-this":
            showMovie(commandData);
            break;
        
        case "do-what-it-says":
            showRandom();
            break;
        
        default: 
            console.log("Unknown Command")
            break;

    }
}




function showTweets() {
    // show last 20 tweets and when they were created 
    var clientObject = new Twitter(dataKeys);

    var params = {"screen_name": "sphagan88"};

    // make call using get to twitter api
    clientObject.get("statuses/user_timeline", params, function (error, tweets, response) {
        if(error) {
            console.log(error);
            return;  
        }

        // loop through tweets
        for(var i = 0; i < 20; i++) {
            // get date created 
            var dateCreated = tweets[i].created_at;

            // get tweet content
            var tweetContent = tweets[i].text;

            console.log(dateCreated);
            console.log(tweetContent);
            console.log("**********************");
            console.log();
        }
    });
}

function showSpotify(songName) {
    //  show the following information about the song 
    // if no song name provided
    if(songName === undefined) {
        // default "The Sign" 
        songName = "The Sign";
    }

    // search spotify for song name
    spotify.search({type: "track", query: songName, limit: 10}, function(error, data) {
        if(error) {
            console.log(error);
            return;
        }
        
        // get songs and store in array
        var songsArray = data.tracks.items;

        //loop through songs array
        for(var i = 0; i < songsArray.length; i++) {
       
            console.log(i+1);
            console.log("Song Name: " + songsArray[i].name);
            console.log("Artist Name: " + songsArray[i].artists[0].name);
            console.log("Preview URL " + songsArray[i].preview_url);
            console.log("Album Name: " + songsArray[i].album.name);
            console.log("************************");
            console.log();
        }
    });
        

    
    
}

function showMovie(movieName) {
    
    // use axios to retrieve data from OMDB api 
    axios.get(`http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=trilogy`)
        .then(function (response) {
                             
            //Output the following info
            //Title
            //Year
            //ImDbRating
            //Rotten tomatoes rating
            //Country produced
            //Language
            //Plot
            //Actors
                          
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("Imdb Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country Produced In: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                           
           
             })
        .catch(function (error) {
            console.log(error);
        })


        

     
        

};

function showRandom() {

        // use fs to read random.txt 
        fs.readFile("random.txt", "utf8", function(error, data){
            if(error) {
                return console.log(error);
            }

            console.log(data);

            var dataArr = data.split(",");
            
            if(showRandom === process.argv[2])
            showSpotify();

           
        })

}

getInputAction(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);