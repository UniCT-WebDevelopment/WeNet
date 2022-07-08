from flask import Flask, json, jsonify
import requests
from datetime import datetime
SPACY_ADDRESS = "http://spacy:8088/entities"

PubMedApi = Flask(__name__)

f = open('articles_bulk.json')
data_readed = json.load(f)
i = -1

#return a document from the bulk
@PubMedApi.route("/getData")
def getData():
    global i
    global data_readed

    i += 1
    try:
        article = data_readed[i]
        text_full_text = article['full_text']['text']
        for item in article['full_text']['sections']:
            text_full_text += item['text']
        query = {
            "text": text_full_text,
    }
    except:
        print("error at pulling document")
    
        
    try:
        query = { "pmcid": "string" , "text" : query['text']}
        resp = requests.post(url=SPACY_ADDRESS, json=query) 
        data = resp.json()
        nodesDict = []
        source = []

        for item in data['nodes']:
            nodesDict.append({"name" : item, "text": data['nodes'][item]['text'], "categories": data['nodes'][item]['categories'], "wid":data['nodes'][item]['wid'], "rho":data['nodes'][item]['rho'], "start_pos": data['nodes'][item]["start_pos"], "end_pos": data['nodes'][item]["end_pos"] }) 
        
        for item in data['sentences']:
            for edge in item['edges']:
                source.append({"source": edge['src_pos'], "target": edge['dst_pos'], "value": edge['edge_name'], "start_pos": item["start_pos"], "end_pos": item["end_pos"]}) #end_pos
        
        temp_dict = {"timestamp": datetime.now().isoformat(),"nodes": nodesDict, "links": source, "full_text": text_full_text }
   
        return  json.dumps(temp_dict) 
    
    except:
        print("errore")
        return
    

    


if __name__ == "__main__":
    PubMedApi.run(debug=True,
            host='0.0.0.0',
            port=9000)