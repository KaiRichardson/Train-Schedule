// Initialize Firebase
var config = {
    apiKey: "AIzaSyCILM6ohpeFbelHyLMloxF3avvmHSDgefc",
    authDomain: "train-schedule-e4f45.firebaseapp.com",
    databaseURL: "https://train-schedule-e4f45.firebaseio.com",
    projectId: "train-schedule-e4f45",
    storageBucket: "train-schedule-e4f45.appspot.com",
    messagingSenderId: "679175745350"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

var trains = [
    {
        name: "Trenton Express",
        destination: "Trenton, New Jersey",
        firstTrain: "00:00",
        frequesncy: 25
    },
    {
        name: "Oregon Trail",
        destination: "Salem, Oregon",
        firstTrain: "00:00",
        frequesncy: 3600
    },
    {
        name: "Midnight Carrage",
        destination: "Philadelphia, Pennsylvania",
        firstTrain: "00:00",
        frequesncy: 20
    },
    {
        name: "Sing Song Caravan",
        destination: "Atlanta, Georgia",
        firstTrain: "00:00",
        frequesncy: 45
    }
]

function popTrains() {

    $("tbody").empty();

    for (let i = 0; i < trains.length; i++) {

        var trainStats = $("<tr>");
        trainStats.append($("<th>").attr("scope", "row").text(trains[i].name))
        trainStats.append($("<td>").text(trains[i].destination))
        trainStats.append($("<td>").text(trains[i].frequesncy))

        // Assumptions
        var tFrequency = trains[i].frequesncy;

        // Time is 3:30 AM
        var firstTime = trains[i].firstTrain;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

        // Current Time
        var currentTime = moment();
        $("#current_time").text(moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        trainStats.append($("<td>").text(moment(nextTrain).format("hh:mm")))

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        trainStats.append($("<td>").text(tMinutesTillTrain))

        $("tbody").append(trainStats);
    }

}

$("#add-train").on("click", function (event) {
    event.preventDefault();

    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrain = $("#trainTime-input").val().trim();
    frequesncy = $("#frequesncy-input").val().trim();

    // Code for the push
    dataRef.ref().push({

        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequesncy: frequesncy,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
dataRef.ref().on("child_added", function (childSnapshot) {

    trains.push({
            name: childSnapshot.val().name,
            destination: childSnapshot.val().destination,
            firstTrain: childSnapshot.val().firstTrain,
            frequesncy: childSnapshot.val().frequesncy
        });

    popTrains();

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

$(window).on('load', popTrains())