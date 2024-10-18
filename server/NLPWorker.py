import time
import nltk
import inflect

nltk.download('wordnet')
nltk.download('punkt_tab')
nltk.download('averaged_perceptron_tagger_eng')

class NlpWorker:

    # Определение части речи по тегу
    @staticmethod
    def define_part_of_speech(tag):
        if tag.startswith('V'):
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
        lemma = lemmatizer.lemmatize(word, NlpWorker.define_part_of_speech(tag))
        
        # Приводим к единственному числу существительные
        if tag == 'NNS' or tag == 'NNPS':
            inflect_engine = inflect.engine()
            singular_form = inflect_engine.singular_noun(word)
            if singular_form:
                lemma = singular_form

        return lemma
    
    # Построение синтаксического дерева
    @staticmethod
    def build_tree(sentence):
        # Разбиение предложения на слова
        words = nltk.word_tokenize(sentence)
        
        # Определение частей речи для каждого слова
        start_time = time.time()
        pos_tags = nltk.pos_tag(words)
        end_time = time.time()
        pos_tags_time = end_time - start_time
        print(f"pos_tag took {pos_tags_time} seconds")

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
                lemma = NlpWorker.lemmatize(word, tag)
               
                return {'origin': word, 'tag': tag, 'lemma': lemma}
            
        data = [recursion(subtree) for subtree in tree]
        chunks = [item for item in data if 'role' in item]
        sorted_chunks = sorted(chunks, key=lambda x: x['words'][0]['origin'] if 'words' in x else x.get('origin', ''))
        
        return sorted_chunks

def test():
    # sentence = "The cat in the hat is sleeping."
    sentence = "I have an interesting book on the shelf."

    nlp_worker = NlpWorker(sentence)
    
    start_time = time.time()
    tree = nlp_worker.build_tree()
    end_time = time.time()
    build_tree_time = end_time - start_time
    print(f"build_tree took {build_tree_time} seconds")
    print(str(tree))
    tree.pretty_print()

    start_time = time.time()
    chunks = nlp_worker.extract_info_from_tree(tree)
    end_time = time.time()
    chunks_time = end_time - start_time
    print(f"extract_info_from_tree took {chunks_time} seconds")
    print('\n', chunks)
    
# test()