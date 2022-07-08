const flask_doc_request_pie = 'http://localhost:3000/get-pie-by-id/'
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    $('#id_grafo').empty().append(sessionStorage.getItem('id_graph'))
    $.getJSON(flask_doc_request_pie + sessionStorage.getItem('id_graph'), function (data) {
        var count_nodes = data.count_nodes
        var data = new google.visualization.DataTable();
        var obj = [];
        for (const [key, value] of Object.entries(count_nodes)) {
            let innerArr = new Array();
            innerArr.push(key);
            innerArr.push(value)
            obj.push(innerArr);
        }
        data.addColumn('string', 'Topping');
        data.addColumn('number', 'Slices');
        data.addRows(obj);
        var options = {
            title: 'Categorie',
            is3D: 'true'
        };
        var chart = new google.visualization.PieChart(document.getElementById("piechart"));
        chart.draw(data, options);

    });
}

$('#graph').click(function (event) {
    sessionStorage.setItem('id_graph', sessionStorage.getItem('id_graph'))
                            window.open(
                                "index.html", "_self");
});
