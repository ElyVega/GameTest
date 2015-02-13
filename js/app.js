var GameTest = GameTest || {};
GameTest.isStarted = false;
GameTest.gameField;
//Game essence is that the field is a square, so the COLUMN constant is not needed as well as the number of tiles in general
GameTest.TILES_COUNT_IN_ROW = 3;
GameTest.EMPTY_TILE_MARK = 0;
GameTest.COMPUTER_MARK = -1;
GameTest.USER_MARK = 1;
GameTest.TILE_NUMBER_IN_ID = 4;
{
    document.getElementById('buttonStart').onclick = function(){
		if (GameTest.isStarted) return;
		GameTest.onStart();
		this.className = 'buttonPassive';
		document.getElementById('buttonNewGame').className = 'buttonActive';
	}
	document.getElementById('buttonNewGame').onclick = function(){
		if (!GameTest.isStarted) return;
		GameTest.onNewGame();
		this.className = 'buttonPassive';
		document.getElementById('buttonStart').className = 'buttonActive';			
	}	
	for (var i = 0; i < Math.pow(GameTest.TILES_COUNT_IN_ROW, 2); i++){
		document.getElementById('cell' + i).onclick = function(){				
			if ((GameTest.isStarted)&&(this.innerText == '')) GameTest.onTileClick(this);
		}
	}
}
GameTest.onStart = function(){
	with(GameTest){
		if (!isStarted){
			isStarted = true;
			tilesReset();			
			log('Game began');
		}
	}
}
GameTest.onNewGame = function(){
	with(GameTest){
		refreshGameField();
		document.getElementById('logsText').innerHTML = '';
		isStarted = false;
	}
}
GameTest.onTileClick = function(currentTile){	
	currentTile.innerText = 'X';
	with(GameTest){
		var tileNumber = parseInt(currentTile.id.split('')[TILE_NUMBER_IN_ID]);				
		var x = parseInt(tileNumber / TILES_COUNT_IN_ROW);
		var y = tileNumber % TILES_COUNT_IN_ROW;				
		gameField[x][y] = USER_MARK;
		log('User: ' + (x + 1) + ', ' + (y + 1));
		var nextAction = checkGameField();
		var KEY = 0;
		var X_COORD = 1;
		var Y_COORD = 2;
		//new game after user win\loss by requirements is considered as just a new game, not as a function of "New game"
		switch(nextAction[KEY])
		{
			case 'UserWon':{
				log('User won');						
				refreshGameField();
				log('New game began');
				return;
			}
			case 'ComputerTurn':{
				computerTurn(nextAction[X_COORD], nextAction[Y_COORD]);
				return;
			}
			case 'ComputerWon':{
				computerTurn(nextAction[X_COORD], nextAction[Y_COORD]);
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
GameTest.log = function(text){
	document.getElementById('logsText').innerHTML += text + '\n';
	document.getElementById('logsText').scrollTop = document.getElementById('logsText').scrollHeight;
}
GameTest.refreshGameField = function(){
	with(GameTest){
		for (var i = 0; i < Math.pow(TILES_COUNT_IN_ROW, 2); i++){
			document.getElementById('cell' + i).innerText = '';
		}
		tilesReset();
	}
}
GameTest.tilesReset = function(){
	with(GameTest){
		gameField = [];
		for (var i = 0; i < TILES_COUNT_IN_ROW; i++){
			gameField[i] = [];
			for (var j = 0; j < TILES_COUNT_IN_ROW; j++){
				gameField[i][j] = EMPTY_TILE_MARK;
			}
		}
	}
}
GameTest.computerTurn = function(x, y){
	with(GameTest){
		gameField[x][y] = COMPUTER_MARK;
		var cellId = 'cell' + ((x * TILES_COUNT_IN_ROW) + y);
		document.getElementById(cellId).innerText = 'O';
		log('Computer: ' + (x + 1) + ', ' + (y + 1));
	}
}
GameTest.seekEmptyTiles = function(){
	var result = [];
	with(GameTest){
		for (var i = 0; i < TILES_COUNT_IN_ROW; i++){
			for (var j = 0; j < TILES_COUNT_IN_ROW; j++)
			if (gameField[i][j] == EMPTY_TILE_MARK) result.push([i, j]);
		}
	}
	return result;
}
GameTest.checkGameField = function(){
	var computerWon = [];
	var computerNextTurn = [];	
	var sumDiagonal_0 = 0;
	var sumDiagonal_1 = 0;
	with(GameTest){
		for (var i = 0; i < TILES_COUNT_IN_ROW; i++){
			var sumRow = 0;
			var sumCol = 0;
			//Check vertical and horizontal sum. Computer points are negative, User points are positive for readability can be divided into two cycles - 1 for horizontal sum, 2 for vertical
			for (var j = 0; j < TILES_COUNT_IN_ROW; j++){
				sumRow += gameField[i][j];				
				sumCol += gameField[j][i];			
			}
			if ((sumRow == TILES_COUNT_IN_ROW)||(sumCol == TILES_COUNT_IN_ROW)){
				return ['UserWon'];
			}
			//Victory is near
			if ((Math.abs(sumRow) == TILES_COUNT_IN_ROW - 1)||(Math.abs(sumCol) == TILES_COUNT_IN_ROW - 1)){
				for (var j = 0; j < TILES_COUNT_IN_ROW; j++){
					if (gameField[i][j] == EMPTY_TILE_MARK){
						if (sumRow == -(TILES_COUNT_IN_ROW) + 1) computerWon = ['ComputerWon', i, j];
						if (sumRow == TILES_COUNT_IN_ROW - 1) computerNextTurn = ['ComputerTurn', i, j];
					}
					if (gameField[j][i] == EMPTY_TILE_MARK){
						if (sumCol == -(TILES_COUNT_IN_ROW) + 1) computerWon = ['ComputerWon', j, i];
						if (sumCol == TILES_COUNT_IN_ROW - 1) computerNextTurn = ['ComputerTurn', j, i];
					}
				}
			}		
			sumDiagonal_0 += gameField[i][i];
			sumDiagonal_1 += gameField[TILES_COUNT_IN_ROW - 1 - i][i];
		}
		if ((sumDiagonal_0 == TILES_COUNT_IN_ROW)||(sumDiagonal_1 == TILES_COUNT_IN_ROW)) return ['UserWon'];
		if (computerWon.length != 0) return computerWon;
		//Victory is near by diagonal
		if ((Math.abs(sumDiagonal_0) == TILES_COUNT_IN_ROW - 1)||(Math.abs(sumDiagonal_1) == TILES_COUNT_IN_ROW - 1)){
			for (var i = 0; i < TILES_COUNT_IN_ROW; i++){
				if ((gameField[i][i] == EMPTY_TILE_MARK)&&(sumDiagonal_0 == -(TILES_COUNT_IN_ROW) + 1)) return ['ComputerWon', i, i];			
				if ((gameField[TILES_COUNT_IN_ROW - 1 - i][i] == EMPTY_TILE_MARK)&&(sumDiagonal_1 == -(TILES_COUNT_IN_ROW) + 1)) return ['ComputerWon', TILES_COUNT_IN_ROW - 1 - i, i];
				if ((gameField[i][i] == 0)&&(sumDiagonal_0 == TILES_COUNT_IN_ROW - 1)) computerNextTurn = ['ComputerTurn', i, i];			
				if ((gameField[TILES_COUNT_IN_ROW - 1 - i][i] == 0)&&(sumDiagonal_1 == TILES_COUNT_IN_ROW - 1)) computerNextTurn = ['ComputerTurn', TILES_COUNT_IN_ROW - 1 - i, i];
			}
		}
		//Block for user victory
		if (computerNextTurn.length != 0) return computerNextTurn;
		//Key tile - center
		if (gameField[parseInt(TILES_COUNT_IN_ROW / 2)][parseInt(TILES_COUNT_IN_ROW / 2)] == 0) return ['ComputerTurn', parseInt(TILES_COUNT_IN_ROW / 2), parseInt(TILES_COUNT_IN_ROW / 2)];
		var computerTurnVariables = seekEmptyTiles();	
		if (computerTurnVariables.length == 0) return ['DrawnGame'];
		var selectedVariable = Math.floor(Math.random() * computerTurnVariables.length);
		var X_COORD = 0;
		var Y_COORD = 1;
		return ['ComputerTurn', computerTurnVariables[selectedVariable][X_COORD], computerTurnVariables[selectedVariable][Y_COORD]];
	}
}					