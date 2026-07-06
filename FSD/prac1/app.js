const fs = require('fs');

const object = { 
    "name" : "smith",
    "subject" : "FSD",
    "age" : 25
}

const jsonString = JSON.stringify(object);
const path = 'data.json';

fs.writeFile(path,jsonString,(err)=>{
    if(err){
        console.log("Error in writing file");
    }else{
        console.log("file write sucessfull");
    }
})