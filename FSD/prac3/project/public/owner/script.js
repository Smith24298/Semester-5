/* ==========================================================
   PG & Hostel Finder
   Owner Dashboard
   script.js
========================================================== */

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const propertyForm = document.getElementById("propertyForm");

const addAmenityBtn = document.getElementById("addAmenityBtn");
const addRuleBtn = document.getElementById("addRuleBtn");

const amenitiesContainer = document.getElementById("amenitiesContainer");
const rulesContainer = document.getElementById("rulesContainer");

const coverImage = document.getElementById("coverImage");
const galleryImages = document.getElementById("galleryImages");

const coverPreview = document.getElementById("coverPreview");
const galleryPreview = document.getElementById("galleryPreview");


/* ==========================================================
   ADD AMENITY
========================================================== */

addAmenityBtn.addEventListener("click", () => {

    const row = document.createElement("div");

    row.className = "dynamic-row";

    row.innerHTML = `
        <input
            type="text"
            placeholder="Amenity Name">

        <button
            type="button"
            class="remove-btn">
            Remove
        </button>
    `;

    amenitiesContainer.appendChild(row);

});


/* ==========================================================
   ADD RULE
========================================================== */

addRuleBtn.addEventListener("click", () => {

    const row = document.createElement("div");

    row.className = "dynamic-row";

    row.innerHTML = `
        <input
            type="text"
            placeholder="Property Rule">

        <button
            type="button"
            class="remove-btn">
            Remove
        </button>
    `;

    rulesContainer.appendChild(row);

});


/* ==========================================================
   REMOVE BUTTON
========================================================== */

document.addEventListener("click", (event) => {

    if(event.target.classList.contains("remove-btn")){

        event.target.parentElement.remove();

    }

});


/* ==========================================================
   COVER IMAGE PREVIEW
========================================================== */

coverImage.addEventListener("change", function(){

    coverPreview.innerHTML = "";

    const file = this.files[0];

    if(!file) return;

    const image = document.createElement("img");

    image.src = URL.createObjectURL(file);

    coverPreview.appendChild(image);

});


/* ==========================================================
   GALLERY IMAGE PREVIEW
========================================================== */

galleryImages.addEventListener("change", function(){

    galleryPreview.innerHTML = "";

    [...this.files].forEach(file=>{

        const image = document.createElement("img");

        image.src = URL.createObjectURL(file);

        galleryPreview.appendChild(image);

    });

});


/* ==========================================================
   VALIDATION
========================================================== */

function validateForm(){

    let valid = true;

    document.querySelectorAll(".error").forEach(error=>{

        error.innerText = "";

    });

    const requiredFields = [

        {
            id:"propertyName",
            message:"Property name is required"
        },

        {
            id:"propertyType",
            message:"Select property type"
        },

        {
            id:"propertyFor",
            message:"Select category"
        },

        {
            id:"university",
            message:"University is required"
        },

        {
            id:"city",
            message:"City is required"
        },

        {
            id:"state",
            message:"State is required"
        },

        {
            id:"address",
            message:"Address is required"
        }

    ];

    requiredFields.forEach(field=>{

        const input = document.getElementById(field.id);

        if(input.value.trim()===""){

            valid = false;

            const error = input.parentElement.querySelector(".error");

            if(error){

                error.innerText = field.message;

            }

        }

    });

    return valid;

}


/* ==========================================================
   COLLECT AMENITIES
========================================================== */

function getAmenities(){

    const amenities = [];

    amenitiesContainer
        .querySelectorAll("input")
        .forEach(input=>{

            if(input.value.trim()!==""){

                amenities.push(input.value.trim());

            }

        });

    return amenities;

}


/* ==========================================================
   COLLECT RULES
========================================================== */

function getRules(){

    const rules = [];

    rulesContainer
        .querySelectorAll("input")
        .forEach(input=>{

            if(input.value.trim()!==""){

                rules.push(input.value.trim());

            }

        });

    return rules;

}


/* ==========================================================
   FORM SUBMIT
========================================================== */

propertyForm.addEventListener("submit", async(event)=>{

    event.preventDefault();

    if(!validateForm()){

        return;

    }

    const propertyData = {

        basicInformation:{

            propertyName:
                document.getElementById("propertyName").value,

            propertyType:
                document.getElementById("propertyType").value,

            suitableFor:
                document.getElementById("propertyFor").value,

            propertyStatus:
                document.getElementById("propertyStatus").value,

            description:
                document.getElementById("description").value

        },

        location:{

            university:
                document.getElementById("university").value,

            city:
                document.getElementById("city").value,

            state:
                document.getElementById("state").value,

            pincode:
                document.getElementById("pincode").value,

            address:
                document.getElementById("address").value,

            googleLocation:
                document.getElementById("googleLocation").value

        },

        pricing:{

            monthlyRent:
                document.getElementById("monthlyRent").value,

            securityDeposit:
                document.getElementById("securityDeposit").value,

            maintenance:
                document.getElementById("maintenance").value

        },

        rooms:{

            totalRooms:
                document.getElementById("rooms").value,

            totalBeds:
                document.getElementById("beds").value,

            availableBeds:
                document.getElementById("availableBeds").value

        },

        contact:{

            ownerName:
                document.getElementById("ownerName").value,

            phone:
                document.getElementById("phone").value,

            whatsapp:
                document.getElementById("whatsapp").value,

            email:
                document.getElementById("email").value

        },

        amenities:getAmenities(),

        rules:getRules()

    };

    console.clear();

    console.log("PROPERTY DATA");

    console.log(propertyData);

    /*
    =======================================================
        Backend Integration
    =======================================================

    await fetch("http://localhost:3000/api/property",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(propertyData)

    });

    */

    alert("Property data collected successfully!");

});


/* ==========================================================
   RESET FORM
========================================================== */

propertyForm.addEventListener("reset",()=>{

    setTimeout(()=>{

        coverPreview.innerHTML="";

        galleryPreview.innerHTML="";

    },100);

});


/* ==========================================================
   OPTIONAL:
   PRELOAD COMMON AMENITIES
========================================================== */

// Uncomment if you want default amenities

/*
const defaultAmenities = [

    "WiFi",
    "Food",
    "Laundry",
    "Parking"

];

amenitiesContainer.innerHTML = "";

defaultAmenities.forEach(item=>{

    const row = document.createElement("div");

    row.className = "dynamic-row";

    row.innerHTML = `
        <input
            type="text"
            value="${item}">

        <button
            type="button"
            class="remove-btn">
            Remove
        </button>
    `;

    amenitiesContainer.appendChild(row);

});
*/