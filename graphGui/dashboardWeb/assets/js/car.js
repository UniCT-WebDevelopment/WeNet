const flask_doc_request = 'http://localhost:3000/get-doc-by-id/'
const flask_doc_request_pie = 'http://localhost:3000/get-pie-by-id/'


$.getJSON(flask_doc_request + sessionStorage.getItem('id_graph'), function (data) {

    console.log(sessionStorage.getItem('id_graph'));
    console.log(data.id)

    var nodes = data.nodes
    var edges = data.edges

    var node_size = Object.keys(nodes).length
    var edge_size = Object.keys(edges).length


    for (var i = 0; i < edge_size; i++) {
        $('#table-arch').append(`<tr>
             <th scope="row">${i}</th>
             <td>
             ${edges[i].source}
             </td>
             <td>
             ${edges[i].target}
             </td>
             <td>
             ${edges[i].value}
             </td>
              </tr>`);
    }

    for (var i = 0; i < node_size; i++) {
        $('#table-nodes').append(`<tr>
             <th scope="row">${i}</th>
             <td>
             ${nodes[i].name}
             </td>
             <td>
             ${nodes[i].text}
             </td>
             <td>
             ${nodes[i].categories !== null ? nodes[i].categories[0] : "None"}
             </td>
              </tr>`);
    }

    $('#numNode').empty().append(node_size)
    $('#numArch').empty().append(edge_size)
    $('#id_grafo').empty().append(sessionStorage.getItem('id_graph'))
});


$.getJSON(flask_doc_request_pie + sessionStorage.getItem('id_graph'), function (data) {
    var count_edges = data.count_edges
    var count_nodes = data.count_nodes

    var max_edge = 0;
    var max_edge_name;
    for (const [key, value] of Object.entries(count_edges)) {
        console.log(key, value);
        if (value > max_edge) {
            max_edge = value;
            max_edge_name = key;
        }
    }

    var max_node = 0;
    var max_node_name;
    for (const [key, value] of Object.entries(count_nodes)) {
        console.log(key, value);
        if (value > max_node) {
            max_node = value;
            max_node_name = key;
        }
    }

    $('#nodeFreq').empty().append(max_node_name)
    $('#archFreq').empty().append(max_edge_name)
});


$('#graph').click(function (event) {
    sessionStorage.setItem('id_graph', sessionStorage.getItem('id_graph'))
    window.open(
        "index.html", "_self");
});