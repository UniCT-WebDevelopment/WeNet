const flask_doc_request = 'http://localhost:3000/get-doc-by-id/'
const polling_request = "http://localhost:3000/get-doc-id"
var previewElement;
var previewArc;
var previewNode = [];

$.getJSON(flask_doc_request + sessionStorage.getItem('id_graph'), function (data) {


    console.log(data.text)

    var nodes = data.nodes
    var edges = data.edges

    var node_size = Object.keys(nodes).length
    var edge_size = Object.keys(edges).length

    const nodeMap = [];
    const arcMap = [];
    for (var i = 0; i < edge_size; i++) {
        var edge = {

            source: edges[i].source,
            target: edges[i].target,
            value: edges[i].value
        };
        arcMap.push(edge)
    }

    for (var i = 0; i < node_size; i++) {
        var node = {
            target: nodes[i].name,
            value: nodes[i].text
        };
        nodeMap.push(node)
    }
    console.log(nodeMap)
    $('#id_grafo').empty().append(data.id)
    $('.testo').text(data.text)
    var str = $('.testo').text().split(" ");
    $('.testo').empty();
    var countWord = 0;
    str.forEach(function (a) {
        $('.testo').append('<a class="pointer"><span class="word" src="' + countWord + '">' + a.slice(0) + " " + '</span></a>')
        countWord += a.slice(0).length;
        countWord += 1 //uno spazio
    })
    $(".word").click(function (event) {
        if (previewElement) $(previewElement.target.classList.remove('bg-yellow'))
        if (previewArc) previewArc.removeClass('bg-green');
        if (previewNode) {
            for (var i = 0; i < previewNode.length; i++) {
                previewNode[i].removeClass('bg-red');
            }
        }
        $('#table-nodes').empty();
        var text = $(event.target).text();
        pos = $(event.target).attr("src");
        var counterMatch = 1;
        $('#table-nodes').empty().append('<thead><tr> <th scope="col">#</th><th scope="col">Arco</th><th scope="col">Entità</th></tr></thead>');
        for (var i = 0; i < arcMap.length; i++) {
            if (arcMap[i].source == pos) {
                console.log(arcMap[i].source)
                for (var j = 0; j < nodeMap.length; j++) {
                    if (arcMap[i].target == nodeMap[j].target) {
                        console.log("QUIII")
                        $('#table-nodes').append(`<tr>
                 <th scope="row">${counterMatch}</th>
                 <td src="${arcMap[i].source}" class="arc-row" onClick="prova(this)"> 
                 ${arcMap[i].value}
                 </td>
                 <td src="${nodeMap[j].target}" class="node-row" onClick="prova(this)">
                 ${nodeMap[j].value}
                 </td>
                  </tr>`);
                        counterMatch++;
                    }
                }
            }
        }
        $(event.target.classList.add('bg-yellow'))
        previewElement = event;
        $("#parolaSelezionata").empty();
        $("#parolaSelezionata").append(text);

    })
});

function prova(element) {
    //console.log($(this.pos))
    var text = element.getAttribute("src")
    var node = $("span[src='" + text + "']");
    node.addClass("bg-red")
    previewNode.push(node);
}


// $(".arc-row").click(function (event) {
//     var text = $(event.target).attr("src");
//     var arc = $("span[src='" + text + "']");
//     arc.addClass('bg-green');
//     previewArc = arc;
// })

$('#graph').click(function (event) {
    sessionStorage.setItem('id_graph', sessionStorage.getItem('id_graph'))
    window.open(
        "index.html", "_self");
});
