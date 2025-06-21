let container = document.getElementById("container");
let scoreboard = document.getElementById("scoreboard");
let score = document.getElementById("score");
let lives = document.getElementById("lives");
let heart = document.getElementById("heart");
let bee = document.getElementById("bee");
let message = document.getElementById("message");
let beeY = parseInt(window.getComputedStyle(bee).top, 10);
let maxY = 480 - 32;
let containerWidth = container.offsetWidth;
let margin = 20;
let beeFrame = 0;
let bgPositionX = 0;
let flowers = ["purple-flower", "pink-flower", "red-flower"];
let movingFlowers = [];


//Aktív az oldal?
let isPageVisible = true;

document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
});

//A méhecske fel-le mozgatása
addEventListener("keydown", (event)=>{
    if(event.key === "ArrowUp"){
        beeY -= 10;
    }else if(event.key === "ArrowDown"){
        beeY += 10;
    }
    
    if(beeY < margin){
        beeY = margin;
    }else if(beeY > maxY-margin){
        beeY = maxY - margin;
    }

    bee.style.top = beeY + "px";
})

//Méhecske fel-le mozgatása ujjal
container.addEventListener("touchstart", (event) => {
    const containerRect = container.getBoundingClientRect();
    const touchY = event.touches[0].clientY - containerRect.top; 
    let containerHeight = container.offsetHeight;

    if (touchY < containerHeight / 2) {
        beeY -= 10;
    } else {
        beeY += 10;
    }

    if (beeY < margin) {
        beeY = margin;
    } else if (beeY > maxY - margin) {
        beeY = maxY - margin;
    }

    bee.style.top = beeY + "px";
});

//A méhecske szárnycsapkodása
setInterval(() => {
    beeFrame++;
    if(beeFrame > 2){
        beeFrame = 0;
    }
    bee.style.backgroundPosition = `${-beeFrame * 32}px 0px`;
}, 100)

//Darázs szárnycsapkodása
let waspFrame = 0;

setInterval(() => {
    waspFrame++;
    if (waspFrame > 2) {
        waspFrame = 0;
    }

    const wasps = document.querySelectorAll('.wasp');
    wasps.forEach(wasp => {
        wasp.style.backgroundPosition = `${-waspFrame * 2}px 0px`;
    });
}, 100);

//Háttérkép mozgatása
const bacgroundMovement = setInterval(() => {
    bgPositionX -= 1;
    if(bgPositionX <= -800){
        bgPositionX = 0;
    }

    container.style.backgroundPosition = `${bgPositionX}px 0`
}, 30)

//Pontszerző virágok
function createFlower(){
    if (!isPageVisible) return;
    let margin = 20;
    let maxY = 480 - 40;
    let randomNum = Math.floor(Math.random() * (maxY - 2 * margin)) + margin;;
    let miniRandomNum = Math.floor(Math.random()*3);
    let choosenFlower = `images/${flowers[miniRandomNum]}.png`;
    let flower = document.createElement("div");
    flower.classList.add("flower");
    flower.style.left = (containerWidth - 30) + "px";
    flower.style.top= randomNum + `px`;
    flower.style.backgroundImage = `url(${choosenFlower})`;
    container.appendChild(flower);
    movingFlowers.push(flower);
}

const flowerCreationInterval = setInterval(createFlower, 3000);

const flowerMovementInterval = setInterval(() => {
    for(let i = movingFlowers.length - 1; i >= 0; i--){
        let flower = movingFlowers[i];
        let currentLeft = parseInt(flower.style.left);
        flower.style.left = `${currentLeft - 2}px`;

        if (currentLeft < 0) {
        container.removeChild(flower);
        movingFlowers.splice(i, 1);
    }
    }
    checkCollision();
    
}, 30);



//Veszélyes dolgok megjelenítése random
let dangers =["mushroom", "wasp"];
let movingDanger =[];

function createDanger(){
    if (!isPageVisible) return;
    let margin = 20;
    let maxY = 480 - 40;
    let randomNum = Math.floor(Math.random() * (maxY - 2 * margin)) + margin;;
    let miniRandomNum = Math.floor(Math.random()*2);
    let choosenDanger = `images/${dangers[miniRandomNum]}.png`;
    let danger = document.createElement("div");
    if(choosenDanger.includes("wasp")){
        danger.classList.add("wasp");
    }
    danger.classList.add("danger");
    danger.style.left= (containerWidth - 30) + "px";
    danger.style.top= randomNum + `px`;
    danger.style.backgroundImage = `url(${choosenDanger})`;
    container.appendChild(danger);
    movingDanger.push(danger);
}

const dangerCreationInterval = setInterval(createDanger, 3500);

const dangerMovementInterval = setInterval(() => {
    for(let i = movingDanger.length - 1; i >= 0; i--){
        let danger = movingDanger[i];
        let currentLeft = parseInt(danger.style.left);
        danger.style.left = `${currentLeft - 2}px`;

        if (currentLeft < 0) {
        container.removeChild(danger);
        movingDanger.splice(i, 1);
    }
    }
    checkCollisionDanger();
    
}, 30);



//Pont frissítése pontszerzés esetén
let points = 0;

function checkCollision(){
    for(let i = movingFlowers.length-1; i >= 0; i--){
        let flower = movingFlowers[i];

        const beeRect = bee.getBoundingClientRect();
        const flowerRect = flower.getBoundingClientRect();

        if (
            beeRect.left < flowerRect.right &&
            beeRect.right > flowerRect.left &&
            beeRect.top < flowerRect.bottom &&
            beeRect.bottom > flowerRect.top
        ) {
            container.removeChild(flower);
            movingFlowers.splice(i, 1);
            points++;
            score.innerHTML = `Points: ${points}`;
            if(points === 20){
                message.innerText = "You win!";
                message.style.visibility = "visible";
                clearInterval(flowerCreationInterval);
                clearInterval(flowerMovementInterval);
                clearInterval(dangerCreationInterval);
                clearInterval(dangerMovementInterval);
                clearInterval(bacgroundMovement);
            }
        }
    }

    for(let i = movingDanger.length-1; i >= 0; i--){
        let danger = movingDanger[i];

        const beeRect = bee.getBoundingClientRect();
        const dangerRect = danger.getBoundingClientRect();

        if (
            beeRect.left < dangerRect.right &&
            beeRect.right > dangerRect.left &&
            beeRect.top < dangerRect.bottom &&
            beeRect.bottom > dangerRect.top
        ) {
            container.removeChild(danger);
            movingDanger.splice(i, 1);
            
            const hearts = lives.querySelectorAll(".heart");
            if(hearts.length > 0){
                const lastHeart = hearts[hearts.length-1];
                lives.removeChild(lastHeart);
            }
            

            if(lives.querySelectorAll(".heart").length === 0){
                message.innerText = "Game over!";
                message.style.visibility = "visible";
                clearInterval(flowerCreationInterval);
                clearInterval(flowerMovementInterval);
                clearInterval(dangerCreationInterval);
                clearInterval(dangerMovementInterval);
                clearInterval(bacgroundMovement);
            }
        }
    }

}

//Új játék
let restart = document.getElementById("restart");

restart.addEventListener("click", ()=>{
    location.reload();
})
