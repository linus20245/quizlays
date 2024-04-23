// start.js
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  if (startButton) {
    startButton.addEventListener('click', () => {
      // Redireciona para a página do quiz
      window.location.href = 'quiz.html'; // Certifique-se de que o caminho para o quiz.html está correto
    });
  } else {
    console.error('O botão de início não foi encontrado no DOM.');
  }
});
