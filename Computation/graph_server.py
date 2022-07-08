from flask import Flask, json, jsonify, make_response
from elasticsearch import Elasticsearch
from flask_cors import CORS, cross_origin

es_server = Flask(__name__)
cors = CORS(es_server)
ES_ADDRESS = "http://elasticsearch:9200"
ES_INDEX = "graph_gui"

es = Elasticsearch(
        ES_ADDRESS,
        verify_certs=False
    )

#return the last written document
@es_server.route("/search")
@cross_origin()
def getData():
    search_param = {
        "size": 1,
        "sort": { "timestamp": "desc"},
        "query": {
            "match_all": {}
        }
    }
    res = es.search(index=ES_INDEX, body=search_param)
    nodes = []
    edges = []

    x = res["hits"]["hits"][0]

    id = x["_id"]
    timestamp = x["_source"]["timestamp"]
    nodes = x["_source"]["nodes"]
    edges = x["_source"]["links"]
    text = x["_source"]["full_text"]


    return make_response(jsonify({"id":id, "timestamp":timestamp, "nodes":nodes, "edges":edges, "text":text}), 200) #test jsonify


#return a list of all document's ids
@es_server.route("/get-doc-id")
@cross_origin()
def get_documents_id():
    query = {
         "size": 100,
        "query" : { 
            "match_all" : {} 
        },
       "stored_fields": ["_id"]
       
    }
    
    res = es.search(index=ES_INDEX, body=query)
    
    ids = []
    for x in res["hits"]["hits"]:
        if x["_id"] not in ids:
            ids.append(x["_id"])

    return es_server.response_class( json.dumps({"ids":ids}) )
    

#return the schema of a given id document
@es_server.route("/get-doc-by-id/<id>") 
@cross_origin()
def get_document_by_id(id):
    query = {
        "size": 1,
        "query": { 
            "bool": {
            "filter": {
                    "term": {
                    "_id": str(id)
                    }
                }
            }
        }
    }

    res = es.search(index=ES_INDEX, body=query)
    nodes = []
    edges = []

    x = res["hits"]["hits"][0]
    id = x["_id"]
    timestamp = x["_source"]["timestamp"]
    nodes = x["_source"]["nodes"]
    edges = x["_source"]["links"]
    text = x["_source"]["full_text"]

    return make_response(jsonify({"id":id, "timestamp":timestamp, "nodes":nodes, "edges":edges, "text":text}), 200) 

#return the information relative to a document for the pie visualization
@es_server.route("/get-pie-by-id/<id>") 
@cross_origin()
def get_pie_by_id(id):
    query = {
        "size": 1,
        "query": { 
            "bool": {
            "filter": {
                    "term": {
                    "_id": str(id)
                    }
                }
            }
        }
    }

    res = es.search(index=ES_INDEX, body=query)

    nodes = []
    edges = []

    x = res["hits"]["hits"][0]
    id = x["_id"]
    timestamp = x["_source"]["timestamp"]
    nodes = x["_source"]["nodes"]
    edges = x["_source"]["links"]
  
    node_dict = {}
    edge_dict = {}
    
    for node in nodes:
        if type(node["categories"]) is list and type(node["categories"]) is not None:
            if node["categories"][0] in node_dict:
                node_dict[node["categories"][0]] += 1
            else:
                node_dict[node["categories"][0]] = 1

            if len(node["categories"]) > 1:
                if node["categories"][1] in node_dict:
                    node_dict[node["categories"][1]] += 1
                else:
                    node_dict[node["categories"][1]] = 1
    
    for edge in edges:
        if edge["value"] in edge_dict:
            edge_dict[edge["value"]] += 1
        else:
            edge_dict[edge["value"]] = 1
    
    return make_response(jsonify({"id": id, "timestamp": timestamp, "count_nodes":node_dict, "count_edges":edge_dict}))

if __name__ == "__main__":
    es_server.run(debug=True,
            host='0.0.0.0',
            port=3000)