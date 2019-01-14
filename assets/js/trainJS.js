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

    //When submit button is pushed...
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
        //Closes comfirmation Pop-up after 1.5 seconds
        setTimeout(function() {
            $('#trainAdded').modal('hide');
        }, 1500);

    });

    //Updates HTML when new DB entry received
    database.ref().on("child_added", function(snapshot){
        trainName = snapshot.val().trainName;
        destination = snapshot.val().destination;
        firstTrain = snapshot.val().firstTrain;
        frequency = snapshot.val().frequency;

        //Math to determine next train and minutes away
        var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
        var tRemainder = diffTime % frequency;
        var minutesTillTrain = frequency - tRemainder;
        console.log("Minutes til next train: " + minutesTillTrain);
        var nextTrain = moment().add(minutesTillTrain, "minutes").format("HH:mm");

        //Creates table elements and adds train information from DB to HTML Table
        var tableRow = $("<tr>");
        var tableDataName = $("<td>").text(trainName);
        var tableDataDestination = $("<td>").text(destination);
        var tableDataFrequency = $("<td>").text(frequency);
        var tableDataNext = $("<td>").text(nextTrain);
        var tableDataMinutesAway = $("<td>").text(minutesTillTrain);
        tableRow.append(tableDataName);
        tableRow.append(tableDataDestination);
        tableRow.append(tableDataFrequency);
        tableRow.append(tableDataNext);
        tableRow.append(tableDataMinutesAway);
        $("#train-list").append(tableRow);

    });
});