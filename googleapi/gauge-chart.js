/**
 * Created by young on 5/27/14.
 */
google.load('visualization', '1', {packages:['gauge']});
google.setOnLoadCallback(drawChart);
function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Max Speed', 72.22],

    ]);

    var options = {
        width: 400, height: 200,
        redFrom: 65, redTo: 100,
        yellowFrom:45, yellowTo: 65,
        minorTicks: 5,

    };

    var chart = new google.visualization.Gauge(document.getElementById('chart_div'));
    chart.draw(data, options);
}