let bombNumber = Math.floor(Math.random() * 100) + 1; // 生成一个1到100之间的随机数字作为炸弹  
let low = 1; // 猜测范围的下限  
let high = 100; // 猜测范围的上限  
let guesses = 0; // 记录猜测次数  
  
function checkGuess() {  
  const userGuess = parseInt(document.getElementById('guessInput').value, 10);  
  if (isNaN(userGuess) || userGuess < low || userGuess > high) {  
    return; // 如果输入无效，则不执行后续操作  
  }  
  guesses++;  
  const result = document.getElementById('result');  
  
  if (userGuess === bombNumber) {  
    result.innerHTML = `你死了！你踩到了炸弹！炸弹数字是${bombNumber} 你总共猜了${guesses}次。`;  
    result.style.color = 'red';  
    setTimeout(function(){location.href=location.href},1000)
    // 可以选择在这里重置游戏或显示其他信息  
  } else if (userGuess < bombNumber) {  
    low = userGuess + 1;  
    result.innerHTML = `太小了！请猜一个${low}到${high}之间的数字。`;  
  } else {  
    high = userGuess - 1;  
    result.innerHTML = `太大了！请猜一个${low}到${high}之间的数字。`;  
  }  
}  
  
function randomGuess() {  
  const randomNum = Math.floor(Math.random() * (high - low + 1)) + low; // 生成low到high之间的随机数  
  document.getElementById('guessInput').value = randomNum; // 将随机数设置到输入框中  
  checkGuess(); // 调用checkGuess函数来检查这个随机猜测  
}  
  
// 初始时禁用输入框，因为用户可以通过随机按钮来开始  
document.getElementById('guessInput').disabled = false;  