import json
from posixpath import splitext
from NlpWorker import NlpWorker
from FileParser import FileParser
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def parse_text():
    try:
        file = request.files['file']
        _, file_extension = splitext(file.filename.lower())
        
        match file_extension:
            case '.txt':
                text = FileParser.txt_to_str(file)
            case '.rtf':
                text = FileParser.rtf_to_str(file)
            case '.json':
                text = file.read()
                data = json.loads(text)
                if 'sentence' in data and isinstance(data['sentence'], str) and 'chunks' in data and isinstance(data['chunks'], list):
                    return jsonify(data)
                return jsonify({"status": "error", "message": "Unsupported content type"}), 400
            case _:
                return jsonify({"status": "error", "message": "Unsupported content type"}), 400
        
        nlp_worker = NlpWorker(text)
        tree = nlp_worker.build_tree()
        chunks = nlp_worker.extract_info_from_tree(tree)
        data = { 'sentence': nlp_worker.sentence, 'chunks': chunks }

        return jsonify(data)
    except Exception as err:
        error_response = {"status": "error", "message": str(err)}
        return jsonify(error_response), 500

if __name__ == '__main__':
    app.run(debug=True)

