from striprtf.striprtf import rtf_to_text

class FileParser:
    @staticmethod
    def txt_to_str(file):
        text = file.read().decode('utf-8')
        return FileParser.split_into_sentences(text)
    
    @staticmethod
    def rtf_to_str(file):
        file_content = file.read().decode('utf-8')
        text = rtf_to_text(file_content)
        return FileParser.split_into_sentences(text)
    
    @staticmethod
    def split_into_sentences(text: str):
        sentences = [sentence.strip() for sentence in text.split('.') if sentence.strip()]
        return sentences
