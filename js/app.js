var isStarted = false;
var gameField;
window.onload = function(){
    document.getElementById('buttonStart').onclick = function(){
        if (!isStarted){
            isStarted = true;
			tilesReset();
			this.className = 'buttonPassive';
			document.getElementById('buttonNewGame').className = 'buttonActive';
            log('Game began');
		}
	}
    var tiles = document.getElementsByTagName('td');
    for (var i = 0; i < tiles.length; i++){
        tiles[i].onclick = function(){
            if ((isStarted)&&(this.innerText == '')){
                this.innerText = 'X';
                var tileNumber = parseInt(this.id.split('')[4]);
				var x = parseInt(tileNumber / 3);
				var y = tileNumber % 3;
				gameField[x][y] = 1;
                log('User: ' + (x + 1) + ', ' + (y + 1));
				var nextAction = checkGameField();
				switch(nextAction[0])//new game after user win\loss by requirements is considered as just a new game, not as a function of "New game"
				{
					case 'UserWon':{
						log('User won');						
						refreshGameField();
						log('New game began');
						return;
					}
					case 'ComputerTurn':{
						computerTurn(nextAction[1], nextAction[2]);						
						return;
					}
					case 'ComputerWon':{
						computerTurn(nextAction[1], nextAction[2]);
						log('Computer won');						
						refreshGameField();
						log('New game began');
						return;
					}
					case 'DrawnGame':{
						log('Drawn game');						
						refreshGameField();
						log('New game began');
					}
				}
			}
		}
	}
    document.getElementById('buttonNewGame').onclick = function(){
		if (!isStarted) return;
        refreshGameField();
		document.getElementById('logsText').innerHTML = '';
		this.className = 'buttonPassive';
		document.getElementById('buttonStart').className = 'buttonActive';
		isStarted = false;
		
	}    
}
function log(text){
    document.getElementById('logsText').innerHTML += text + '\n';
	document.getElementById('logsText').scrollTop = document.getElementById('logsText').scrollHeight;
}
function refreshGameField(){
	var tiles = document.getElementsByTagName('td');
	for (var i = 0; i < tiles.length; i++){
		tiles[i].innerText = '';
	}
	tilesReset();
}
function tilesReset(){
	gameField = [];
	for (var i = 0; i < 3; i++){
		gameField[i] = [];
		for (var j = 0; j < 3; j++){
			gameField[i][j] = 0;
		}
	}
}
function computerTurn(x, y){
	gameField[x][y] = -1;
	var cellId = 'cell' + ((x * 3) + y);
	document.getElementById(cellId).innerText = 'O';
	log('Computer: ' + (x + 1) + ', ' + (y + 1));
}
function seekEmptyTiles(){
	var result = [];
	for (var i = 0; i < 3; i++){
		for (var j = 0; j < 3; j++)
		if (gameField[i][j] == 0) result.push([i, j]);
	}
	return result;
}
function checkGameField(){
	var computerWon = [];
	var computerTurn = [];
	var userWon = false;	
	var sumDiagonal_0 = 0;
	var sumDiagonal_1 = 0;
	for (var i = 0; i < 3; i++){
		var sumRow = 0;
		var sumCol = 0;
		for (var j = 0; j < 3; j++){
			sumRow += gameField[i][j];
			sumCol += gameField[j][i];			
		}
		if ((sumRow == 3)||(sumCol == 3)){//User won
			return ['UserWon'];
		}
		if (sumRow == -2){//Computer almost won
			for (var j = 0; j < 3; j++){
				if (gameField[i][j] == 0){
					computerWon = ['ComputerWon', i, j];
				}
			}
		}
		if (sumCol == -2){//Computer almost won
			for (var j = 0; j < 3; j++){
				if (gameField[j][i] == 0){
					computerWon = ['ComputerWon', j, i];
				}
			}
		}
		if (sumRow == 2){//User almost won
			for (var j = 0; j < 3; j++){
				if (gameField[i][j] == 0){
					computerTurn = ['ComputerTurn', i, j];
				}
			}
		}
		if (sumCol == 2){//User almost won
			for (var j = 0; j < 3; j++){
				if (gameField[j][i] == 0){
					computerTurn = ['ComputerTurn', j, i];
				}
			}
		}
		sumDiagonal_0 += gameField[i][i];
		sumDiagonal_1 += gameField[2 - i][i];
	}
	if ((sumDiagonal_0 == 3)||(sumDiagonal_1 == 3)){//User won by diagonal
		return ['UserWon'];
	}
	if (computerWon.length != 0) return computerWon;
	if (sumDiagonal_0 == -2){//Computer almost won by diagonal
		for (var i = 0; i < 3; i++){
			if (gameField[i][i] == 0){
				return ['ComputerWon', i, i];
			}
		}
	}
	if (sumDiagonal_1 == -2){//Computer almost won by diagonal
		for (var i = 0; i < 3; i++){
			if (gameField[2 - i][i] == 0){
				return ['ComputerWon', 2 - i, i];
			}
		}
	}
	if (sumDiagonal_0 == 2){//User almost won by diagonal
		for (var i = 0; i < 3; i++){
			if (gameField[i][i] == 0){
				computerTurn = ['ComputerTurn', i, i];
			}
		}
	}
	if (sumDiagonal_1 == 2){//User almost won by diagonal
		for (var i = 0; i < 3; i++){
			if (gameField[2 - i][i] == 0){
				computerTurn = ['ComputerTurn', 2 - i, i];
			}
		}
	}	
	if (computerTurn.length != 0) return computerTurn;//Block for user winning
	if (gameField[1][1] == 0) return ['ComputerTurn', 1, 1];//Key tile
	var computerTurnVariables = seekEmptyTiles();
	if (computerTurnVariables.length == 0) return ['DrawnGame'];
	var selectedVariable = Math.floor(Math.random() * computerTurnVariables.length);
	return ['ComputerTurn', computerTurnVariables[selectedVariable][0], computerTurnVariables[selectedVariable][1]];
}