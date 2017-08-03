app = angular.module("quizlet");

app.factory("questions", function() {

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  var selected_questions = [];

  for (category in questions) {

    var used_questions = [];

    for (i = 0; i < 1; i++) {
      var selected_index = 0;

      do {
        selected_index = Math.floor(Math.random() * questions[category].length);
      }while($.inArray(selected_index, used_questions) != -1);

      var question = {
        question: questions[category][selected_index],
        category: category
      };

      used_questions.push(selected_index);

      selected_questions.push(question);
    }

    used_questions = [];
  }

  shuffle(selected_questions);

  return {
    length: function() { return selected_questions.length; },
    getCategories: function () {
      return Object.keys(questions);
    },
		getQuestion: function(id) {
			if(id < selected_questions.length) {
				return selected_questions[id];
			} else {
				return false;
			}
		}
  };
});

var questions = {
  Naturalista:[
    "O mundo de plantas e animais é importante para mim",
    "Eu gosto de animais de estimação",
    "Eu gosto de aprender sobre a natureza",
    "Gosto de cuidar das minhas plantas em casa",
    "Gosto de caça e pesca",
    "Gosto de caminhar em lugares naturais",
    "Fico ansioso ao visitar o zoológico"
  ],
 Musical:[
   "A música é muito importante para mim na vida diária",
   "Tenho amplos e variados interesses musicais, incluindo clássicos e contemporâneos",
   "Eu tenho um bom senso de afinação, tempo e ritmo",
   "Minha educação musical começou quando eu era mais jovem e continua ainda hoje",
   "Eu sou bom em tocar um instrumento e cantar",
   "Lembro-me a melodia de uma canção quando perguntado",
   "Orgulho-me de minhas realizações musicais"
 ],
  "Lógico-matemática":[
    "Usar números e símbolos numéricos é fácil para mim",
    "Costumo desenvolver equações para descrever relacionamentos e / ou para explicar minhas observações",
    "Muitas vezes vejo sentidos matemáticos no mundo em torno de mim",
    "Matemática sempre foi uma das minhas aulas favoritas",
    "Eu gosto de pensar sobre questões numéricas e examinar as estatísticas",
    "Eu costumo entender as coisas ao meu redor através de um sentido matemático",
    "Gosto de solucionar quebra-cabeças"
  ],
  //Existencial:[],
  Interpessoal:[
    "Eu sinto que as pessoas de todas as idades gostam de mim",
    "Eu gosto de estar com todos os diferentes tipos de pessoas",
    "Eu respondo a todas as pessoas com entusiasmo, livre de viés ou preconceito",
    "Gosto de situações sociais novas ou únicas",
    "Gosto de elogiar os outros quando eles fizeram bem",
    "Sou rápido para sentir nos outros desonestidade e desejo de me manipular",
    "Sinto-me seguro quando estou com estranhos"
  ],
  "Cinética":[
    "Eu me considero um atleta",
    "Eu gosto de estar fisicamente apto",
    "Eu tenho um bom equilíbrio e coordenação olho-mão e me sinto convortável em esportes que usam uma bola",
    "Minha coordenação me destaca em atividades de alta velocidade",
    "Gosto de estar ao ar livre, apreciar a mudança de estações, e fico ansioso para diferentes atividades físicas  em cada estação",
    "Eu gosto da emoção da competição pessoal e da equipe",
    "Eu gosto de me movimentar muito"
  ],
  "Linguística":[
    "Eu me orgulho de ter um grande vocabulário",
    "Eu gosto de aprender novas palavras e faço isso facilmente",
    "Gosto de ler e leio diariamente",
    "Gosto de ouvir discursos desafiadores",
    "Eu gosto de manter um diário de minhas experiências",
    "Eu leio e aprecio a poesia e, ocasionalmente, escrevo a minha própria",
    "Eu falo muito e gosto de contar histórias",
  ],
  Intrapessoal:[
    "Costumo procurar fraquezas em mim que eu vejo nos outros",
    "Muitas vezes penso sobre a influência que tenho sobre os outros",
    "Eu acredito que eu sou responsável por meus atos e quem eu sou",
    "Eu tento não perder meu tempo com perseguições triviais",
    "Muitas vezes penso sobre os problemas em minha comunidade, estado e / ou mundo e que eu posso fazer para ajudar a corrigir qualquer um deles",
    "Eu sou sempre totalmente honesto comigo mesmo",
    "Eu gosto de estar sozinho e pensar sobre a minha vida"
  ],
  Espacial:[
    "Eu sempre sei onde estou em relação à minha casa",
    "Eu não me perco facilmente e posso me orientar tanto com mapas ou marcos",
    "Sei direções com facilidade",
    "Eu tenho a capacidade de representar o que eu vejo pelo desenho ou pintura",
    "Minha capacidade de desenhar é reconhecida e elogiada por outros",
    "Eu posso facilmente duplicar cor, forma, sombreamento e textura no meu trabalho",
    "Ver as coisas em três dimensões é fácil para mim, e eu gosto de fazer as coisas em três dimensões"
  ]
}
