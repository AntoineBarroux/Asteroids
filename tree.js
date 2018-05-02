//Définition de la structure d'un noeud

function Node(parent, board, action) {
	this.parent = parent; //Noeud parent, null si racine
	this.children = {}; //Noeuds enfants, liste vide à la création du noeud
	this.action = action; //L'action qui a menée au noeud, null si racine
	this.board = board; //Etat actuel du jeu
	this.visits = 0; //Nombre de fois que le noeud a été visité
	this.wins = 0; //Nombre de fois que le noeud a mené à une victoire
	this.c = Math.sqrt(2); //Paramètre d'exploration, à tunner (dans la théorie égal à sqrt(2))

	//Fonction qui permet de calculer le score UCB qui permet de trouver un compromis entre exploration et exploitation
	this.UCB = function () {
		return this.ratio() + this.c*Math.sqrt(Math.log(parent.visits)/this.visits);
	}

	//Fonction qui permet de calculer le ratio wins/visits
	this.ratio = function () {
		return this.wins/this.visits;
	}



}