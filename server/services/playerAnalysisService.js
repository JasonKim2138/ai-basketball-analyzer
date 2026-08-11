function analyzePlayer(player) {
  const starter = getStarterStatus(player);

  const grade = getGrade(player);

  const message = getMessage(player);

  return ({
    player: player,
    starter,
    grade,
    message,
  });
}

function getStarterStatus(player) {

  let starter = "Bench player";

  if (player.points >= 25 && player.assists >= 5 && player.rebounds >= 3) {
      starter = "Starter";
  }
  else if (player.points >= 25) {
    starter = "Starter";
  }
  else if (player.assists <= 7) {
    starter = "Bench player";

  }
  else if (player.rebounds >= 10) {
    starter = "Start player";
  }

  return (starter)
}

function getGrade(player){
  let grade = "D";
  if (player.points >= 30 && player.assists >= 7 && player.rebounds >= 5){
    grade = "S";
  } 
  else if (player.points >= 30 && (player.assists < 7 || player.rebounds < 5)){
    grade = "A";
  }
  else if (player.points < 30 && player.assists >= 7 && player.rebounds >= 5){
    grade = "B";
  }
  else if (player.points < 30 && player.assists < 7 && player.rebounds < 5){
    grade ="C";
  }
  else {
    grade = "D";
  }

  return (grade);
}

function getMessage(player){
  let message = "message";
  if (player.points >= 30 && player.assists >= 7 && player.rebounds >= 5){
    message = "Amazing!";
  } 
  else if (player.points >= 30 && (player.assists < 7 || player.rebounds < 5)){
    message = "Good!";
  }
  else if (player.points < 30 && player.assists >= 7 && player.rebounds >= 5){
    message = "Average";
  }
  else if (player.points < 30 && player.assists < 7 && player.rebounds < 5){
    message ="Need some work";
  }
  else {
    message = "Need a lot of improvement";
  }

  return (message);
}

module.exports = {
  analyzePlayer
};