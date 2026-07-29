const students = [
    {
        id: 1,
        name: "Smith",
        marks: [85, 90, 88]
    },
    {
        id: 2,
        name: "John",
        marks: [78, 81, 89]
    },
    {
        id: 3,
        name: "Alice",
        marks: [92, 95, 91]
    }
];

console.log("Complete JSON Array");
console.log(students);

console.log("\nFirst Student");
console.log(students[0]);

console.log("\nSecond Student Name");
console.log(students[1].name);

console.log("\nThird Student Second Mark");
console.log(students[2].marks[1]);

console.log("\nAll Students");

students.forEach(student => {
    console.log(
        `ID: ${student.id}, Name: ${student.name}, Marks: ${student.marks.join(", ")}`
    );
});