class StudentManagementSystem:
    def __init__(self):
        self.students = []  # List to store student records


    def add_student(self):
        """Add a new student."""
        name = input("Enter student's name: ")
        roll_no = input("Enter student's roll number: ")
        age = int(input("Enter student's age: "))
        course = input("Enter student's course: ")

        # Create a student dictionary
        student = {
            "name": name,
            "roll_no": roll_no,
            "age": age,
            "course": course,
        }

        # Add student to the list
        self.students.append(student)
        print("Student added successfully!\n")

    def view_students(self):
        """View all students."""
        if not self.students:
            print("No students found.\n")
            return

        print("\nList of Students:")
        for idx, student in enumerate(self.students, start=1):
            print(f"{idx}. Name: {student['name']}, Roll No: {student['roll_no']}, Age: {student['age']}, Course: {student['course']}")
        print()

    def update_student(self):
        """Update an existing student."""
        roll_no = input("Enter roll number of the student to update: ")

        # Find the student by roll number
        for student in self.students:
            if student["roll_no"] == roll_no:
                print("Student found. Enter new details (leave blank to keep current value):")

                name = input(f"Enter new name ({student['name']}): ") or student['name']
                age = input(f"Enter new age ({student['age']}): ") or student['age']
                course = input(f"Enter new course ({student['course']}): ") or student['course']

                # Update details
                student['name'] = name
                student['age'] = int(age)
                student['course'] = course
                print("Student updated successfully!\n")
                return

        print("Student not found.\n")

    def delete_student(self):
        """Delete a student."""
        roll_no = input("Enter roll number of the student to delete: ")

        # Find and remove the student by roll number
        for student in self.students:
            if student["roll_no"] == roll_no:
                self.students.remove(student)
                print("Student deleted successfully!\n")
                return

        print("Student not found.\n")

    def menu(self):
        """Display the menu."""
        while True:
            print("\n--- Student Management System ---")
            print("1. Add Student")
            print("2. View Students")
            print("3. Update Student")
            print("4. Delete Student")
            print("5. Exit")

            choice = input("Enter your choice: ")

            if choice == "1":
                self.add_student()
            elif choice == "2":
                self.view_students()
            elif choice == "3":
                self.update_student()
            elif choice == "4":
                self.delete_student()
            elif choice == "5":
                print("Exiting the program. Goodbye!")
                break
            else:
                print("Invalid choice. Please try again.\n")


# Main program
if __name__ == "__main__":
    sms = StudentManagementSystem()
    sms.menu()
