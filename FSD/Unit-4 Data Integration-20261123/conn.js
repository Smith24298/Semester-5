// Import required modules
const mysql = require('mysql');
// Create a connection to the MySQL server
const dbcon = mysql.createConnection({
host: '192.168.60.80', // Change to your MySQL host
user: 'root', // Change to your MySQL username
password: '', // Change to your MySQL password
database: 'fswd',
    port:3307// Change to your MySQL database name
});
// Connect to MySQL server
dbcon.connect((msg)=>{
     if(msg){    console.log("Error" +msg)   }
    else{      console.log("Connected Successfully")   }
});
dbcon.query('Create table  if not exists student123(id int,name text)',(err,r)=>{
    console.log(r);
});


dbcon.query("Insert into student123 values(1,'dsfdsf')",(err,r)=>{
    console.log(r)
});


dbcon.end((err) => {
if (err) {
console.error('Error closing connection: ' + err.stack);
return;
}
console.log('Connection closed');
});


/*


connection.connect((err) => {
if (err) {
console.error('Error connecting to MySQL server: ' + err.stack);
return;
}
    console.log("Connection Done")
    return;
});
*/
