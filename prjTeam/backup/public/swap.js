function displayTeams() {
  const teamTablesContainer = document.getElementById("teamTablesContainer");
  teamTablesContainer.innerHTML = "";

  let teams = {};

  // Group students by team
  students.forEach((student) => {
    const teamNum = student.team ? student.team : "Danh sách";
    if (!teams[teamNum]) {
      teams[teamNum] = [];
    }
    teams[teamNum].push(student);
  });

  // Create a table for each team
  for (const teamNum in teams) {
    const teamSection = document.createElement("div");
    teamSection.classList.add("team-table");
    teamSection.setAttribute("data-team", teamNum);
    teamSection.addEventListener("dragover", allowDrop);
    teamSection.addEventListener("drop", drop);

    const teamTitle = document.createElement("h3");
    teamTitle.textContent = `Team ${teamNum}`;
    teamSection.appendChild(teamTitle);

    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th>MSSV</th>
          <th>Họ và Tên</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;

    teams[teamNum].forEach((student) => {
      const row = document.createElement("tr");
      row.setAttribute("draggable", "true");
      row.setAttribute("data-id", student.id);
      row.addEventListener("dragstart", drag);

      // Editable MSSV cell
      const idCell = document.createElement("td");
      idCell.textContent = student.id;
      idCell.contentEditable = "true"; // Make cell editable
      idCell.addEventListener("input", (event) => updateStudentField(student.id, "id", event.target.textContent.trim()));

      // Editable name cell
      const nameCell = document.createElement("td");
      nameCell.textContent = student.name;
      nameCell.contentEditable = "true"; // Make cell editable
      nameCell.addEventListener("input", (event) => updateStudentField(student.id, "name", event.target.textContent.trim()));

      row.appendChild(idCell);
      row.appendChild(nameCell);
      table.querySelector("tbody").appendChild(row);
    });

    teamSection.appendChild(table);
    teamTablesContainer.appendChild(teamSection);
  }
}

// Function to update student information in the `students` array
function updateStudentField(studentID, field, newValue) {
  const student = students.find((s) => s.id === studentID);
  if (student) {
    student[field] = newValue;
  }
}

// Allow drop
function allowDrop(event) {
  event.preventDefault();
}

// Start drag
function drag(event) {
  event.dataTransfer.setData("text", event.target.getAttribute("data-id"));
}

// Drop into a new team
function drop(event) {
  event.preventDefault();
  const studentID = event.dataTransfer.getData("text");
  const newTeam = event.currentTarget.getAttribute("data-team");

  const studentIndex = students.findIndex((s) => s.id === studentID);
  if (studentIndex !== -1) {
    students[studentIndex].team = newTeam === "Danh sách" ? null : parseInt(newTeam);
    displayTeams();
  }
}

// Initial call to display student teams
displayTeams();
