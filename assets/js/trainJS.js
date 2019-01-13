// Initialize Firebase
var config = {
    apiKey: "AIzaSyAXhP6pwjKWHZBA3UTkagby8_mtR3AYLV8",
    authDomain: "train-scheduler-uden.firebaseapp.com",
    databaseURL: "https://train-scheduler-uden.firebaseio.com",
    projectId: "train-scheduler-uden",
    storageBucket: "",
    messagingSenderId: "862936651529"
};
firebase.initializeApp(config);


var database = firebase.database();
var trainName = "";
var firstTrain = "";
var frequency = 0;
var destination = "";

var timeFormat = "HH:mm";


$(document).ready(function () {

    $("#submit").on("click", function (event) {
        event.preventDefault();

        //Get values from user input
        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrain = $("#first-train").val().trim();
        frequency = $("#frequency").val().trim();

        //Clears inputs
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");

        //Pushes values to Firebase
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        });

        //Train Confirmation Pop-up
        $('#trainAdded').modal('show');
        
        setTimeout(function() {
            $('#trainAdded').modal('hide');
        }, 1500);

    });

    database.ref().on("child_added", function(snapshot){
        trainName = snapshot.val().trainName;
        console.log(trainName);
        destination = snapshot.val().destination;
        console.log(destination);
        firstTrain = snapshot.val().firstTrain;
        console.log(firstTrain);
        frequency = snapshot.val().frequency;
        console.log(frequency);
        var tableRow = $("<tr>");
        var tableDataName = $("<td>").text(trainName);
        var tableDataDestination = $("<td>").text(destination);
        var tableDataFrequency = $("<td>").text(frequency);
        var tableDataNext = $("<td>").text("n/a");
        var tableDataMinutesAway = $("<td>").text("n/a");
        tableRow.append(tableDataName);
        tableRow.append(tableDataDestination);
        tableRow.append(tableDataFrequency);
        tableRow.append(tableDataNext);
        tableRow.append(tableDataMinutesAway);
        $("#train-list").append(tableRow);

    });
});