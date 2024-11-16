let students = [];
        let defaultAssignments = {}; // To store manually assigned students
        let draggedRow = null;

        // Tải lên file txt và csv
        document.getElementById("uploadButton").addEventListener("click", function () {
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

            assignTeamsAndDisplay(); // Call function to assign teams and display
        }

        // Process CSV content
        function processCSV(content) {
            const rows = content.split("\n");
            students = [];
            defaultAssignments = {};

            rows.forEach((row) => {
                const columns = row.split(",");
                if (columns.length < 2) {
                    console.warn("Invalid row format:", row);
                    return; // Skip invalid rows
                }
                
                const studentID = columns[0].trim();
                const studentName = columns.slice(1).join(",").trim(); // In case names have commas

                if (studentID && studentName) {
                    students.push({
                        id: studentID,
                        name: studentName,
                        team: null,
                    });
                }
            });

            assignTeamsAndDisplay(); // Call function to assign teams and display
        }

        // Bulk input for adding students with auto-generated IDs
        document.getElementById("addBulkStudentsButton").addEventListener("click", function () {
            const bulkInput = document.getElementById("bulkInput").value.trim();
            const numTeams = parseInt(document.getElementById("numTeams").value);

            if (!bulkInput) {
                alert("Please enter student names.");
                return;
            }

            if (isNaN(numTeams) || numTeams <= 0) {
                alert("Please enter a valid number of teams.");
                return;
            }

            const lines = bulkInput.split("\n");
            let startID = 1001; // Starting ID for students

            lines.forEach((line, index) => {
                const studentName = line.trim();

                if (studentName) {
                    // Generate a unique student ID and assign a team based on index
                    const studentID = startID++;
                    const teamNum = (index % numTeams) + 1; // Cyclically assign teams

                    students.push({
                        id: studentID.toString(),
                        name: studentName,
                        team: teamNum
                    });
                }
            });

            assignTeamsAndDisplay(); // Update the display after adding students

            // Clear the textarea and number of teams input
            document.getElementById("bulkInput").value = "";
            document.getElementById("numTeams").value = "";
        });

        // Assign teams and display results
        function assignTeamsAndDisplay() {
            const numTeams = Math.max(...students.map(student => student.team)) || 1; // Determine number of teams
            students.forEach((student, index) => {
                student.team = (index % numTeams) + 1; // Assign teams cyclically
            });
            displayTeams(); // Display the updated teams
        }

        // Display students by team
        function displayTeams() {
            const teamsDisplay = document.getElementById("teamsDisplay");
            teamsDisplay.innerHTML = ""; // Clear previous display

            // Group students by team
            const teams = {};
            students.forEach(student => {
                if (!teams[student.team]) {
                    teams[student.team] = [];
                }
                teams[student.team].push(student);
            });

            // Display each team and its members
            Object.keys(teams).forEach(teamNum => {
                const teamDiv = document.createElement("div");
                teamDiv.className = "team";

                const teamHeader = document.createElement("h3");
                teamHeader.textContent = `Đội ${teamNum}`;
                teamDiv.appendChild(teamHeader);

                const studentList = document.createElement("ul");
                teams[teamNum].forEach(student => {
                    const studentItem = document.createElement("li");
                    studentItem.textContent = `MSSV: ${student.id} | Tên: ${student.name}`;
                    studentList.appendChild(studentItem);
                });

                teamDiv.appendChild(studentList);
                teamsDisplay.appendChild(teamDiv);
            });
        }

        // Shuffle students array
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
