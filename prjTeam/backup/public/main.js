
let students = [];
let defaultAssignments = {}; // To store manually assigned students
let draggedRow = null;

// Tải lên file txt và csv
document
  .getElementById("uploadButton")
  .addEventListener("click", function () {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      if (file.name.endsWith(".txt")) {
        processTXT(content); // Process the TXT file content
      } else if (file.name.endsWith(".csv")) {
        processCSV(content); // Process the CSV file content
      } else {
        alert("Unsupported file type. Please upload a TXT or CSV file.");
      }
    };
    reader.readAsText(file);
  });

// Process TXT content
function processTXT(content) {
  const lines = content.split("\n");
  students = [];
  defaultAssignments = {};

  lines.forEach((line) => {
    const [studentID, ...fullNameParts] = line.trim().split(/\s+/);
    const studentName = fullNameParts.join(" ");

    if (studentID && studentName) {
      students.push({
        id: studentID.trim(),
        name: studentName.trim(),
        team: null,
      });
    }
  });

  displayTeams();
}

// Process CSV content
function processCSV(content) {
  const rows = content.split("\n");
  students = [];
  defaultAssignments = {};

  rows.forEach((row) => {
    const [studentID, studentName] = row.split(",");
    if (studentID && studentName) {
      students.push({
        id: studentID.trim(),
        name: studentName.trim(),
        team: null,
      });
    }
  });

  displayTeams();
}

// Display students by team


// Assign random students to teams, ensuring minimal difference in team sizes
function assignTeams(numTeams, unassignedStudents) {
  const teamCounts = {}; // Store the number of students in each team, including default assignments
  for (let i = 1; i <= numTeams; i++) {
    teamCounts[i] = 0; // Initialize each team count to 0
  }

  // Count students already assigned to teams
  students.forEach((student) => {
    if (student.team) {
      teamCounts[student.team]++;
    }
  });

  const shuffledStudents = shuffleArray(unassignedStudents.slice());

  // Sort teams by the number of current members (ascending)
  const sortedTeams = Object.keys(teamCounts).sort(
    (a, b) => teamCounts[a] - teamCounts[b]
  );

  // Assign unassigned students to teams
  shuffledStudents.forEach((student) => {
    
    // Always assign to the team with the least members
    const teamNum = sortedTeams[0]; // Get the team with the least members
    student.team = parseInt(teamNum); // Assign the student to that team
    teamCounts[teamNum]++; // Increment the count for that team

    // Resort teams after each assignment to ensure balance
    sortedTeams.sort((a, b) => teamCounts[a] - teamCounts[b]);
  });

  return teamCounts; // Return the updated team counts (if needed)
}
// Assign default students to teams

const buttonUpload = document.getElementById("assignDefaultButton");

buttonUpload.addEventListener("click", function () {
  const studentID = document
    .getElementById("defaultStudentID")
    .value.trim();
  const studentName = document
    .getElementById("defaultStudentName")
    .value.trim();
  const teamNum = parseInt(document.getElementById("defaultTeam").value);
  if(teamNum >= 10001 ){
    alert("Xin hãy nhập đội chính xác (đội >0)");
    return;
  }
  if (!studentID || isNaN(teamNum)) {
    alert("Vui lòng nhập đúng mã sinh viên và số nhóm.");
    return;
  }

  // Tìm sinh viên trong danh sách
  const studentIndex = students.findIndex((s) => s.id === studentID);

  if (studentIndex !== -1) {
    // Sinh viên đã tồn tại, cập nhập nhóm
    students[studentIndex].name = studentName;
    students[studentIndex].team = teamNum;
  } else {
    // Sinh viên chưa tồn tại, tạo mới
    const newStudent = {
      id: studentID,
      name: studentName,
      // Thêm các thuộc tính khác cho sinh viên mới (tên, ...)
      team: teamNum,
    };
    students.push(newStudent);
  }

  defaultAssignments[studentID] = teamNum;
  displayTeams();
  // alert(`Đã phân công ${studentID} vào Nhóm ${teamNum}.`);

  document.getElementById("defaultStudentID").value = "";
  document.getElementById("defaultTeam").value = "";
});
const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", function () {
  const searchID = document.getElementById("searchID").value.trim();
  const student = students.find((s) => s.id === searchID);

  const searchResult = document.getElementById("searchResult");
  if (student) {
    const team = student.team ? student.team : "Unassigned";
    searchResult.textContent = `Tên sinh viên: ${student.name} | Team: ${team}`;
  } else {
    searchResult.textContent = "Student not found.";
  }
});

// Clear all assignments
function clearAllAssignments() {
  students.forEach((student) => {
    student.team = null;
  });
  defaultAssignments = {};
  displayTeams();
}

// Re-randomize teams
document
  .getElementById("randomizeTeamsButton")
  .addEventListener("click", function () {
    const numTeams = parseInt(document.getElementById("numTeams").value);
    if (numTeams >= 100001  || numTeams < 0) {
      alert("Bạn đã nhập quá giới hạn cho phép! Vui lòng nhập lại!");
      return;
    }
    
    // Ask if the user wants to reset all assignments
    if (
      confirm(
        "Bạn không thay đổi chứ? Bắt đầu chia đội!"
      )
    ) {
      clearAllAssignments();
    }

    const unassignedStudents = students.filter(
      (s) => !defaultAssignments[s.id] && !s.team
    );

    if (unassignedStudents.length === 0) {
      alert("Không có sinh viên, danh sách trống không thể bắt đầu!");
      return;
    }

    assignTeams(numTeams, unassignedStudents);
    displayTeams();
  });

// Shuffle students array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
document.getElementById("saveButton").addEventListener("click", function() {
  displayTeams(students);
});