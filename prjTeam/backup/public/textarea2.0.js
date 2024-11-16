function saveStudentData(line) {
    const input = line.trim();
    if (input === ""){
        return;
    }
    let isID = true;
    let studentID="";
    let studentName="";

    for (let i = 0; i < input.length; i++) {
        const char = input[i];

        if (isID && !isNaN(char) && char !== " ") {
            studentID += char;
        } else {
            isID = false;
            studentName += char;
        }
    }

    studentID = studentID.trim() || null;
    studentName = studentName.trim() || null;

    students.push({
        id: studentID,
        name: studentName
    });

    console.log(students);
}
// Gắn sự kiện cho nút lưu
document.getElementById("saveButton").addEventListener("click", function() {
    const lines = document.getElementById("studentInput").value.split("\n");
    lines.forEach(line => saveStudentData(line));
});
