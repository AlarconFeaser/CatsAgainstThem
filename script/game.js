window.onload = function(){
  
  var player_name = getPlayerName();

  var sheet = (function() {
	// Create the <style> tag
	var style = document.createElement("style");

	// WebKit hack :(
	 style.appendChild(document.createTextNode(""));

	// Add the <style> element to the page
	 document.head.appendChild(style);

	 return style.sheet;
  })();
  var movimgCSS = "img{position:absolute;-webkit-transition:all 0.1s ease-in-out;-moz-transition: all 0.1s ease-in-out -ms-transition: all 0.1s ease-in-out;-o-transition: all 0.1s ease-in-out;transition: all 0.1s ease-in-out}";
  sheet.insertRule(movimgCSS);

  class Entity{
    constructor(url, x, y){
    this.url = url;
    this.x = x;
    this.y = y;
    addimage(this.url, this.x, this.y)
  }

  move(x, y){
    if(this === cat){
      this.collide(x, y)
      this.animate(x, y);
      return true;
    }
    else if(!willCollide(x, y)){
      this.animate(x, y);
      return true;
    }
    return false;
  }

  animate(x, y) {
    var img = grid.rows[this.y].cells[this.x].childNodes[0];
    $(img).css("left", img.x).css("top", img.y);
    var newX = x == this.x ? x : x > this.x ? x + 100 : x - 100;
    var newY = y == this.y ? y : y > this.y ? y + 100 : y - 100;

    var oldX = x == this.x ? x : x > this.x ? x - 100 : x + 100;
    var oldY = y == this.y ? y : y > this.y ? y - 100 : y + 100;
    $(img).css("left", oldX).css("top", oldY);
    $(img).animate({
      top: y,
      left: x
    })

    grid.rows[this.y].cells[this.x].innerHTML = ""; //cleans the one where we moving
    this.y = y;
    this.x = x;
    addimage(this.url, this.x, this.y);
  }

  movedown(){
    if(this.y + 1 < gridHeight)
      this.move(this.x, this.y + 1)
  }

  moveup(){
    if(this.y - 1 >= 0)
      this.move(this.x, this.y - 1)
  }

  moveright(){
    if(this.x + 1 < gridWidth)
      this.move(this.x + 1, this.y)
  }

  moveleft(){
    if(this.x - 1 >= 0)
      this.move(this.x - 1, this.y)
  }

  collide(x, y){
    if(removeMouse(findArray(x, y, enemies))){
      updateScore("+", 50);
    }
    else if(removeEnemy(findArray(x, y, yarns), yarns)){
      updateScore("+", 100);
    }

    else if(removeEnemy(findArray(x, y, dogs), dogs)){
      updateScore("-", 50);
    }
  }


}

  class Controller{
  constructor(){
    this.keyListener = (event) => {
        var key_state = (event.type == "keyup")?true:false;
        switch (event.keyCode) {
          case 37:
          if(gameIsRunning)
            cat.moveleft();
            break;
          case 38:
          if(gameIsRunning)
            cat.moveup();
            break;
          case 39:
          if(gameIsRunning)
            cat.moveright();
            break;
          case 40:
          if(gameIsRunning)
            cat.movedown();
          break;
          case 32:
          if(!start){
            start = true;
            gameIsRunning = true;
            startGame();
          }
          break;
        }
    }
    window.addEventListener("keyup", () => {this.keyListener(event)})
  }
  }

  var gridScale = 100;
  var fullScreenGridWidth = Math.floor(window.innerWidth/gridScale);
  var fullScreenGridHeight = Math.floor(window.innerHeight/gridScale);

  var gridHeight = 7;
  var gridWidth = 8;
  var entitySize = 80;
  var enemies = [];
  var yarns = [];
  var dogs = [];
  var numberoOfEnemies = 5;

  var intervalArr = [];
  var grid = createGrid(gridHeight, gridWidth);

  var start = false;
  var pause = false;
  var cat = new Entity("assets/cat.png", 0, 0)
  var gameTime = 20;
  overlayOn("Welcome to CATS AGAINST THEM! " + player_name + "<br>Press SPACE to start ");
  var controller = new Controller();
  var score = 0;
  var spawnRandomlyInterval;

  var gameIsRunning;

  function restartEnemiesArrays(){}

  function spawnRandomly(){
    spawnMouse(Math.floor(Math.random() * gridWidth), Math.floor(Math.random() * gridHeight));
    spawn("assets/dog.png", Math.floor(Math.random() * gridWidth), Math.floor(Math.random() * gridHeight), dogs);
    spawn("assets/yarn.png", Math.floor(Math.random() * gridWidth), Math.floor(Math.random() * gridHeight), yarns);
  }

  function spawnMouse(x, y){
    if(!willCollide(x,y)){
      var i = enemies.push(new Entity("assets/mice.png", x, y)) - 1;
      intervalArr.push(setTimeout(walkAround(i), randomInterval()));
    }
  }

  function spawn(img_url, x, y, arr){
    if(!willCollide(x,y)){
      arr.push(new Entity(img_url, x, y));
    }
  }

  function startGame(player_name){
      overlayOff();
      addEnemies(numberoOfEnemies);
      spawnRandomlyInterval = setInterval(spawnRandomly, 5000);
      start_timer(gameTime);
  }

  function pause(){
    //Should stop
  }

  function unpause(){

  }

  function updateScore(op, num){
    if(op == "+") score+= num;
    else score -= num;

    document.getElementById("player_score").innerHTML=score;
  }

  function endGame(){
    clearInterval(spawnRandomlyInterval);
    for(var i = 0; i < enemies.length; i++){
      clearInterval(intervalArr[i]); 
    }
    gameIsRunning = false;
    start = false;
    overlayOn("You got a total of : " + score + " points." + "<br>" +
              "Press SPACE to START AGAIN"
    );

  }

  function start_timer(sec){
    var sec = sec;
    var timer = setInterval(function(){
        var time;
        if(sec < 10)
          time = '00:0'+sec;
        else
          time = '00:'+sec;

        document.getElementById("timer").innerHTML= time;
        sec--;
        if (sec < 0) {
            clearInterval(timer);
            endGame();
        }

    }, 1000);
  }


  function removeEnemy(index, arr){
    if(arr[index] != undefined){
      grid.rows[arr[index].y].cells[arr[index].x].innerHTML = ""; //cleans the one where we moving
      arr[index] = undefined;
      return true;
    }
    return false;
  }

  function removeMouse(index){
    if(enemies[index] != undefined){
      grid.rows[enemies[index].y].cells[enemies[index].x].innerHTML = ""; //cleans the one where we moving
      enemies[index] = undefined;
      clearInterval(intervalArr[index]);
      return true;
    }
    return false;
  }

  function findArray(x, y, arr){
    var index = undefined;
    for(var i = 0; i < arr.length; i++){
        if(arr[i] != undefined){
          if(arr[i].x == x && arr[i].y == y){
            index = i;
          }
        }
    }
    return index;
  }

  function addEnemies(num){
    for(var i = 1; i < num + 1 ; i++){
      spawnMouse(Math.floor(Math.random() * gridWidth), Math.floor(Math.random() * gridHeight));
    }
  }


//AI FUNCTIONS

  function walkAround(i){

    if (enemies[i] == undefined) return;
    var random = Math.floor(Math.random() * 5 )

    if(random == 0){
      enemies[i].moveleft();
    }
    else if(random == 1){
      enemies[i].moveright();
    }
    else if(random == 2){
      enemies[i].movedown();
    }

    else if(random = 3){
      enemies[i].moveup();
    }

    intervalArr[i] = setTimeout((function(){walkAround(i)}).bind(i), randomInterval())
  }

  function moveEnemies(i){
    for(var i = 0; i < enemies.length; i++){
      intervalArr.push(setTimeout(walkAround(i), randomInterval()));
    }
  }

//GRID FUNCTIONS

  function createGrid(numx, numy){
    var table = document.createElement("TABLE");
    table.setAttribute("id", "game-grid");
    document.getElementById("content").appendChild(table);
    for(var x = 0; x < numx; x++){
      var row = document.createElement("TR");
      row.setAttribute("id", "row_"+x);
      document.getElementById("game-grid").appendChild(row);

      for(var y =0; y < numy; y++){
        var column = document.createElement("TD");
        column.style.background = "orange";
        column.style.height = gridScale+'px';
        column.style.width  = gridScale+'px';
        document.getElementById("row_"+x).appendChild(column);
      }
    }
    return table;
  }

  function willCollide(x, y){
    return nextCellLength(x,y) != 0
  }

  function nextCellLength(x, y){
    return grid.rows[y].cells[x].childNodes.length > 0
  }

// GRAPHIC FUNCTIONS
  function addimage(url, x, y){
    var div = document.createElement('div');
    div.setAttribute('id', 'img-wrapper');
    var img = document.createElement('img');
    img.src = url;
    img.width = 50;
    img.height = 50;
    div.appendChild(img);
    grid.rows[y].cells[x].appendChild(div);
  }

}

//TIMING FUNCTIONS

function randomInterval(){
  return Math.random() * 500 + 500;
}
