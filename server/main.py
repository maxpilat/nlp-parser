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
                text = FileParser.txt_to_str(file)
            case '.rtf':
                text = FileParser.rtf_to_str(file)
            case '.json':
                text = file.read()
                data = json.loads(text)

                if isinstance(data, dict) and 'words' in data and 'sentences' in data:
                    return jsonify(data)
                return jsonify({"status": "error", "message": "Unsupported content type"}), 400
            case _:
                return jsonify({"status": "error", "message": "Unsupported content type"}), 400

        sentences = FileParser.split_into_sentences(text)
        result = []

        for sentence in sentences:
            tree = NlpWorker.build_tree(sentence)
            chunks = NlpWorker.extract_info_from_tree(tree)
            result.append({
                'sentence': sentence,
                'chunks': chunks,
                'tree': str(tree)
            })

        translations = NlpWorker.translate(text)

        return jsonify({
            'sentences': result,
            'words': translations
        })
    except Exception as err:
        error_response = {"status": "error", "message": str(err)}
        return jsonify(error_response), 500


if __name__ == '__main__':
    app.run(debug=True)
