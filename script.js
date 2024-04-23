// script.js
import perguntasDB from './perguntas_db.js';

let indicePerguntaAtual = 0;
let tempo = 10;
let intervalo;
let respostaPosicao = 'a'; // Variável para rastrear a posição da resposta correta

const elementoCronometro = document.querySelector('.cronometro');
const elementoPergunta = document.querySelector('.texto-pergunta');
const respostasElementos = {
    a: document.querySelector('#parte-superior .texto-resposta'),
    b: document.querySelector('#parte-inferior .texto-resposta')
};

// Inicializa os elementos de áudio
const correctSound = new Audio('correct-answer.mp3');
const tickSound = new Audio('tick.mp3');

function tocarSomVerificado() {
    correctSound.currentTime = 0; // Reseta o tempo do áudio para garantir que toque do início
    correctSound.play();
}

function pararSomTick() {
    tickSound.pause();
    tickSound.currentTime = 0; // Reseta o tempo do áudio
}

function destacarRespostaCorreta(respostaSelecionada) {
    clearInterval(intervalo); // Para o cronômetro
    pararSomTick(); // Para o som de tick

    respostasElementos.a.parentElement.classList.remove('correta');
    respostasElementos.b.parentElement.classList.remove('correta');

    const respostaCorreta = perguntasDB[indicePerguntaAtual].correta;
    const respostaCorretaElemento = respostaPosicao === respostaCorreta ? respostasElementos.a.parentElement : respostasElementos.b.parentElement;
    respostaCorretaElemento.classList.add('correta');
    const iconeVerificado = document.createElement('span');
    iconeVerificado.classList.add('icone-verificado', 'fas', 'fa-check');
    respostaCorretaElemento.appendChild(iconeVerificado);
    iconeVerificado.style.display = 'block';

    tocarSomVerificado(); // Toca o som de verificado

    if (respostaSelecionada && respostaSelecionada.dataset.resposta !== respostaCorreta) {
        respostaSelecionada.classList.add('incorreta');
    }

    setTimeout(() => {
        respostaCorretaElemento.classList.remove('correta');
        if (respostaSelecionada) {
            respostaSelecionada.classList.remove('incorreta');
        }
        iconeVerificado.remove();
        irParaProximaPergunta();
    }, 2000);
}

function tempoEsgotado() {
    destacarRespostaCorreta(null);
}

function iniciarContador() {
    tempo = 10;
    elementoCronometro.textContent = tempo;
    pararSomTick(); // Garante que o som de tick está parado antes de começar
    intervalo = setInterval(() => {
        if (tempo > 0) {
            tempo--;
            elementoCronometro.textContent = tempo;
            if (tempo > 0) { // Toca o som de tick se ainda houver tempo
                tickSound.play();
            }
        } else {
            tempoEsgotado();
        }
    }, 1000);
}

function mostrarPergunta() {
    const pergunta = perguntasDB[indicePerguntaAtual];
    elementoPergunta.textContent = pergunta.pergunta;
    if (Math.random() < 0.5) {
        respostaPosicao = 'a';
        respostasElementos.a.textContent = pergunta.respostas.a;
        respostasElementos.b.textContent = pergunta.respostas.b;
    } else {
        respostaPosicao = 'b';
        respostasElementos.a.textContent = pergunta.respostas.b;
        respostasElementos.b.textContent = pergunta.respostas.a;
    }
    iniciarContador(); // Inicia o contador assim que a pergunta é mostrada
}

function clicarResposta(evento) {
    const respostaSelecionada = evento.target.closest('.resposta');
    destacarRespostaCorreta(respostaSelecionada);
}

function irParaProximaPergunta() {
    indicePerguntaAtual++;
    if (indicePerguntaAtual < perguntasDB.length) {
        mostrarPergunta();
    } else {
        console.log("Quiz concluído!");
        // Aqui você pode redirecionar para uma página de pontuação ou mostrar resultados
    }
}

document.querySelectorAll('.resposta').forEach(resposta => {
    resposta.addEventListener('click', clicarResposta);
});

export function iniciarQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    if (quizContainer) {
        quizContainer.style.display = 'block';
        mostrarPergunta(); // Mostra a primeira pergunta e inicia o contador
    } else {
        console.error('O elemento #quiz-container não foi encontrado no DOM.');
    }
}

// Chamada de função quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    iniciarQuiz();
    // Carrega os sons para garantir que eles estejam prontos para serem tocados
    correctSound.load();
    tickSound.load();
});
