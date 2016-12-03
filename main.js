/**
 * Created by Weizguy on 12/2/2016.
 */

/**
 * Listen for the document to load and calls retrieveData function
 */
$(document).ready(function () {
    retrieveData();
    $('#table_id').DataTable();
});


var twitterGraph, instagramGraph, facebookGraph, tumblrGraph;
/**
 * dataArray - global array to hold data objects
 */
var dataArray = [];

function NuviData(provider, username, date, activity, likes, shares, comments) {
    this.provider = provider;
    this.username = username;
    this.date = date;
    this.activity = activity;
    this.likes = likes;
    this.shares = shares;
    this.comments = comments;
}

/**
 * Function to grab the data by making an AJAX call to the link provided
 */
var grabData;
var dataObject;
function retrieveData() {
    var url = "https://nuvi-challenge.herokuapp.com/activities";
    $.getJSON(url, function (data) {
        grabData = data;

        var provider = "";
        var username = "";
        var date = "";
        var activity = "";
        var likes = "";
        var shares = "";
        var comments = "";

        for (var i = 0; i < grabData.length; i++) {
            provider = grabData[i].provider;
            username = grabData[i].actor_username;
            date = grabData[i].activity_date;
            likes = grabData[i].activity_likes;
            shares = grabData[i].activity_shares;
            comments = grabData[i].activity_comments;
            if (grabData[i].activity_attachment == null) {
                activity = "No Attachment";
            } else {
                activity = grabData[i].activity_attachment + '.jpg';
            }

            var table = $('#table_id').DataTable();
            theRow = $('<tr>').append('<td>' + provider + '</td>', '<td>' + username + '</td>', '<td>' + date + '</td>', '<td>' + likes + '</td>', '<td>' + shares + '</td>', '<td>' + comments + '</td>', '<td>' + activity + '</td>');

            table.row.add(theRow).draw();

            dataObject = new NuviData(provider, username, date, activity, likes, shares, comments);
            dataArray.push(dataObject);
        }
        countData();
        countDates("twitter");
        countDates("tumblr");
        countDates("facebook");
        countDates("instagram");
    })
}


/**
 * Function to count the data based on provider
 */
var twitterCount = 0;
var instagramCount = 0;
var facebookCount = 0;
var tumblrCount = 0;
var countArray = [];

function countData() {
    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].provider == 'twitter') {
            twitterCount += 1;
        } else if (dataArray[i].provider == 'instagram') {
            instagramCount += 1;
        } else if (dataArray[i].provider == 'facebook') {
            facebookCount += 1;
        } else if (dataArray[i].provider == 'tumblr') {
            tumblrCount += 1;
        }
        countArray = [twitterCount, tumblrCount, facebookCount, instagramCount];
    }

    countArray.sort(function (a, b) {
        return b - a
    });
    var maxNum = countArray[0];

    /**
     * Function to create the graphs using canvas
     */
    (function () {

        function createCanvas(divName) {

            var div = document.getElementById(divName);
            var canvas = document.createElement('canvas');
            div.appendChild(canvas);
            if (typeof G_vmlCanvasManager != 'undefined') {
                canvas = G_vmlCanvasManager.initElement(canvas);
            }
            var ctx = canvas.getContext("2d");
            return ctx;
        }

        // Overall totals graph
        var total = createCanvas("totalCounts");

        var graph = new BarGraph(total);
        graph.maxValue = maxNum + 10;
        graph.margin = 2;
        graph.width = 800;
        graph.colors = ["green", "darkgreen", "lime", "lightgreen"];
        graph.xAxisLabelArr = ["Twitter", "Tumblr", "Facebook", "Instagram"];

        graph.update([twitterCount, tumblrCount, facebookCount, instagramCount]);

        // Twitter graph for days of week
        var twitterG = createCanvas("twitter");

        twitterGraph = new BarGraph(twitterG);
        twitterGraph.margin = 2;
        twitterGraph.width = 400;
        twitterGraph.colors = ["green", "darkgreen", "lime", "lightgreen", "darkgreen", "lime", "lightgreen"];
        twitterGraph.xAxisLabelArr = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        // Tumblr graph for days of week
        var tumblrG = createCanvas("tumblr");

        tumblrGraph = new BarGraph(tumblrG);
        tumblrGraph.margin = 2;
        tumblrGraph.width = 400;
        tumblrGraph.colors = ["green", "darkgreen", "lime", "lightgreen", "darkgreen", "lime", "lightgreen"];
        tumblrGraph.xAxisLabelArr = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        // Facebook graph for days of week
        var facebookG = createCanvas("facebook");

        facebookGraph = new BarGraph(facebookG);
        facebookGraph.margin = 2;
        facebookGraph.width = 400;
        facebookGraph.colors = ["green", "darkgreen", "lime", "lightgreen", "darkgreen", "lime", "lightgreen"];
        facebookGraph.xAxisLabelArr = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

        // Instagram graph for days of week
        var instagramG = createCanvas("instagram");

        instagramGraph = new BarGraph(instagramG);
        instagramGraph.margin = 2;
        instagramGraph.width = 400;
        instagramGraph.colors = ["green", "darkgreen", "lime", "lightgreen", "darkgreen", "lime", "lightgreen"];
        instagramGraph.xAxisLabelArr = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    }());

    /**
     * Function to create the actual graph
     */
    function BarGraph(ctx) {

        // Private properties and methods
        var that = this;
        var startArr;
        var endArr;
        var looping = false;

        // Loop method adjusts the height of bar and redraws if necessary
        var loop = function () {

            var delta;
            var animationComplete = true;

            // Boolean to prevent update function from looping if already looping
            looping = true;

            // For each bar
            for (var i = 0; i < endArr.length; i += 1) {
                // Change the current bar height toward its target height
                delta = (endArr[i] - startArr[i]) / that.animationSteps;
                that.curArr[i] += delta;
                // If any change is made then flip a switch
                if (delta) {
                    animationComplete = false;
                }
            }
            // If no change was made to any bars then we are done
            if (animationComplete) {
                looping = false;
            } else {
                // Draw and call loop again
                draw(that.curArr);
                setTimeout(loop, that.animationInterval / that.animationSteps);
            }
        };

        // Draw method updates the canvas with the current display
        var draw = function (arr) {

            var numOfBars = arr.length;
            var barWidth;
            var barHeight;
            var border = 2;
            var ratio;
            var maxBarHeight;
            var gradient;
            var largestValue;
            var graphAreaX = 0;
            var graphAreaY = 0;
            var graphAreaWidth = that.width;
            var graphAreaHeight = that.height;
            var i;

            // Update the dimensions of the canvas only if they have changed
            if (ctx.canvas.width !== that.width || ctx.canvas.height !== that.height) {
                ctx.canvas.width = that.width;
                ctx.canvas.height = that.height;
            }

            // Draw the background color
            ctx.fillStyle = that.backgroundColor;
            ctx.fillRect(0, 0, that.width, that.height);

            // If x axis labels exist then make room
            if (that.xAxisLabelArr.length) {
                graphAreaHeight -= 40;
            }

            // Calculate dimensions of the bar
            barWidth = graphAreaWidth / numOfBars - that.margin * 2;
            maxBarHeight = graphAreaHeight - 25;

            // Determine the largest value in the bar array
            var largestValue = 0;
            for (i = 0; i < arr.length; i += 1) {
                if (arr[i] > largestValue) {
                    largestValue = arr[i];
                }
            }

            // For each bar
            for (i = 0; i < arr.length; i += 1) {
                // Set the ratio of current bar compared to the maximum
                if (that.maxValue) {
                    ratio = arr[i] / that.maxValue;
                } else {
                    ratio = arr[i] / largestValue;
                }

                barHeight = ratio * maxBarHeight;

                // Turn on shadow
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 2;
                ctx.shadowColor = "#999";

                // Draw bar background
                ctx.fillStyle = "#333";
                ctx.fillRect(that.margin + i * that.width / numOfBars,
                    graphAreaHeight - barHeight,
                    barWidth,
                    barHeight);

                // Turn off shadow
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;

                // Draw bar color if it is large enough to be visible
                if (barHeight > border * 2) {
                    // Create gradient
                    gradient = ctx.createLinearGradient(0, 0, 0, graphAreaHeight);
                    gradient.addColorStop(1 - ratio, that.colors[i % that.colors.length]);
                    gradient.addColorStop(1, "#ffffff");

                    ctx.fillStyle = gradient;
                    // Fill rectangle with gradient
                    ctx.fillRect(that.margin + i * that.width / numOfBars + border,
                        graphAreaHeight - barHeight + border,
                        barWidth - border * 2,
                        barHeight - border * 2);
                }

                // Write bar value
                ctx.fillStyle = "#00ffff";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                // Use try / catch to stop IE 8 from going to error town
                try {
                    ctx.fillText(parseInt(arr[i], 10),
                        i * that.width / numOfBars + (that.width / numOfBars) / 2,
                        graphAreaHeight - barHeight - 10);
                } catch (ex) {
                }
                // Draw bar label if it exists
                if (that.xAxisLabelArr[i]) {
                    // Use try / catch to stop IE 8 from going to error town
                    ctx.fillStyle = "#00ffff";
                    ctx.font = "bold 12px sans-serif";
                    ctx.textAlign = "center";
                    try {
                        ctx.fillText(that.xAxisLabelArr[i],
                            i * that.width / numOfBars + (that.width / numOfBars) / 2,
                            that.height - 10);
                    } catch (ex) {
                    }
                }
            }
        };

        // Public properties and methods
        this.width = 300;
        this.height = 150;
        this.maxValue;
        this.margin = 5;
        this.colors = ["purple", "red", "green", "yellow"];
        this.curArr = [];
        this.backgroundColor = "#000";
        this.xAxisLabelArr = [];
        this.yAxisLabelArr = [];
        this.animationInterval = 100;
        this.animationSteps = 10;

        // Update method sets the end bar array and starts the animation
        this.update = function (newArr) {

            // If length of target and current array is different
            if (that.curArr.length !== newArr.length) {
                that.curArr = newArr;
                draw(newArr);
            } else {
                // Set the starting array to the current array
                startArr = that.curArr;
                // Set the target array to the new array
                endArr = newArr;
                // Animate from the start array to the end array
                if (!looping) {
                    loop();
                }
            }
        };
    }
};

/**
 * Function to get counts based on days of the week
 */
var dateArray = [];
var d, n;
function countDates(service) {
    var su = 0, mo = 0, tu = 0, we = 0, th = 0, fr = 0, sa = 0;
    for (var i = 0; i < dataArray.length; i++) {
        d = new Date(dataArray[i].date);
        n = d.getDay();
        if (dataArray[i].provider == service) {
            if (n == 0) {
                mo += 1;
            } else if (n == 1) {
                tu += 1;
            } else if (n == 2) {
                we += 1;
            } else if (n == 3) {
                th += 1;
            } else if (n == 4) {
                fr += 1;
            } else if (n == 5) {
                sa += 1;
            } else if (n == 6) {
                su += 1;
            }
        }
    }
    dateArray = [su, mo, tu, we, th, fr, sa];
    if (service == "twitter") {
        twitterGraph.update(dateArray);
        dateArray.sort(function (a, b) {
            return b - a
        });
        twitterGraph.maxValue = dateArray[0] + 5;
    } else if (service == "tumblr") {
        tumblrGraph.update(dateArray);
        dateArray.sort(function (a, b) {
            return b - a
        });
        tumblrGraph.maxValue = dateArray[0] + 5;
    } else if (service == "facebook") {
        facebookGraph.update(dateArray);
        dateArray.sort(function (a, b) {
            return b - a
        });
        facebookGraph.maxValue = dateArray[0] + 5;
    } else if (service == "instagram") {
        instagramGraph.update(dateArray);
        dateArray.sort(function (a, b) {
            return b - a
        });
        instagramGraph.maxValue = dateArray[0] + 5;
    }
}

