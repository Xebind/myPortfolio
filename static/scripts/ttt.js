//Global Variables

var canvas;
var context;
var user;

let X = 'X';
let O = "O";
let EMPTY = '';

const imgsize = 200;

var fireimg = new Image();
fireimg.src ="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
fireimg.width = imgsize;
fireimg.height = imgsize;
var waterimg = new Image();
waterimg.src ="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"
waterimg.width = imgsize;
waterimg.height = imgsize;

let initialboard = [
  [EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY],
];

let currentboard = initialboard;

function Game(player){
   user = player;
}

function clearboard(){
      currentboard = [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    ];
}

function GameStart(){
  document.getElementById("Xbutton").style.display = 'none';
  document.getElementById("Obutton").style.display = 'none';
  document.getElementById("message").innerHTML =  'I dare you to beat my Alakazam in a game of TicTacToe. <br>Beware! He can read your mind!<br><br> Press any key to return to the main menu.';

  clearboard();
  canvas = document.getElementById("tttcanvas"); //finds canvas element
  canvas.style.display = "block";
  context = canvas.getContext("2d"); //HTML5 Object with many paths for drawing
  size = canvas.offsetWidth;
  square = Math.floor(size/3);
  context.font = '64px serif';

    for (let i = 0; i < 3; i++){
     for (let j = 0; j < 3; j++){
       context.clearRect(square * i, square * j, square, square);
     }
  }

  /*if (user != X || user != O){
    let user = X;
  }*/

  drawGameGrid();
  if ( user == O){
    nextmove(currentboard);
  }

}

  function drawGameGrid () {
    //White Background
    context.beginPath();
    context.rect(0, 0, 600, 600);
    context.fillStyle = "white";
    context.fill();

    //Line 1
    context.beginPath();
    context.moveTo(square, 0); //defines starting point of line 1
    context.lineTo(square, 600); //ending point of line 1
    context.stroke();
    //Line 2
    context.beginPath();
    context.moveTo(square * 2, 0);
    context.lineTo(square * 2, 600);
    context.stroke();
    //Line 3
    context.beginPath();
    context.moveTo(0, square);
    context.lineTo(600, square);
    context.stroke();
    //Line 4
    context.beginPath();
    context.moveTo(0, square*2);
    context.lineTo(600, square*2);
    context.stroke();
  }

  function player(board){
    let Xcount = 0;
    let Ocount = 0;
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (board[i][j] == X){
          Xcount = Xcount + 1;
        }
        if (board[i][j] == O){
          Ocount = Ocount + 1;
        }
      }
    }
    if (Xcount > Ocount){
      return O;
    }
    else{
      return X;
    }
  }

  function actions(board){
    let actions = [];
      for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
          if (board[i][j] == EMPTY){
            actions.push([i,j]);
          }
        }
      }
    return actions;
  }

  function PokeDraw(board, position){
    if (player(board) == X){
      context.drawImage(fireimg,  square * position[0] + square / 3, square * position[1] + square/4);
    }
    else{
      context.drawImage(waterimg,  square * position[0] + square / 3, square * position[1] + square/4);
    }
  }

  function mousePressed(){
    console.log(currentboard);
    if (terminal(currentboard)){

   GameStart();

      return;
    }
    if (player(currentboard) == user){
      let position = storeGuess(event);
      let tile = Cords2Tiles(position);
      if (currentboard[tile[0]][tile[1]] == EMPTY){
        PokeDraw(currentboard, tile);
        //context.fillText(player(currentboard), square * tile[0] + square / 3, square * tile[1] + square/2 + square/4);
        currentboard[tile[0]][tile[1]] = player(currentboard);
        nextmove(currentboard);
      }
    }
  }

    function Cords2Tiles([CordX,CordY]){
      var boardi = 0;
      var boardj = 0;
      for (let i = 0; i < 3; i++){
        if (CordX < (i + 1) * size / 3 && CordX > (i) * size / 3){
          boardi = i;
        }
        if (CordY < (i + 1) * size / 3 && CordY > (i) * size / 3){
          boardj = i;
        }
      }
      return [boardi, boardj];
    }

    function storeGuess(event) {
      var x = event.offsetX;
      var y = event.offsetY;

      return [x,y];

    }

  function nextmove(board){
    //let myactions = actions();
    //console.log(myactions);
    //const action = myactions[Math.floor(Math.random() * myactions.length)];
    //console.log(action);
    if (!terminal(board)){
      let optimal = minimax(board);
      PokeDraw(board, optimal);
      //context.fillText(player(currentboard), square * optimal[0] + square / 3, square * optimal[1] + square/2 + square/4);
      board[optimal[0]][optimal[1]] = player(board);
    }
    if (terminal(board)){

      let win = winner(board);
      if (win == null){
        document.getElementById("message").innerHTML +=  '<br><br> Game is a tie!';
      }
      else if (win == user){
        document.getElementById("message").innerHTML +=   '<br><br> You win the game!';
      }
      else{
        document.getElementById("message").innerHTML +=  '<br><br> Alakazam wins the game!';
      }
      document.getElementById("Xbutton").style.display = 'block';
      document.getElementById("Obutton").style.display = 'block';

    }
    //board[action[0]][action[1]] = player();

  }

  function winner(board){
    for (let i = 0; i < 3; i++){
      if (board[i][0] == "O" && board[i][1] == "O" && board[i][2] == "O"){
        return O;
      }
      else if (board[0][i] == "O" && board[1][i] == "O" && board[2][i] == "O"){
        return O;
      }
      else if (board[i][0] == "X" && board[i][1] == "X" && board[i][2] == "X"){
        return X;
      }
      else if (board[0][i] == "X" && board[1][i] == "X" && board[2][i] == "X"){
        return X;
      }
    }
    if (board[0][0] == "O" && board[1][1] == "O" && board[2][2] == "O"){
      return O;
    }
    else if (board[0][2] == "O" && board[1][1] == "O" && board[2][0] == "O"){
      return O;
    }
    else if (board[0][0] == "X" && board[1][1] == "X" && board[2][2] == "X"){
      return X;
    }
    else if (board[0][2] == "X" && board[1][1] == "X" && board[2][0] == "X"){
      return X;
    }
    return null;
  }

  function terminal(board){
    let win = winner(board);
    if (win == X || win == O){
      //document.getElementById("tttmessage").style.display = 'block';
      //document.getElementById("tttmessage").innerHTML =  'wins the game!';
      return true;
    }
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (board[i][j] == EMPTY){
          return false;
        }
      }
    }
    //document.getElementById("tttmessage").style.display = 'block';
    //document.getElementById("tttmessage").innerHTML = 'Game is a Tie!';

    return true;
  }

  function utility(board){
    let win = winner(board);
    if (win == X){
      return 1;
    }
    else if (win == O){
      return -1;
    }
    else{
      return 0;
    }
  }

  function result(board, action){
    //code for a "deepcopy" of our board
    let copyboard =  [
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
    [EMPTY, EMPTY, EMPTY],
  ];
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        copyboard[i][j] = board[i][j];
      }
    }

    copyboard[action[0]][action[1]] = player(board);
    //console.log(copyboard);
    return copyboard;

  }



  function MaxValue(board){
    if (terminal(board)){
      return utility(board);
    }
    else{
      let v = - Infinity;
      let myactions = actions(board);
      for (let i = 0; i < myactions.length; i++){
        v = Math.max(v, MinValue(result(board, myactions[i])));
      }
      return v;
    }
  }
  function MinValue(board){
    if (terminal(board)){
      return utility(board);
    }
    else{
      let v = Infinity;
      let myactions = actions(board);
      for (let i = 0; i < myactions.length; i++){
        v = Math.min(v, MaxValue(result(board, myactions[i])));
      }
      return v;
    }
  }

  function minimax(board){
    //code for player O
    if (player(board) == O){
      let v = Infinity;
      let myactions = actions(board);
      let optimal = myactions[0];
      for (let i = 0; i < myactions.length; i++){
        let actionvalue = MaxValue(result(board, myactions[i]));
        if (actionvalue ==  -1){
          //return myactions[i];
        }
        if (actionvalue < v){
          optimal = myactions[i];
          v = MaxValue(result(board, myactions[i]));
        }
      }
      return optimal;
    }
    else{
      //As any first move is expected to tie playing optimally, just randomize the first move to be quicker
      if (emptyboard(board)){
        return [Math.floor(Math.random() * 3),Math.floor(Math.random() * 3)];
      }
      let v = - Infinity;
      let myactions = actions(board);
      let optimal = myactions[0];
      for (let i = 0; i < myactions.length; i++){
        let actionvalue = MinValue(result(board, myactions[i]));
        if (actionvalue ==  1){
          //return myactions[i];
        }
        if (actionvalue > v){
          optimal = myactions[i];
          v = MinValue(result(board, myactions[i]));
        }
      }
      return optimal;
    }
  }

  function emptyboard(board){
     for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (board[i][j] == O || board[i][j] == X){
          //console.log(board[i][j]);
          return false;
        }
      }
    }
    return true;
  }
