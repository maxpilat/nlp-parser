import nltk
import inflect

class NlpWorker:
    def __init__(self, sentence):
        self.download_nltk_data()
        self.sentence = sentence
        self._tree = None

    # Загрузка дополнительных данных для nltk
    @staticmethod
    def download_nltk_data():
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt', quiet=True)
        try:
            nltk.data.find('taggers/averaged_perceptron_tagger')
        except LookupError:
            nltk.download('averaged_perceptron_tagger', quiet=True)
        try:
            nltk.data.find('corpora/wordnet')
        except LookupError:
            nltk.download('wordnet', quiet=True)
    
    # Определение части речи по тегу
    @staticmethod
    def get_pos_by_tag(tag):
        if tag.startswith('N'):
            return nltk.corpus.wordnet.NOUN
        elif tag.startswith('V'):
            return nltk.corpus.wordnet.VERB
        elif tag.startswith('R'):
            return nltk.corpus.wordnet.ADV
        elif tag.startswith('J'):
            return nltk.corpus.wordnet.ADJ
        return nltk.corpus.wordnet.NOUN
    
    # Лемматизация слова
    @staticmethod
    def lemmatize(word, tag):
        lemmatizer = nltk.WordNetLemmatizer()
        lemma = lemmatizer.lemmatize(word, NlpWorker.get_pos_by_tag(tag))

        # Приводим к единственному числу существительные
        if tag == 'NNS' or tag == 'NNPS':
            inflect_engine = inflect.engine()
            singular_form = inflect_engine.singular_noun(word)
            if singular_form:
                lemma = singular_form

        return lemma
    
    # Построить синтаксическое дерево
    def build_tree(self):
        # Разбиение предложения на слова
        words = nltk.word_tokenize(self.sentence)

        # Определение частей речи для каждого слова
        pos_tags = nltk.pos_tag(words)

        # Определение синтаксических правил для синтаксического анализа
        grammar = r"""
            ADVP: {<RB.*>(<CC>?<RB.*>)*|<IN><DT><NN.*>}  # Обстоятельство
            PP: {<IN><DT>?<NN.*>}  # Дополнение
            ADJP: {<JJ.*>(<CC>?<JJ.*>)*}  # Определение
            NP: {<DT>?<NN.*|PRP>+}  # Подлежащее
            VP: {<MD>?<VB.*>+<RB>?}  # Сказуемое
        """
        chunk_parser = nltk.RegexpParser(grammar)

        # Применение синтаксического анализатора к частям речи
        tree = chunk_parser.parse(pos_tags)
        return tree
    
    # Конвертация дерева в список объектов
    @staticmethod
    def extract_info_from_tree(tree):
        def recursion(subtree):
            if isinstance(subtree, nltk.Tree):
                # Если узел является деревом, рекурсивно обрабатываем его поддеревья
                role = subtree.label()
                words = [recursion(child) for child in subtree]
                return {'role': role, 'words': words}
            else:
                # Если узел является листом, добавляем информацию о слове и теге в список
                word = subtree[0].lower()
                tag = subtree[1]
                return {'origin': word, 'tag': tag, 'lemma': NlpWorker.lemmatize(word, tag)}
            
        data = [recursion(subtree) for subtree in tree]
        chunks = [item for item in data if 'role' in item]
        sorted_chunks = sorted(chunks, key=lambda x: x['words'][0]['origin'] if 'words' in x else x.get('origin', ''))
        
        return sorted_chunks

def test():
    # sentence = "The cat in the hat is sleeping."
    sentence = "I have an interesting book on the shelf."

    nlp_worker = NlpWorker(sentence)

    tree = nlp_worker.build_tree()
    tree.pretty_print()

    info = nlp_worker.extract_info_from_tree(tree)
    print('\n', info)

# test()