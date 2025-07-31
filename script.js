document.getElementById("startBtn").addEventListener("click", iniciarJuego);
document.getElementById("rollDiceBtn").addEventListener("click", lanzarDado);

let vueltasX = 0;
let vueltasY = 0;
let numJugadores = 0;
let jugadores = [];
let turnoActual = 0;

const colores = [
  "#ff6565", "#ffaf65", "#f0ff65", "#91ff65", "#77dd77", "#779ecb", "#ff6961",
  "#fdfd96", "#aec6cf", "#b39eb5", "#966fd6", "#03c03c", "#ffb347", "#c23b22", "#f49ac2"
];

const retosPorCasilla = [
  "", // 0 (fuera del tablero)
  "La persona que está a tu derecha debe tomar un trago", // 1
  "Juega piedra, papel o tijera", // 2
  "Reto", // 3
  "El que no tome es mk", // 4
  "Verdad o reto?", // 5
  "Los virgenes", //6 
  "Los que nacieron de<br>Enero a Junio", // 7
  "Los hombres", // 8
  "Tira el dado<br>Tomas en impar", // 9
  "El que no tome es mk", // 10 
  "Peor experiencia sexual?", // 11
  "Los que no son virgenes", // 12
  "Todos toman menos tú", // 13 
  "Los que nacieron de<br>Julio a Diciembre", // 14
  "Tira el dado<br>Tomas en par", // 15
  "Muestra la ultima foto de tu galeria", // 16
  "El que no tome es mk", // 17 
  "Las mujeres", // 18
  "Beso del mismo sexo<br>(elijen los jugadores)", // 19
  "Simon dice...<br>con beso", // 20
  "Mejor experiencia sexual?", // 21
  "El que no tome es mk", // 22
  "Los LGBTQ+ toman", // 23
  "Vuelve a salida", // 24
  "Los solteros", // 25
  "Baile sexy<br>(elijen los jugadores)", // 26
  "Lamer una zona<br>(elijen los jugadores)", // 27
  "Carcel<br>No juegas una ronda", // 28
  "Hora de rapear", // 29
  "El que no tome es mk", // 30
  "5 minutos en el paraíso<br>(elijen los jugadores)", // 31
  "Reto", // 32
  "Ojos vendados<br>Beso al que encuentres", // 33
  "Retrocede 10 casillas", // 34
  "Gime delante de todos ", // 35
  "Susurra algo atrevido<br>(elijen los jugadores)", // 36
  "Señala al que crees que la tiene más grade y más pequeña", // 37
  "Has la demostración de un oral", // 38
  "Beso a ciegas y adivina quién es", // 39 
  "El que no tome es mk", // 40
  "Retrocede una casilla antes del jugador más lejos de la meta", // 41
  "Manda nude a alguien del grupo para ver una sola vez", // 42 
  "Has la postura sexual más votada", // 43
  "Beso de 3<br>(elijen los jugadores)", // 44 
  "Tira el dado<br>tomas el número que salga", // 45 
  "Todo o nada<br>toma o quitate una prenda", // 46
  "Haz 10 sentadillas", // 2
  "Cuenta un chisme", // 3
  "Baila 10 segundos", // 4
  "Toma dos tragos", // 5
  "Haz una imitación", // 6
  "¡Final! Ganaste" // 47 (winner)
];

const shotsPorCasilla = [
  0, // 0 (fuera del tablero)
  1, // 1 
  1, // 2 
  2, // 3 (reto)
  1, // 4 (todos)
  2, // 5 
  1, // 6 
  1, // 7
  1, // 8 
  1, // 9 
  1, // 10 (todos) 
  2, // 11 (virgenes 3)
  1, // 12
  1, // 13 (todos menos tú)
  1, // 14
  1, // 15
  2, // 16
  1, // 17 (todos)
  1, // 18
  3, // 19
  3, // 20
  2, // 21 (virgenes 3)
  1, // 22 (todos)
  1, // 23
  0, // 24
  1, // 25
  2, // 26
  2, // 27
  0, // 28 (carcel)
  2, // 29
  1, // 30 (todos)
  3, // 31
  3, // 32
  3, // 33
  0, // 34
  3, // 35
  4, // 36
  0, // 37
  4, // 38
  4, // 39 
  1, // 40 (todos)
  0, // 41
  4, // 42
  4, // 43
  4, // 44
  1-6, // 45
  5, // 46 (todo o nada)
  0,  // 47 (winner, por ejemplo)
];

function iniciarJuego() {
  const select = document.getElementById("numPlayers");
  numJugadores = parseInt(select.value, 10);

  if (isNaN(numJugadores) || numJugadores < 3 || numJugadores > 15) {
    mostrarMensajeTemporal("Selecciona entre 3 y 15 jugadores.");
    return;
  }

  // Inicializa jugadores
  jugadores = [];
  for (let i = 0; i < numJugadores; i++) {
    jugadores.push({
      color: colores[i],
      posicion: 0,
      shots: 0 // Nuevo: contador de shots
    });
  }
  turnoActual = 0;

  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let i = 1; i <= 46; i++) {
    const casilla = document.createElement("div");
    casilla.classList.add("casilla");
    casilla.dataset.numeroOriginal = i;
    casilla.innerHTML = `<span class="numero-casilla">${i}</span>`;
    board.appendChild(casilla);
  }

  const winner = document.createElement("div");
  winner.classList.add("casilla", "winner");
  winner.textContent = "¡winner!";
  board.appendChild(winner);

  document.getElementById("inicio").style.display = "none";
  document.getElementById("game").style.display = "flex";
  document.getElementById("dice-container").style.display = "flex";
  document.querySelector("h1").style.display = "none";

  actualizarFichasTablero();

  mostrarMensajeTemporal(`¡El juego ha comenzado!`);
}

function mostrarMensajeTemporal(texto){
    const mensaje = document.getElementById("message");
    mensaje.textContent = texto;
    mensaje.style.display = "block";
    mensaje.style.opacity = "1";

    setTimeout(() => {
        mensaje.style.opacity = "0";
        setTimeout(() => {
        mensaje.style.display = "none";
        }, 300);
    }, 1000);
}

function lanzarDado() {
  const cube = document.getElementById("cube");
  const numeroFinal = Math.floor(Math.random() * 6) + 1;
  vueltasX += 720;
  vueltasY += 720;
  girarCubo(numeroFinal, cube);

  let nuevaPos = jugadores[turnoActual].posicion + numeroFinal;
  if (nuevaPos > 47) nuevaPos = 47;

  let casilla;
  if (nuevaPos === 0) {
    casilla = document.getElementById("fichas-jugadores");
  } else if (nuevaPos === 47) {
    casilla = document.querySelector('.winner');
  } else {
    casilla = document.querySelectorAll('.casilla')[nuevaPos - 1];
  }

  let fichasEnCasilla = 0;
  if (casilla) {
    fichasEnCasilla = casilla.querySelectorAll('.ficha').length;
  }

  if (fichasEnCasilla >= 3) {
    mostrarMensajeTemporal("¡Casilla llena! Vuelve a tirar.");
    return;
  }

  setTimeout(() => {
    jugadores[turnoActual].posicion = nuevaPos;
    actualizarFichasTablero();

    // Si llegó a la casilla final, termina el juego
    if (nuevaPos === 47) {
      mostrarResumenFinal();
      return;
    }

    // Mostrar reto solo si no es la salida ni la casilla winner
    if (nuevaPos > 0 && nuevaPos <= 47) {
      mostrarModalReto(nuevaPos);
    } else {
      turnoActual = (turnoActual + 1) % jugadores.length;
    }
  }, 800);
}

function girarCubo(num, cube) {
  const rotaciones = [
    "rotateX(0deg) rotateY(0deg)",      // 1
    "rotateX(0deg) rotateY(180deg)",    // 2
    "rotateX(0deg) rotateY(-90deg)",    // 3
    "rotateX(0deg) rotateY(90deg)",     // 4
    "rotateX(-90deg) rotateY(0deg)",    // 5
    "rotateX(90deg) rotateY(0deg)"      // 6
  ];
  cube.style.transform = `rotateX(${vueltasX}deg) rotateY(${vueltasY}deg) ${rotaciones[num - 1]}`;
}

document.getElementById("startBtn").addEventListener("click", () => {
    const select = document.getElementById("numPlayers");
    const numJugadores = parseInt(select.value, 10);
    if (isNaN(numJugadores) || numJugadores < 3 || numJugadores > 15) {
        mostrarMensajeTemporal("Selecciona entre 3 y 15 jugadores.");
        return;
    }
});


function actualizarFichasTablero() {
  document.querySelectorAll('.ficha-en-tablero').forEach(f => f.remove());
  document.querySelectorAll('.ficha-en-salida').forEach(f => f.remove());

  // Muestra el número en todas las casillas antes de agregar fichas
  document.querySelectorAll('.casilla').forEach(casilla => {
    let numeroSpan = casilla.querySelector('.numero-casilla');
    if (numeroSpan) numeroSpan.style.display = "";
  });

  // Agrega las fichas y oculta el número si hay al menos una ficha
  jugadores.forEach((jugador, idx) => {
    let casillaNum = jugador.posicion;
    let ficha = document.createElement("span");
    ficha.className = "ficha";
    ficha.style.background = jugador.color;
    ficha.style.width = "38px";
    ficha.style.height = "38px";
    ficha.style.borderRadius = "50%";
    ficha.style.margin = "0 2px";
    ficha.style.border = "2px solid #fff";
    ficha.style.boxShadow = "0 0 2px #000";
    ficha.style.display = "inline-block";
    ficha.style.verticalAlign = "middle";
    ficha.title = `Jugador ${idx + 1}`;
    ficha.textContent = idx + 1;
    ficha.style.color = "#fff";
    ficha.style.fontWeight = "bold";
    ficha.style.fontSize = "22px";
    ficha.style.textAlign = "center";
    ficha.style.lineHeight = "38px";

    if (casillaNum === 0) {
      ficha.classList.add("ficha-en-salida");
      document.getElementById("fichas-jugadores").appendChild(ficha);
    } else {
      ficha.classList.add("ficha-en-tablero");
      let casilla;
      if (casillaNum > 46) casillaNum = 47; // Winner
      if (casillaNum === 47) {
        casilla = document.querySelector('.winner');
      } else {
        casilla = document.querySelectorAll('.casilla')[casillaNum - 1];
      }
      if (casilla) {
        // Oculta el número al poner una ficha
        let numeroSpan = casilla.querySelector('.numero-casilla');
        if (numeroSpan) numeroSpan.style.display = "none";
        casilla.appendChild(ficha);
      }
    }
  });
}

function mostrarModalReto(casillaNum) {
  const modal = document.getElementById("accion-modal");
  const texto = document.getElementById("accion-texto");
  const shots = shotsPorCasilla[casillaNum] || 0;
  texto.innerHTML = `
    <div style="font-size:1.3em; margin-bottom:32px; text-align:center;">
      ${retosPorCasilla[casillaNum] || "¡Haz lo que quieras!"}
    </div>
    <div style="font-size:1.0em; color:#e53935; font-weight:bold; text-align:center; margin-bottom:32px;">
      Toma:<br>
      <span style="font-size:1.0em; color:#c40bc4; font-weight:bold;">
        ${shots} shot${shots === 1 ? '' : 's'}
      </span>
    </div>
  `;
  modal.style.display = "flex";

  // Botón verde: solo cierra y pasa turno
  document.getElementById("btn-reto").onclick = cerrarModalYTurno;

  // Botón rojo: suma shots y pasa turno
  document.getElementById("btn-shot").onclick = function() {
    jugadores[turnoActual].shots += shots;
    cerrarModalYTurno();
  };
}

function cerrarModalYTurno() {
  document.getElementById("accion-modal").style.display = "none";
  turnoActual = (turnoActual + 1) % jugadores.length;
}

function mostrarResumenFinal() {
  // Oculta el tablero y muestra el resumen
  document.getElementById("game").style.display = "none";
  document.getElementById("dice-container").style.display = "none";

  // Crea el resumen de shots
  let resumen = "<h2>¡Juego terminado!</h2><ul>";
  jugadores.forEach((j, i) => {
    resumen += `<li style="color:${j.color};font-weight:bold;">Jugador ${i+1}: ${j.shots} shots</li>`;
  });
  resumen += "</ul>";

  // Muestra el resumen en el mensaje
  const mensaje = document.getElementById("message");
  mensaje.innerHTML = resumen;
  mensaje.style.display = "block";
  mensaje.style.opacity = "1";
}

function actualizarPanelJugadores() {
  const panel = document.getElementById("players");
  panel.innerHTML = jugadores.map((j, i) =>
    `<div style="color:${j.color};font-weight:bold;">Jugador ${i+1}: ${j.shots} shots</div>`
  ).join("");
}