const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = prompt("Enter the Max Health Value", "100");
let chosenMaxLife = parseInt(enteredValue);
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, playerHealth, monsterHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalPlayerHealth: playerHealth,
    finalMonsterHealth: monsterHealth,
  };
  // Using Switch Case

  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = "Monster";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = "Player";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "Player";
      break;
    case LOG_EVENT_GAME_OVER:
      //  logEntry.target = "Player" ;
      break;
    default:
      logEntry = {}; //assigning an empty object
      break;
  }

  // Using If-Else

  // if (ev === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry = {
  //     event: ev,
  //     value: val,
  //     target: "MONSTER",
  //     finalPlayerHealth: playerHealth,
  //     finalMonsterHealth: monsterHealth,
  //   };
  // } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry.target = "Monster";
  // } else if (ev === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry.target = "Player";
  // } else if (ev === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry.target = "Player";
  // } else if (ev === LOG_EVENT_GAME_OVER) {
  //   // logEntry.target="Player";
  // }

  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  let initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentPlayerHealth,
    currentMonsterHealth
  );
  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("You would be dead but the Bonus Life saved you!!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Player Won",
      currentPlayerHealth,
      currentMonsterHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You Lost!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Monster Won",
      currentPlayerHealth,
      currentMonsterHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("You have a draw!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A Draw",
      currentPlayerHealth,
      currentMonsterHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  // let maxDamage;
  // let logEvent;
  // if (mode === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else if (mode === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentPlayerHealth, currentMonsterHealth);
  endRound();
}

function attackHandler() {
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("you can't heal to more than your max initial health");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentPlayerHealth,
    currentMonsterHealth
  );
  endRound();
}

function printLogHandler() {
  // Normal "FOR" Loop
  for (let i = 0; i < 3; i++) {
    console.log("----------");
  }
  // Normal "WHILE" Loop
  // let j = 0;
  // while (j < 3) {
  //   console.log(j);
  //   j++;
  // }

  // "DO - WHILE" Loop
  // let j = 0;
  // do {
  //   console.log(j);
  //   j++;
  // } while (j < 3);

  // Normal "FOR" Loop
  // for (let i = 0; i < battleLog.length; i++) {
  //   console.log(battleLog[i]);
  // }

  // "FOR - OF" Loop  //used for arrays Only
  let i = 0;
  for (const logEntry of battleLog) {
    console.log(`#${i}`);
    // "FOR - IN" Loop  //used for objects
    for (const key in logEntry) {
      console.log(` ${key} => ${logEntry[key]} `);
    }
    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
