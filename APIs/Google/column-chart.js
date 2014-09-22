/**
 * Created by young on 5/27/14.
 */

google.load("visualization", "1", {packages:["corechart"]});

var dataArray = [['trip', 'Miles', 'Fuel Consumed']];
dataArray.push( [1, 0, 0]);
dataArray.push([2, 4, 2]);
dataArray.push([3, 6, 3]);


function drawVisualization() {
    // Create and populate the data table.
    var data = google.visualization.arrayToDataTable(dataArray);

    // Create and draw the visualization.
    new google.visualization.ColumnChart(document.getElementById('visualization')).
        draw(data,
        {title:"Fuel Usage by Trip ",
            width: 600,
            height: 400,
            hAxis : {title : 'TRIP'},
            series: {
                0: {
                    targetAxisIndex: 0
                },
                1: {
                    targetAxisIndex: 1
                }
            },
            vAxes: {
                0: {
                    title : 'Miles',
                    minValue: 0,
                    maxValue: 10,
                    label: 'Miles'
                },
                1: {
                    title : 'Gal',
                    minValue: 0,
                    maxValue: 5,
                    label: 'Gal'
                }
            }
        });
}


google.setOnLoadCallback(drawVisualization);