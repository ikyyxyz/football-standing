const clubs = [];

const matches = [];

// Menampilkan klasemen
function displayStandings() {
  const tableBody = document.getElementById("standing-table-body");
  tableBody.innerHTML = "";

  for (let i = 0; i < clubs.length; i++) {
    const club = clubs[i];
    const row = document.createElement("tr");
    row.innerHTML = `
      <th scope="row">${i + 1}</th>
      <td>${club.name}</td>
      <td>${club.wins + club.draws + club.losses}</td>
      <td>${club.wins}</td>
      <td>${club.draws}</td>
      <td>${club.losses}</td>
      <td>${club.goalsFor}</td>
      <td>${club.goalsAgainst}</td>
      <td>${club.wins * 3 + club.draws}</td>
    `;
    tableBody.appendChild(row);
  }
}

// Menambahkan klub
function addClub() {
  const clubNameInput = document.querySelector(
    '.input-club input[placeholder="Nama klub"]'
  );
  const clubCityInput = document.querySelector(
    '.input-club input[placeholder="Kota klub"]'
  );

  const clubName = clubNameInput.value.trim();
  const clubCity = clubCityInput.value.trim();

  // Validasi form
  if (clubName === "" || clubCity === "") {
    alert("Nama klub dan Kota klub harus diisi");
    return;
  }

  // Validasi data klub yang sama
  if (
    clubs.some((club) => club.name.toLowerCase() === clubName.toLowerCase())
  ) {
    alert("Klub sudah terdaftar");
    return;
  }

  // Menambahkan klub ke data klub
  const newClub = {
    name: clubName,
    city: clubCity,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
  };
  clubs.push(newClub);

  clubNameInput.value = "";
  clubCityInput.value = "";

  const clubAddedNotification = document.getElementById(
    "club-added-notification"
  );
  clubAddedNotification.style.display = "block";

  setTimeout(function () {
    clubAddedNotification.style.display = "none";
  }, 2000);

  displayStandings();
}

// Menambahkan skor pertandingan (satu per satu)
function addMatch() {
  const club1Input = document.querySelector(
    '.input-skor input[placeholder="Klub 1"]'
  );
  const club2Input = document.querySelector(
    '.input-skor input[placeholder="Klub 2"]'
  );
  const score1Input = document.querySelector(
    '.input-skor input[placeholder="Skor klub 1"]'
  );
  const score2Input = document.querySelector(
    '.input-skor input[placeholder="Skor Klub 2"]'
  );

  const club1 = club1Input.value.trim();
  const club2 = club2Input.value.trim();
  const score1 = parseInt(score1Input.value);
  const score2 = parseInt(score2Input.value);

  // Validasi form
  if (club1 === "" || club2 === "" || isNaN(score1) || isNaN(score2)) {
    alert("Data pertandingan tidak valid");
    return;
  }

  // Validasi data klub
  if (
    !clubs.some((club) => club.name.toLowerCase() === club1.toLowerCase()) ||
    !clubs.some((club) => club.name.toLowerCase() === club2.toLowerCase())
  ) {
    alert("Klub tidak ditemukan");
    return;
  }

  // Validasi data jika ada yabg sama
  if (matches.some((match) => match.club1 === club1 && match.club2 === club2)) {
    alert("Pertandingan sudah ada dalam daftar");
    return;
  }

  // Menambahkan skor ke data pertandingan
  matches.push({ club1, club2, score1, score2 });

  // Memperbarui statistik klub berdasarkan skor pertandingan
  updateClubStatistics(club1, club2, score1, score2);

  club1Input.value = "";
  club2Input.value = "";
  score1Input.value = "";
  score2Input.value = "";

  displayStandings();
}

// Memperbarui statistik klub berdasarkan skor pertandingan
function updateClubStatistics(club1, club2, score1, score2) {
  const homeClub = clubs.find(
    (club) => club.name.toLowerCase() === club1.toLowerCase()
  );
  const awayClub = clubs.find(
    (club) => club.name.toLowerCase() === club2.toLowerCase()
  );

  // Validasi klub yang terlibat dalam pertandingan
  if (!homeClub || !awayClub) {
    alert("Klub tidak ditemukan");
    return;
  }

  // Memperbarui statistik klub berdasarkan skor pertandingan
  homeClub.goalsFor += score1;
  homeClub.goalsAgainst += score2;
  awayClub.goalsFor += score2;
  awayClub.goalsAgainst += score1;

  if (score1 > score2) {
    homeClub.wins++;
    awayClub.losses++;
  } else if (score1 < score2) {
    homeClub.losses++;
    awayClub.wins++;
  } else {
    homeClub.draws++;
    awayClub.draws++;
  }

  updatePoints();
}

// Memperbarui poin klub berdasarkan statistik
function updatePoints() {
  for (const club of clubs) {
    club.points = club.wins * 3 + club.draws;
  }

  sortStandings();
}

// Mengurutkan klasemen berdasarkan poin
function sortStandings() {
  clubs.sort((a, b) => b.points - a.points);
  displayStandings();
}

// Mengambil elemen form input klub
const addClubForm = document.querySelector(".input-club form");
addClubForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addClub();
});

// Mengambil elemen form input skor
const addMatchForm = document.getElementById("input-skor-form");
addMatchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addMatch();
});

// Mengambil tombol submit formulir
const submitSkorButton = document.getElementById("submit-skor");
submitSkorButton.addEventListener("click", function (e) {
  e.preventDefault();
  addMultipleMatches();
});
