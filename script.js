// Declaro e inicializo array de objetos de los hoyos

const holes = [
  { Hole: 1, Par: 4, Handicap: 15, Score: 0 },
  { Hole: 2, Par: 3, Handicap: 9, Score: 0 },
  { Hole: 3, Par: 4, Handicap: 3, Score: 0 },
  { Hole: 4, Par: 5, Handicap: 13, Score: 0 },
  { Hole: 5, Par: 3, Handicap: 17, Score: 0 },
  { Hole: 6, Par: 4, Handicap: 1, Score: 0 },
  { Hole: 7, Par: 4, Handicap: 7, Score: 0 },
  { Hole: 8, Par: 5, Handicap: 11, Score: 0 },
  { Hole: 9, Par: 4, Handicap: 5, Score: 0 },
  { Hole: 10, Par: 5, Handicap: 16, Score: 0 },
  { Hole: 11, Par: 4, Handicap: 2, Score: 0 },
  { Hole: 12, Par: 3, Handicap: 18, Score: 0 },
  { Hole: 13, Par: 5, Handicap: 8, Score: 0 },
  { Hole: 14, Par: 4, Handicap: 10, Score: 0 },
  { Hole: 15, Par: 4, Handicap: 6, Score: 0 },
  { Hole: 16, Par: 3, Handicap: 14, Score: 0 },
  { Hole: 17, Par: 4, Handicap: 12, Score: 0 },
  { Hole: 18, Par: 4, Handicap: 4, Score: 0 },
];

// Declaro e inicializo array de objetos del resumen de scores del Campo de Juego
let courseScoreCards = [];

let scores = localStorage.getItem("scores");

if (scores) {
  courseScoreCards = JSON.parse(scores);  

  const mainTbody = document.getElementById("roundsItems");
  courseScoreCards.forEach((x) => {
    const mainRow = document.createElement("tr");	
    mainTbody.appendChild(mainRow);

	let id = null;
    Object.keys(x).forEach((element) => {
	  if(element === 'id') {
		  id = x[element];
		  mainRow.setAttribute("id", x[element]);
	  } else {
		  const mainData = document.createElement("td");
		  mainData.setAttribute("class", "text-center");
		  mainData.textContent = x[element];
		  mainRow.appendChild(mainData);
	  }      
    });
	
	const data = document.createElement("td");
	const button = document.createElement("button");
	button.setAttribute("class", "btn btn-danger btn-sm");
	button.setAttribute("onclick", `clearRound(${id})`);
	button.textContent = "Delete";
    data.appendChild(button);
	mainRow.appendChild(data);
  
  });
}

// Declaro variable para almacenar la Temperatura
let tempValue = '';

// Consumo API openWeather
const apiKey = "??";
const city = "Nordelta";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

fetch(url)
  .then((res) => res.json())
  .then((data) => {
    tempValue = data["main"]["temp"] - 273.15;
	document.getElementById('temp').innerHTML = parseInt(tempValue, 10) + '°C';
  });

// Genero una función que totalice el Gross Score a medida que hay un cambio en la tabla

document
  .getElementById("scoreTable")
  .addEventListener("change", grossScoreGenerator);
let grossScore;
function grossScoreGenerator() {
  holes.reduce((total, item) => {
    return (grossScore = total += item.Score);
  }, 0);
  document.getElementById("grossScore").value = grossScore;
}

// Genero el Net Score tomando el Playing Handicap

document
  .getElementById("main-panel")
  .addEventListener("change", netScoreGenerator);
function netScoreGenerator() {
  let playingHandicap = document.getElementById("playingHandicap").value;
  let netScore = grossScore - playingHandicap;
  document.getElementById("netScore").value = netScore;
}

// Genero función para validar la integridad del score

document
  .getElementById("main-panel")
  .addEventListener("change", scorecardValidator);
function scorecardValidator() {
  let invalid = holes.find((hole) => hole.Score == 0 || isNaN(hole.Score));
  if (invalid) {
    document
      .getElementById("scorecardStatus")
      .classList.remove("valid-scorecard");
    document
      .getElementById("scorecardStatus")
      .classList.add("invalid-scorecard");
    document.getElementById("valid").innerHTML = "Invalid Score &#x2717;";
    document.getElementById("scorecardStatus").classList.remove("bold");
  } else {
    document
      .getElementById("scorecardStatus")
      .classList.remove("invalid-scorecard");
    document.getElementById("scorecardStatus").classList.add("valid-scorecard");
    document.getElementById("valid").innerHTML = "Valid Score &#10003;";
    document.getElementById("scorecardStatus").classList.add("bold");
  }
}

// Genero función para mostrar si la tarjeta está firmada
document.getElementById("playerName").addEventListener("change", cardSigned);
function cardSigned(e) {
  if (document.getElementById("playerName").value != 0) {
    document.getElementById("scorecardSigned").innerHTML = "Signed &#10003;";
    document
      .getElementById("scorecardSigned")
      .classList.remove("signature-alert");
    document.getElementById("scorecardSigned").classList.add("bold");
    document.getElementById("scorecardSigned").classList.add("signed-card");
  } else {
    document.getElementById("scorecardSigned").innerHTML =
      "Not signed &#x2717;";
    document.getElementById("scorecardSigned").classList.add("signature-alert");
    document.getElementById("scorecardSigned").classList.remove("bold");
    document.getElementById("scorecardSigned").classList.remove("signed-card");
  }
}

// Genero función para mostrar si la tarjeta tiene fecha
document.getElementById("date").addEventListener("change", dateValidation);
function dateValidation(e) {
  if (document.getElementById("date").value != 0) {
    document.getElementById("dateValidated").innerHTML = "Valid Date &#10003;";
    document
      .getElementById("dateValidated")
      .classList.remove("signature-alert");
    document.getElementById("dateValidated").classList.add("bold");
    document.getElementById("dateValidated").classList.add("date-valid");
  } else {
    document.getElementById("dateValidated").innerHTML = "Wrong Date &#x2717;";
    document.getElementById("dateValidated").classList.add("date-alert");
    document.getElementById("dateValidated").classList.remove("bold");
    document.getElementById("dateValidated").classList.remove("date-valid");
  }
}

// Habilito boton submit

document
  .getElementById("main-panel")
  .addEventListener("change", activateButton);
function activateButton() {
  let invalid = holes.find((hole) => hole.Score == 0 || isNaN(hole.Score));
  if (invalid) {
    document.getElementById("submitScorecard").setAttribute("disabled", true);
  } else {
    document.getElementById("submitScorecard").removeAttribute("disabled");
  }
}

// Genero función para enviar tarjeta - Incorporando SWEET ALERT y grabando en LOCAL STORAGE

document
  .getElementById("submitScorecard")
  .addEventListener("click", submitScorecard);
function submitScorecard(e) {
  let id = new Date().getTime();
  
  const scorecardRoundDate = document.getElementById("date").value;
  const scorecardCourseName = document.getElementById("courseName").value;
  const scorecardGrossScore = document.getElementById("grossScore").value;
  const scorecardHandicap = document.getElementById("playingHandicap").value;
  const scorecardNetScore = document.getElementById("netScore").value;
  const scorecardPlayerName = document.getElementById("playerName").value;
  const round = {
	id: id,
    roundDate: scorecardRoundDate,
    roundCourseName: scorecardCourseName,
    playerName: scorecardPlayerName,
    roundGrossScore: scorecardGrossScore,
    roundHandicap: scorecardHandicap,
    roundNetScore: scorecardNetScore,
  };

  courseScoreCards.push(round);
  localStorage.setItem("scores", JSON.stringify(courseScoreCards));

  Swal.fire({
    position: "center",
    icon: "success",
    title: "Your scorecard has been saved",
    showConfirmButton: false,
    timer: 2000,
  });

  const tbody = document.getElementById("roundsItems");
  const row = document.createElement("tr");

  row.setAttribute("id", id);
  tbody.appendChild(row);
  Object.keys(round).forEach((element) => {
	if(element !== 'id') {
		const data = document.createElement("td");
		data.setAttribute("class", "text-center");
		data.textContent = round[element];

		row.appendChild(data);
	}    
  });

  const data = document.createElement("td");
  const button = document.createElement("button");
  button.setAttribute("class", "btn btn-danger btn-sm");
  button.setAttribute("onclick", `clearRound(${id})`);
  button.textContent = "Delete";

  data.appendChild(button);
  row.appendChild(data);

  clearForm();
}

// Genero función para limpiar formulario

function clearRound(id) {
  // Valido siempre recibir un id
  if(!id) {
	return;
  }
	
  //Elimino el row de la tabla.
  let toBeDeleted = document.getElementById(id);
  toBeDeleted.remove();
  
  // Elimino el score del localStorage.
  const scoreIndex = courseScoreCards.findIndex(x => x.id === id);
  if (scoreIndex >= 0) {
	  courseScoreCards.splice(scoreIndex, 1);
	  localStorage.setItem("scores", JSON.stringify(courseScoreCards));
  }
  
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Round successfully deleted",
    showConfirmButton: false,
    timer: 2000,
  });
}

// Genero función para limpiar formulario

function clearForm() {
  document.getElementById("inputHole1").value = 0;
  document.getElementById("statusHole1").innerHTML = "Not Played";
  document.getElementById("statusHole1").classList.remove("bold");

  document.getElementById("inputHole2").value = 0;
  document.getElementById("statusHole2").innerHTML = "Not Played";
  document.getElementById("statusHole2").classList.remove("bold");
  document.getElementById("inputHole3").value = 0;
  document.getElementById("statusHole3").innerHTML = "Not Played";
  document.getElementById("statusHole3").classList.remove("bold");
  document.getElementById("inputHole4").value = 0;
  document.getElementById("statusHole4").innerHTML = "Not Played";
  document.getElementById("statusHole4").classList.remove("bold");
  document.getElementById("inputHole5").value = 0;
  document.getElementById("statusHole5").innerHTML = "Not Played";
  document.getElementById("statusHole5").classList.remove("bold");
  document.getElementById("inputHole6").value = 0;
  document.getElementById("statusHole6").innerHTML = "Not Played";
  document.getElementById("statusHole6").classList.remove("bold");
  document.getElementById("inputHole7").value = 0;
  document.getElementById("statusHole7").innerHTML = "Not Played";
  document.getElementById("statusHole7").classList.remove("bold");
  document.getElementById("inputHole8").value = 0;
  document.getElementById("statusHole8").innerHTML = "Not Played";
  document.getElementById("statusHole8").classList.remove("bold");
  document.getElementById("inputHole9").value = 0;
  document.getElementById("statusHole9").innerHTML = "Not Played";
  document.getElementById("statusHole9").classList.remove("bold");
  document.getElementById("inputHole10").value = 0;
  document.getElementById("statusHole10").innerHTML = "Not Played";
  document.getElementById("statusHole10").classList.remove("bold");
  document.getElementById("inputHole11").value = 0;
  document.getElementById("statusHole11").innerHTML = "Not Played";
  document.getElementById("statusHole11").classList.remove("bold");
  document.getElementById("inputHole12").value = 0;
  document.getElementById("statusHole12").innerHTML = "Not Played";
  document.getElementById("statusHole12").classList.remove("bold");
  document.getElementById("inputHole13").value = 0;
  document.getElementById("statusHole13").innerHTML = "Not Played";
  document.getElementById("statusHole13").classList.remove("bold");
  document.getElementById("inputHole14").value = 0;
  document.getElementById("statusHole14").innerHTML = "Not Played";
  document.getElementById("statusHole14").classList.remove("bold");
  document.getElementById("inputHole15").value = 0;
  document.getElementById("statusHole15").innerHTML = "Not Played";
  document.getElementById("statusHole15").classList.remove("bold");
  document.getElementById("inputHole16").value = 0;
  document.getElementById("statusHole16").innerHTML = "Not Played";
  document.getElementById("statusHole16").classList.remove("bold");
  document.getElementById("inputHole17").value = 0;
  document.getElementById("statusHole17").innerHTML = "Not Played";
  document.getElementById("statusHole17").classList.remove("bold");
  document.getElementById("inputHole18").value = 0;
  document.getElementById("statusHole18").innerHTML = "Not Played";
  document.getElementById("statusHole18").classList.remove("bold");

  document.getElementById("grossScore").value = NaN;
  document.getElementById("netScore").value = NaN;
  document.getElementById("playingHandicap").value = 0;

  holes.forEach((x) => (x.Score = 0));

  document.getElementById("date").value = null;

  document.getElementById("playerName").value = "";
}

// Genero los eventos y las funciones que asignan valor al Score de cada hoyo, cambiando el estado de jugado o no jugado

document.getElementById("inputHole1").addEventListener("change", changeStatus1);
function changeStatus1(e) {
  if (document.getElementById("inputHole1").value != 0) {
    document.getElementById("statusHole1").innerHTML = "Played";
    document.getElementById("statusHole1").classList.add("bold");
  } else {
    document.getElementById("statusHole1").innerHTML = "Not Played";
    document.getElementById("statusHole1").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 1);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole1").value
  );
}

document.getElementById("inputHole2").addEventListener("change", changeStatus2);
function changeStatus2(e) {
  if (document.getElementById("inputHole2").value != 0) {
    document.getElementById("statusHole2").innerHTML = "Played";
    document.getElementById("statusHole2").classList.add("bold");
  } else {
    document.getElementById("statusHole2").innerHTML = "Not Played";
    document.getElementById("statusHole2").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 2);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole2").value
  );
}

document.getElementById("inputHole3").addEventListener("change", changeStatus3);
function changeStatus3(e) {
  if (document.getElementById("inputHole3").value != 0) {
    document.getElementById("statusHole3").innerHTML = "Played";
    document.getElementById("statusHole3").classList.add("bold");
  } else {
    document.getElementById("statusHole3").innerHTML = "Not Played";
    document.getElementById("statusHole3").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 3);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole3").value
  );
}

document.getElementById("inputHole4").addEventListener("change", changeStatus4);
function changeStatus4(e) {
  if (document.getElementById("inputHole4").value != 0) {
    document.getElementById("statusHole4").innerHTML = "Played";
    document.getElementById("statusHole4").classList.add("bold");
  } else {
    document.getElementById("statusHole4").innerHTML = "Not Played";
    document.getElementById("statusHole4").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 4);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole4").value
  );
}

document.getElementById("inputHole5").addEventListener("change", changeStatus5);
function changeStatus5(e) {
  if (document.getElementById("inputHole5").value != 0) {
    document.getElementById("statusHole5").innerHTML = "Played";
    document.getElementById("statusHole5").classList.add("bold");
  } else {
    document.getElementById("statusHole5").innerHTML = "Not Played";
    document.getElementById("statusHole5").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 5);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole5").value
  );
}

document.getElementById("inputHole6").addEventListener("change", changeStatus6);
function changeStatus6(e) {
  if (document.getElementById("inputHole6").value != 0) {
    document.getElementById("statusHole6").innerHTML = "Played";
    document.getElementById("statusHole6").classList.add("bold");
  } else {
    document.getElementById("statusHole6").innerHTML = "Not Played";
    document.getElementById("statusHole6").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 6);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole6").value
  );
}

document.getElementById("inputHole7").addEventListener("change", changeStatus7);
function changeStatus7(e) {
  if (document.getElementById("inputHole7").value != 0) {
    document.getElementById("statusHole7").innerHTML = "Played";
    document.getElementById("statusHole7").classList.add("bold");
  } else {
    document.getElementById("statusHole7").innerHTML = "Not Played";
    document.getElementById("statusHole7").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 7);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole7").value
  );
}

document.getElementById("inputHole8").addEventListener("change", changeStatus8);
function changeStatus8(e) {
  if (document.getElementById("inputHole8").value != 0) {
    document.getElementById("statusHole8").innerHTML = "Played";
    document.getElementById("statusHole8").classList.add("bold");
  } else {
    document.getElementById("statusHole8").innerHTML = "Not Played";
    document.getElementById("statusHole8").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 8);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole8").value
  );
}

document.getElementById("inputHole9").addEventListener("change", changeStatus9);
function changeStatus9(e) {
  if (document.getElementById("inputHole9").value != 0) {
    document.getElementById("statusHole9").innerHTML = "Played";
    document.getElementById("statusHole9").classList.add("bold");
  } else {
    document.getElementById("statusHole9").innerHTML = "Not Played";
    document.getElementById("statusHole9").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 9);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole9").value
  );
}

document
  .getElementById("inputHole10")
  .addEventListener("change", changeStatus10);
function changeStatus10(e) {
  if (document.getElementById("inputHole10").value != 0) {
    document.getElementById("statusHole10").innerHTML = "Played";
    document.getElementById("statusHole10").classList.add("bold");
  } else {
    document.getElementById("statusHole10").innerHTML = "Not Played";
    document.getElementById("statusHole10").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 10);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole10").value
  );
}

document
  .getElementById("inputHole11")
  .addEventListener("change", changeStatus11);
function changeStatus11(e) {
  if (document.getElementById("inputHole11").value != 0) {
    document.getElementById("statusHole11").innerHTML = "Played";
    document.getElementById("statusHole11").classList.add("bold");
  } else {
    document.getElementById("statusHole11").innerHTML = "Not Played";
    document.getElementById("statusHole11").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 11);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole11").value
  );
}

document
  .getElementById("inputHole12")
  .addEventListener("change", changeStatus12);
function changeStatus12(e) {
  if (document.getElementById("inputHole12").value != 0) {
    document.getElementById("statusHole12").innerHTML = "Played";
    document.getElementById("statusHole12").classList.add("bold");
  } else {
    document.getElementById("statusHole12").innerHTML = "Not Played";
    document.getElementById("statusHole12").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 12);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole12").value
  );
}

document
  .getElementById("inputHole13")
  .addEventListener("change", changeStatus13);
function changeStatus13(e) {
  if (document.getElementById("inputHole13").value != 0) {
    document.getElementById("statusHole13").innerHTML = "Played";
    document.getElementById("statusHole13").classList.add("bold");
  } else {
    document.getElementById("statusHole13").innerHTML = "Not Played";
    document.getElementById("statusHole13").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 13);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole13").value
  );
}

document
  .getElementById("inputHole14")
  .addEventListener("change", changeStatus14);
function changeStatus14(e) {
  if (document.getElementById("inputHole14").value != 0) {
    document.getElementById("statusHole14").innerHTML = "Played";
    document.getElementById("statusHole14").classList.add("bold");
  } else {
    document.getElementById("statusHole14").innerHTML = "Not Played";
    document.getElementById("statusHole14").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 14);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole14").value
  );
}

document
  .getElementById("inputHole15")
  .addEventListener("change", changeStatus15);
function changeStatus15(e) {
  if (document.getElementById("inputHole15").value != 0) {
    document.getElementById("statusHole15").innerHTML = "Played";
    document.getElementById("statusHole15").classList.add("bold");
  } else {
    document.getElementById("statusHole15").innerHTML = "Not Played";
    document.getElementById("statusHole15").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 15);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole15").value
  );
}

document
  .getElementById("inputHole16")
  .addEventListener("change", changeStatus16);
function changeStatus16(e) {
  if (document.getElementById("inputHole16").value != 0) {
    document.getElementById("statusHole16").innerHTML = "Played";
    document.getElementById("statusHole16").classList.add("bold");
  } else {
    document.getElementById("statusHole16").innerHTML = "Not Played";
    document.getElementById("statusHole16").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 16);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole16").value
  );
}

document
  .getElementById("inputHole17")
  .addEventListener("change", changeStatus17);
function changeStatus17(e) {
  if (document.getElementById("inputHole17").value != 0) {
    document.getElementById("statusHole17").innerHTML = "Played";
    document.getElementById("statusHole17").classList.add("bold");
  } else {
    document.getElementById("statusHole17").innerHTML = "Not Played";
    document.getElementById("statusHole17").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 17);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole17").value
  );
}

document
  .getElementById("inputHole18")
  .addEventListener("change", changeStatus18);
function changeStatus18(e) {
  if (document.getElementById("inputHole18").value != 0) {
    document.getElementById("statusHole18").innerHTML = "Played";
    document.getElementById("statusHole18").classList.add("bold");
  } else {
    document.getElementById("statusHole18").innerHTML = "Not Played";
    document.getElementById("statusHole18").classList.remove("bold");
  }
  let indexArray = holes.findIndex((hole) => hole.Hole == 18);
  holes[indexArray].Score = parseInt(
    document.getElementById("inputHole18").value
  );
}
