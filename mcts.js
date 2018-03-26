// Les codes clavier associés aux actions du jeu. L'algo doit renvoyer une de ces clés pour faire agir
// le vaisseau.
KEY_CODES = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    70: 'f',
    71: 'g',
    72: 'h',
    77: 'm',
    80: 'p'
};

SET_CODES = [32, 37, 38, 39, 40];

const NB_ACTIONS = 5;

// Méthode permettant de faciliter la génération de nombres entiers aléatoires
function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

// Méthode permettant de récupérer la taille d'un objet (= son nombre de propriétés)
function size(obj){
    var size = 0;
    var key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}






// L'objet MCTS qui correspond à l'algorithme de Monte Carlo. Il possède un listener qui est le jeu associé et permettra d'envoyer les décisions qu'il
// aura prise à chaque frame.
var Mcts = function(listener){
    this.listener = listener;
};

// La méthode notify permettra d'envoyer l'action à réaliser au listener
Mcts.prototype.notify = function(action){
    this.listener.notify(action);
};

Mcts.prototype.generate = function(sprites, score){
    var index = getRandomInt(NB_ACTIONS);

    var currentSprites = [];
    var sprite;
    for (var i = 0; i < Game.sprites.length; i++) {
        sprite = sprites[i];
        if (sprite.visible){
            currentSprites.push(sprite);
            if (sprite.name == 'ship'){
                if (sprite.bulletCounter <= 0) console.log('canShoot');
                else console.log('can\'t shoot');
            }
        }
    }




    //console.log(sprites);
    //this.notify(SET_CODES[0]);
};



// Direction la direction de l'état initial, speed la vitesse initiale, closeEnnemies un
// tableau des ennemis les plus proches dans un cercle prédéterminé.
var State = function(direction, speed, closeEnnemies) {
    this.canShoot = true;
    this.direction = direction;
    this.speed = speed;
    this.closeEnnemies = closeEnnemies;
};


