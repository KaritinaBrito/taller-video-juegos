const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
//const botones
const btnUp = document.querySelector('#up');
const btnDown = document.querySelector('#down');
const btnRight = document.querySelector('#right');
const btnLeft = document.querySelector('#left');
const spanLive = document.querySelector('#lives')
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
const btnReload = document.querySelector('#btnReload');


let canvasSize;
let elementSize;
const playerPosition = {
    x: undefined,
    y: undefined,
};
const giftPosition = {
    x: undefined,
    y: undefined,
}

let bombPosition = [];
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;


window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);



function setCanvasSize (){    

    if(window.innerHeight > window.innerWidth){
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }
    canvasSize = Number(canvasSize.toFixed(0));
    canvas.setAttribute('width', canvasSize);
    canvas.setAttribute('height', canvasSize);

    elementSize= canvasSize/10;    

    playerPosition.x = undefined;
    playerPosition.y = undefined;

    startGame();
}
function startGame(){
    
    console.log({canvasSize, elementSize})

    game.font = elementSize + 'px Verdana'
    game.textAlign = 'end';
    
    const map = maps[level];

    if(!map){
        gameWin();
        return;
    }

    if(!timeStart){
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100)
        showRecord();
    }
    const mapRows = map.trim().split('\n');
    const mapRowsCols = mapRows.map(row => row.trim().split(''));
    //console.log({map, mapRows, mapRowsCols});


    showLives();
    bombPosition = [];
    game.clearRect(0,0,canvasSize, canvasSize);
    
    mapRowsCols.forEach((row, rowI) => {
        row.forEach((col, colI) =>{
            const emoji = emojis[col];
            const posX = elementSize * (colI+1);
            const posY = elementSize * (rowI+1);

            if(col == 'O'){
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log(playerPosition)
                }
            } else if(col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if(col == 'X'){
                bombPosition.push({
                    x: posX,
                    y: posY,
                });
            } 

            game.fillText(emoji, posX, posY)
            
        });
    });
    movePlayer();
}
function levelWin(){
    console.log('Subiste de nivel');
    level++;
    startGame();
}
function gameWin(){
    console.log('Terminaste el juego');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;

    if(recordTime){        
        if(recordTime >= playerTime){
            localStorage.setItem('record_time', playerTime);
            pResult.innerHTML = "Superaste el record!!!"
        } else {
            pResult.innerHTML ='No supertaste el tiempo record!';
        }
    } else {
        localStorage.setItem('record_time', playerTime);
        pResult.innerHTML = "Primer record!"
    }
    console.log({recordTime});
    
}
function showLives(){
    const heartArray = Array(lives).fill(emojis['HEART']);
    console.log(heartArray);

    spanLive.innerHTML = "";
    heartArray.forEach(heart => spanLive.append(heart));
    //spanLive.innerHTML = heartArray;
}
function showTime(){
    spanTime.innerHTML = Date.now() - timeStart;
    if(levelFail){
        
    }
}
function showRecord(){
    spanRecord.innerHTML = localStorage.getItem('record_time');
}
function levelFail(){
    lives--;   

    if(lives <= 0){       
        level = 0;
        lives = 3;
        timeStart = undefined;
    } 
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();

    
}

function movePlayer(){
    const giftColisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftColisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftColision = giftColisionX && giftColisionY;

    

    if(giftColision){
        levelWin();
    }     
    const bombColision = bombPosition.find(bomb => {
        const  bombColsionX = bomb.x.toFixed(3) == playerPosition.x.toFixed(3);
        const bombColisionY = bomb.y.toFixed(3) == playerPosition.y.toFixed(3);
        return bombColsionX && bombColisionY;
    });     

    if(bombColision){
        levelFail();
    } 

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    
}
// const bombColisionX = playerPosition.x == bombPosition.x;
// const bombColisionY = playerPosition.y == bombPosition.y;
// const bombColision = bombColisionX && bombColisionY;

window.addEventListener('keydown', movebyKeys);
btnUp.addEventListener('click', moveUp);
btnDown.addEventListener('click', moveDown);
btnRight.addEventListener('click', moveRight);
btnLeft.addEventListener('click', moveLeft);
btnReload.addEventListener('click', reload);


function movebyKeys(event){
    if(event.key == 'ArrowUp'){
        moveUp();
    }else if( event.key == 'ArrowLeft'){
        moveLeft();
    } else if(event.key == 'ArrowRight'){
        moveRight();
    } else if(event.key == 'ArrowDown'){
        moveDown(); 
    }
}
function moveUp(){
    console.log('Me quiero mover hacia arriba');

    if((playerPosition.y - elementSize) < elementSize){
        console.log('OUT');
    } else {
        playerPosition.y -= elementSize;
        startGame();
    }
   
}
function moveDown() {
    console.log('Me quiero mover hacia abajo');
    
    if ((playerPosition.y + elementSize) > canvasSize + 1) {
      console.log('OUT');
    } else {
      playerPosition.y += elementSize;
      startGame();
    }
  }
function moveRight(){
    console.log('Me quiero mover hacia a la derecha');
    if((playerPosition.x + elementSize) > canvasSize + 1){
        console.log('OUT');
    } else {
        playerPosition.x += elementSize; 
        startGame();
    }

};
function moveLeft(){
    console.log('Me quiero mover hacia a la izquierda');
    if((playerPosition.x - elementSize) < elementSize){
        console.log('OUT');
    } else {
        playerPosition.x -= elementSize;
        startGame();
    }
 
};
function reload(){
   if(btnReload){
    level = 0;
    lives = 3;
    timeStart = undefined;
   }
   playerPosition.x = undefined;
   playerPosition.y = undefined;
   startGame();
    
}
