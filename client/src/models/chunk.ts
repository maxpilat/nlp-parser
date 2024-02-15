export enum PosTags {
  CC = 'Coordinating conjunction', // Сочинительный союз
  CD = 'Cardinal number', // Количественное числительное
  DT = 'Determiner', // Определитель (Артикль)
  EX = 'Existential there', // Существительное с неопределенным 'there'
  FW = 'Foreign word', // Иностранное слово
  IN = 'Preposition or subordinating conjunction', // Предлог или подчинительный союз
  JJ = 'Adjective', // Прилагательное
  JJR = 'Adjective, comparative', // Прилагательное, сравнительная степень
  JJS = 'Adjective, superlative', // Прилагательное, превосходная степень
  LS = 'List item marker', // Маркер элемента списка
  MD = 'Modal', // Модальный глагол
  NN = 'Noun, singular or mass', // Существительное, единственное число или масса
  NNS = 'Noun, plural', // Существительное, множественное число
  NNP = 'Proper noun, singular', // Имя собственное, единственное число
  NNPS = 'Proper noun, plural', // Имя собственное, множественное число
  PDT = 'Predeterminer', // Предопределитель
  POS = 'Possessive ending', // Притяжательная частица
  PRP = 'Personal pronoun', // Личное местоимение
  PRP$ = 'Possessive pronoun', // Притяжательное местоимение
  RB = 'Adverb', // Наречие
  RBR = 'Adverb, comparative', // Наречие, сравнительная степень
  RBS = 'Adverb, superlative', // Наречие, превосходная степень
  SYM = 'Symbol', // Символ
  TO = 'To', // Для (перед инфинитивом)
  UH = 'Interjection', // Междометие
  VB = 'Verb, base form', // Глагол в базовой форме
  VBD = 'Verb, past tense', // Глагол в прошедшем времени
  VBG = 'Verb, gerund or present participle', // Глагол, герундий или причастие настоящего времени
  VBN = 'Verb, past participle', // Глагол, причастие прошедшего времени
  VBP = 'Verb, non-3rd person singular present', // Глагол, форма настоящего времени, не третье лицо
  VBZ = 'Verb, 3rd person singular present', // Глагол, форма настоящего времени, третье лицо
  WDT = 'Wh-determiner', // Вопросительный предопределитель
  WP = 'Wh-pronoun', // Вопросительное местоимение
  WP$ = 'Possessive wh-pronoun', // Притяжательное вопросительное местоимение
  WRB = 'Wh-adverb', // Вопросительное наречие
}

export enum ChunkRoles {
  ADVP = 'Adverbial Phrase', // Обстоятельство
  PP = ' Prepositional Phrase', // Дополнение
  ADJP = 'Adjective Phrase', // Определение
  NP = 'Noun Phrase', // Подлежащее
  VP = 'Verb Phrase', // Сказуемое
}

export interface IWord {
  lemma: string;
  origin: string;
  tag: keyof typeof PosTags;
}

export interface IChunk {
  role: keyof typeof ChunkRoles;
  words: IWord[];
}
