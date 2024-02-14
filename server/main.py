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
        print(file)
        _, file_extension = splitext(file.filename.lower())
        
        match file_extension:
            case '.txt':
                text = FileParser.txt_to_str(file)
            case '.rtf':
                text = FileParser.rtf_to_str(file)
            case _:
                return jsonify({"status": "error", "message": "Unsupported content type"}), 400
        
        worker = NlpWorker(text)
        tree = worker.build_tree()
        data = worker.extract_info_from_tree(tree)
        
        return data
    except Exception as err:
        error_response = {"status": "error", "message": str(err)}
        return jsonify(error_response), 500

if __name__ == '__main__':
    app.run(debug=True)

