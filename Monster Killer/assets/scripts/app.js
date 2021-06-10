const PLAYER_ATTACK_VALUE = 10;
const PLAYER_STRONG_ATTACK_VALUE = 20;
const MONSTER_ATTACK_VALUE = 15;
const HEAL_VALUE = 15;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

function getMaxLifeValue(){
    const enteredValue = prompt('Max life of you and monster.','100');
    const parsedValue = parseInt(enteredValue);
    if(isNaN(parsedValue) || parsedValue <= 0)
        throw {message: 'Invalid user input. Not a number!!!'};

    return(parsedValue);
}

let chosenMaxLife;

try{
    chosenMaxLife = getMaxLifeValue();
}catch(error){
    console.log(error);
    chosenMaxLife = 100;
    alert('You entered something wrong, default value of 100 is in use.');
}

let battleLog = [];
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

output(chosenMaxLife,chosenMaxLife);
adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth){
    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    };
    if((event === LOG_EVENT_PLAYER_ATTACK) || (event === LOG_EVENT_PLAYER_STRONG_ATTACK)){
        logEntry.target = 'MONSTER';
    }else if((event === LOG_EVENT_MONSTER_ATTACK) || (event === LOG_EVENT_PLAYER_HEAL)){
        logEntry.target = 'PLAYER';
    }// Here not checking for Game Over Log as no target setting
    battleLog.push(logEntry);
}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;

    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );

    if(currentPlayerHealth <= 0 && hasBonusLife)
    {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert("You would be dead but bonus life saved you!");
    }

    output(parseInt(currentMonsterHealth),parseInt(currentPlayerHealth));

    if(currentMonsterHealth <= 0 && currentPlayerHealth > 0)
    {
        alert("YOU WON !!!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
        reset();
    }
    else if(currentPlayerHealth <= 0 && currentMonsterHealth > 0)
    {
        alert("YOU LOST !!!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        );
        reset();
    }
    else if(currentMonsterHealth <= 0 && currentPlayerHealth <= 0)
    {
        alert("MATCH DRAW !!!");
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        );
        reset();
    }
}

function attack(mode){
    let maxDamage;
    let logEvent;
    if(mode === MODE_ATTACK){
        maxDamage = PLAYER_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    }else if(mode === MODE_STRONG_ATTACK){
        maxDamage = PLAYER_STRONG_ATTACK_VALUE;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    const monsterDamage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= monsterDamage;
    writeToLog(
        LOG_EVENT_PLAYER_ATTACK,
        monsterDamage,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function simpleAttack(){
    attack(MODE_ATTACK);
}

function strongAttack(){
    attack(MODE_STRONG_ATTACK);
}

function healPlayer(){
    let healValue;
    if(currentPlayerHealth === chosenMaxLife)
    {
        alert("You can't heal more than your max life.");
    }
    else if(currentPlayerHealth >= chosenMaxLife - HEAL_VALUE)
    {
        healValue = chosenMaxLife - currentPlayerHealth;
    }
    else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlayerHealth += healValue;
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth
    );
    endRound();
}

function printLogHandler(){
    console.log(battleLog);
}

attackBtn.addEventListener('click',simpleAttack);
strongAttackBtn.addEventListener('click',strongAttack);
healBtn.addEventListener('click',healPlayer);
logBtn.addEventListener('click',printLogHandler);