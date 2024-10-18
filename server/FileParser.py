from striprtf.striprtf import rtf_to_text

class FileParser:
    @staticmethod
    def txt_to_str(file) -> str:
        text = file.read().decode('utf-8')
        return text
    
    @staticmethod
    def rtf_to_str(file) -> str:
        file_content = file.read().decode('utf-8')
        text = rtf_to_text(file_content)
        return text
    
    @staticmethod
    def split_into_sentences(text: str):
        sentences = [sentence.strip() for sentence in text.split('.') if sentence.strip()]
        return sentences
