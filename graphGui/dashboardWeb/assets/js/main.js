const flask_doc_request = 'http://localhost:3000/get-doc-by-id/'
const first_request = "http://localhost:3000/search"
const polling_request = "http://localhost:3000/get-doc-id"

//request to update the nav bar with all the graphs processed 
setInterval(function () {
    $.ajax({
        type: "get",
        url: polling_request,
        dataType: 'json',
        success: function (data) {
            var list_len = Object.keys(data.ids).length
            for (i = 0; i < list_len; i++) {
                var li = document.createElement('li');
                li.id = 'block' + i;
                li.className = 'w-100';
                var link = document.createElement('a');
                link.className = "nav-link px-0";
                var sp = document.createElement('span');
                sp.textContent = data.ids[i];
                link.textContent = i+" ";
                link.appendChild(sp);
                li.appendChild(link);
                if (document.getElementById("block" + i) === null) {
                    document.getElementById("submenu1").appendChild(li);
                    document.getElementById("block" + i).onclick = function () {
                        //onclick to get the graph
                        var id = $(this).find('span').text();
                        $('#id_grafo').empty().append(id)
                        $.getJSON(flask_doc_request + String(id), function (data) {

                            sessionStorage.setItem('id_graph', id)
                            var nodes = data.nodes
                            var edges = data.edges


                            var node_size = Object.keys(nodes).length
                            var edge_size = Object.keys(edges).length

                            var nodes_list = new vis.DataSet();
                            var edges_list = new vis.DataSet();

                            for (var i = 0; i < edge_size; i++) {
                                edges_list.add({ from: edges[i].source, to: edges[i].target, weight: edges[i].value, title: edges[i].value });
                            }

                            for (var i = 0; i < node_size; i++) {
                                nodes_list.add({ id: nodes[i].name, label: nodes[i].text, title: (nodes[i].categories !== null ? nodes[i].categories[0] : "None"), group: (nodes[i].categories !== null ? nodes[i].categories[0] : "None") });
                            }

                            var container = document.getElementById("mynetwork");

                            var datas = {
                                nodes: nodes_list,
                                edges: edges_list,
                            };

                            var options = {
                                nodes: {
                                    shape: "dot",
                                },
                                edges: {
                                    arrows: 'to',
                                    scaling: {
                                        label: true,
                                    }
                                }
                            };

                            var network = new vis.Network(container, datas, options, directed = true, show_buttons = false);

                            network.on("stabilizationProgress", function (params) {
                                document.getElementById('loadingBar').removeAttribute("style");
                                var maxWidth = 496;
                                var minWidth = 20;
                                var widthFactor = params.iterations / params.total;
                                var width = Math.max(minWidth, maxWidth * widthFactor);

                                document.getElementById('bar').style.width = width + 'px';
                                document.getElementById('text').innerHTML = Math.round(widthFactor * 100) + '%';
                            });

                            network.once("stabilizationIterationsDone", function () {
                                document.getElementById('text').innerHTML = '100%';
                                document.getElementById('bar').style.width = '496px';
                                document.getElementById('loadingBar').style.opacity = 0;
                                // really clean the dom element
                                setTimeout(function () { document.getElementById('loadingBar').style.display = 'none'; }, 500);
                            });

                        });

                    }
                }
            }
        }
    });
}, 10000); //10000 milliseconds = 10 seconds

$( document ).ready(function() {
    console.log("Qui" + sessionStorage.getItem('id_graph'));
    if(sessionStorage.getItem('id_graph')==null){
        $.getJSON(first_request , function (data) {
            console.log("QUII")
            sessionStorage.setItem('id_graph', data.id)
            var nodes = data.nodes
            var edges = data.edges
        
            var node_size = Object.keys(nodes).length
            var edge_size = Object.keys(edges).length
        
            var nodes_list = new vis.DataSet();
            var edges_list = new vis.DataSet();
        
            for (var i = 0; i < edge_size; i++) {
                edges_list.add({ from: edges[i].source, to: edges[i].target, weight: edges[i].value, title: edges[i].value });
            }
        
            for (var i = 0; i < node_size; i++) {
                nodes_list.add({ id: nodes[i].name, label: nodes[i].text, title: (nodes[i].categories !== null ? nodes[i].categories[0] : "None"), group: (nodes[i].categories !== null ? nodes[i].categories[0] : "None") });
            }
            $('#id_grafo').empty().append(data.id)
            var container = document.getElementById("mynetwork");
        
            var datas = {
                nodes: nodes_list,
                edges: edges_list,
            };
        
            var options = {
                nodes: {
                    shape: "dot",
                },
                edges: {
                    arrows: 'to',
                    scaling: {
                        label: true,
                    }
                },
                layout: {
                    improvedLayout: false
                }
            };
        
            var network = new vis.Network(container, datas, options, directed = true, show_buttons = false);
        
            network.on("stabilizationProgress", function (params) {
                document.getElementById('loadingBar').removeAttribute("style");
                var maxWidth = 496;
                var minWidth = 20;
                var widthFactor = params.iterations / params.total;
                var width = Math.max(minWidth, maxWidth * widthFactor);
        
                document.getElementById('bar').style.width = width + 'px';
                document.getElementById('text').innerHTML = Math.round(widthFactor * 100) + '%';
            });
        
            network.once("stabilizationIterationsDone", function () {
                document.getElementById('text').innerHTML = '100%';
                document.getElementById('bar').style.width = '496px';
                document.getElementById('loadingBar').style.opacity = 0;
                // really clean the dom element
                setTimeout(function () { document.getElementById('loadingBar').style.display = 'none'; }, 500);
            });
        
        });
    }else{
    $.getJSON(flask_doc_request + sessionStorage.getItem('id_graph') , function (data) {
        console.log("QUII")
        sessionStorage.setItem('id_graph', data.id)
        var nodes = data.nodes
        var edges = data.edges
    
        var node_size = Object.keys(nodes).length
        var edge_size = Object.keys(edges).length
    
        var nodes_list = new vis.DataSet();
        var edges_list = new vis.DataSet();
    
        for (var i = 0; i < edge_size; i++) {
            edges_list.add({ from: edges[i].source, to: edges[i].target, weight: edges[i].value, title: edges[i].value });
        }
    
        for (var i = 0; i < node_size; i++) {
            nodes_list.add({ id: nodes[i].name, label: nodes[i].text, title: (nodes[i].categories !== null ? nodes[i].categories[0] : "None"), group: (nodes[i].categories !== null ? nodes[i].categories[0] : "None") });
        }
        $('#id_grafo').empty().append(data.id)
        var container = document.getElementById("mynetwork");
    
        var datas = {
            nodes: nodes_list,
            edges: edges_list,
        };
    
        var options = {
            nodes: {
                shape: "dot",
            },
            edges: {
                arrows: 'to',
                scaling: {
                    label: true,
                }
            },
            layout: {
                improvedLayout: false
            }
        };
    
        var network = new vis.Network(container, datas, options, directed = true, show_buttons = false);
    
        network.on("stabilizationProgress", function (params) {
            document.getElementById('loadingBar').removeAttribute("style");
            var maxWidth = 496;
            var minWidth = 20;
            var widthFactor = params.iterations / params.total;
            var width = Math.max(minWidth, maxWidth * widthFactor);
    
            document.getElementById('bar').style.width = width + 'px';
            document.getElementById('text').innerHTML = Math.round(widthFactor * 100) + '%';
        });
    
        network.once("stabilizationIterationsDone", function () {
            document.getElementById('text').innerHTML = '100%';
            document.getElementById('bar').style.width = '496px';
            document.getElementById('loadingBar').style.opacity = 0;
            // really clean the dom element
            setTimeout(function () { document.getElementById('loadingBar').style.display = 'none'; }, 500);
        });
    
    });
}
});
//at the beginning loads the last graph written on es

