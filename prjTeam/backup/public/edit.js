// xóa sinh viên theo MSSV
// Nguyễn Ngọc Thi
function deleteStudent(studentID) {
    const studentIndex = students.findIndex((s) => s.id === studentID);
    
    if (studentIndex !== -1) {
      // Xóa sinh viên khỏi danh sách
      students.splice(studentIndex, 1);
      confirm(
        "Bạn chắc chắn muốn xóa chứ?"
      )
      alert(`Đã xóa sinh viên với mã ${studentID}.`);
    } else {
      alert("Sinh viên không tồn tại.");
    }
    
    displayTeams(); // Cập nhật giao diện
  }
  
  // Thêm sự kiện cho nút xóa
  const deleteButton = document.getElementById("deleteButton");
  deleteButton.addEventListener("click", function () {
    const studentID = document.getElementById("deleteStudentID").value.trim();
    
    if (!studentID) {
      alert("Vui lòng nhập mã sinh viên.");
      return;
    }
    
    deleteStudent(studentID);
    document.getElementById("deleteStudentID").value = ""; // Xóa ô nhập
  });
  