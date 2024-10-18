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
        
        # Определение текста в зависимости от типа файла
        match file_extension:
            case '.txt':
                sentences = FileParser.txt_to_str(file)
            case '.rtf':
                sentences = FileParser.rtf_to_str(file)
            case '.json':
                text = file.read()
                data = json.loads(text)

                print(data)
                
                if isinstance(data, list) and len(data) > 0 and all(
                    'sentence' in item and isinstance(item['sentence'], str) and
                    'chunks' in item and isinstance(item['chunks'], list) and
                    'tree' in item and isinstance(item['tree'], str)
                    for item in data
                ): return jsonify(data)
                return jsonify({"status": "error", "message": "Unsupported content type"}), 400
            case _:
                return jsonify({"status": "error", "message": "Unsupported content type"}), 400
        
        # Обработка каждого предложения с помощью NlpWorker
        nlp_worker = NlpWorker()
        result = []

        for sentence in sentences:
            tree = nlp_worker.build_tree(sentence)
            chunks = nlp_worker.extract_info_from_tree(tree)
            result.append({
                'sentence': sentence,
                'chunks': chunks,
                'tree': str(tree)
            })

        # Возвращаем список объектов
        return jsonify(result)
    except Exception as err:
        error_response = {"status": "error", "message": str(err)}
        return jsonify(error_response), 500

if __name__ == '__main__':
    app.run(debug=True)
