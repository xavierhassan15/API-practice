const apiURL = "https://672dd893fd8979715643eead.mockapi.io/product/players";

document.getElementById("playerForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  const playerId = document.getElementById("playerId").value;
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const role = document.getElementById("role").value;

  const isIdValid = await validateUniqueId(playerId);
  const isAgeValid = validateAge(age);

  if (!isIdValid || !isAgeValid) {
    return;
  }

  if (document.getElementById("playerId").disabled) {
    updatePlayer(playerId, name, age, role);
  } else {
    createPlayer(playerId, name, age, role);
  }
});

document.getElementById("age").addEventListener("input", function() {
  validateAge(this.value);
});

function validateAge(age) {
  const ageError = document.getElementById("ageError");
  if (age < 0) {
    ageError.style.display = "inline";
    ageError.textContent = "Age cannot be a negative value.";
    return false;
  } else {
    ageError.style.display = "none";
    return true;
  }
}

async function validateUniqueId(playerId) {
  const idError = document.getElementById("idError");
  if (!playerId) {
    idError.innerText = "Player ID cannot be empty.";
    idError.style.display = "inline";
    return false;
  }

  const response = await fetch(apiURL);
  const players = await response.json();

  const idExists = players.some(player => player.id === playerId);
  if (idExists) {
    idError.innerText = "Player ID already exists. Please enter a unique ID.";
    idError.style.display = "inline";
    return false;
  } else {
    idError.style.display = "none";
    return true;
  }
}

function createPlayer(id, name, age, role) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", apiURL, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    if (xhr.status === 201) {
      fetchPlayers();
      resetForm();
    }
  };
  xhr.send(JSON.stringify({ id, name, age, role }));
}

function fetchPlayers() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", apiURL, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const players = JSON.parse(xhr.responseText);
      displayPlayers(players);
    }
  };
  xhr.send();
}

function displayPlayers(players) {
  const playerList = document.getElementById("playerList");
  playerList.innerHTML = "";
  players.forEach(player => {
    playerList.innerHTML += `
      <tr>
        <td>${player.id}</td>
        <td>${player.name}</td>
        <td>${player.age}</td>
        <td>${player.role}</td>
        <td>
          <button onclick="editPlayer('${player.id}', '${player.name}', '${player.age}', '${player.role}')">Edit</button>
          <button onclick="deletePlayer('${player.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function updatePlayer(id, name, age, role) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", `${apiURL}/${id}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function() {
    if (xhr.status === 200) {
      fetchPlayers();
      resetForm();
    }
  };
  xhr.send(JSON.stringify({ name, age, role }));
}

function deletePlayer(id) {
  const xhr = new XMLHttpRequest();
  xhr.open("DELETE", `${apiURL}/${id}`, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      fetchPlayers();
    }
  };
  xhr.send();
}

function editPlayer(id, name, age, role) {
  document.getElementById("playerId").value = id;
  document.getElementById("playerId").disabled = true;
  document.getElementById("name").value = name;
  document.getElementById("age").value = age;
  document.getElementById("role").value = role;
}

function resetForm() {
  document.getElementById("playerId").value = "";
  document.getElementById("playerId").disabled = false;
  document.getElementById("name").value = "";
  document.getElementById("age").value = "";
  document.getElementById("role").value = "";
}

fetchPlayers();

function togglePlayerData(show) {
  const playerList = document.getElementById("playerList");
  const showButton = document.getElementById("showDataBtn");
  const hideButton = document.getElementById("hideDataBtn");

  if (show) {
    playerList.style.display = "table-row-group";
    fetchPlayers();
    showButton.style.display = "none";
    hideButton.style.display = "inline-block";
  } else {
    playerList.style.display = "none";
    showButton.style.display = "inline-block";
    hideButton.style.display = "none";
  }
}