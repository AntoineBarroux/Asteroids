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



// Classe Observable : elle sera observée par le jeu pour réaliser les actions
// Elle possède un tableau de ses observers
var Observable = function(){
    this.observers = new Array();
};

// Objet en Javascript : on rajoute des méthodes au prototype de l'objet Controller
Observable.prototype = {

    // Permet d'inscrire un observeur à cet observable
    register: function(observer){
        this.observers.push(observer);
        return this;
    },

    // Permet de notifier aux observeurs l'action réalisée
    notifyObserver: function(action){
        $.each(this.observers, function(i, observer){
            observer.notify(action);
        });
    }
};




// Direction la direction de l'état initial, speed la vitesse initiale, closeEnnemies un
// tableau des ennemis les plus proches dans un cercle prédéterminé.
var State = function(direction, speed, closeEnnemies) {
    this.canShoot = true;
    this.direction = direction;
    this.speed = speed;
    this.closeEnnemies = closeEnnemies;
};

// Un état extends la classe Observable
State.prototype = new Observable;

