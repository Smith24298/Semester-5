const propertyForm = document.getElementById("propertyForm");

const addAmenityBtn = document.getElementById("addAmenityBtn");
const addRuleBtn = document.getElementById("addRuleBtn");

const amenitiesContainer = document.getElementById("amenitiesContainer");
const rulesContainer = document.getElementById("rulesContainer");

const coverImage = document.getElementById("coverImage");
const galleryImages = document.getElementById("galleryImages");

const coverPreview = document.getElementById("coverPreview");
const galleryPreview = document.getElementById("galleryPreview");
const properties = [];


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

document.addEventListener("click", (event) => {

    if(event.target.classList.contains("remove-btn")){

        event.target.parentElement.remove();

    }

});


coverImage.addEventListener("change", function(){

    coverPreview.innerHTML = "";

    const file = this.files[0];

    if(!file) return;

    const image = document.createElement("img");

    image.src = URL.createObjectURL(file);

    coverPreview.appendChild(image);

});


galleryImages.addEventListener("change", function(){

    galleryPreview.innerHTML = "";

    [...this.files].forEach(file=>{

        const image = document.createElement("img");

        image.src = URL.createObjectURL(file);

        galleryPreview.appendChild(image);

    });

});


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

    properties.push(propertyData);

renderProperties();

propertyForm.reset();

coverPreview.innerHTML = "";
galleryPreview.innerHTML = "";

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
function fileToBase64(file) {
    return new Promise((resolve, reject) => {

        if (!file) {
            resolve("");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });
}
propertyForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Convert cover image to Base64
    const coverImageData = await fileToBase64(coverImage.files[0]);
    console.log("Cover Image Base64:", coverImageData);

    const propertyData = {

        image: coverImageData,

        basicInformation: {

            propertyName: document.getElementById("propertyName").value,

            propertyType: document.getElementById("propertyType").value,

            suitableFor: document.getElementById("propertyFor").value,

            propertyStatus: document.getElementById("propertyStatus").value,

            description: document.getElementById("description").value

        },

        location: {

            university: document.getElementById("university").value,

            city: document.getElementById("city").value,

            state: document.getElementById("state").value,

            pincode: document.getElementById("pincode").value,

            address: document.getElementById("address").value,

            googleLocation: document.getElementById("googleLocation").value

        },

        pricing: {

            monthlyRent: document.getElementById("monthlyRent").value,

            securityDeposit: document.getElementById("securityDeposit").value,

            maintenance: document.getElementById("maintenance").value

        },

        rooms: {

            totalRooms: document.getElementById("rooms").value,

            totalBeds: document.getElementById("beds").value,

            availableBeds: document.getElementById("availableBeds").value

        },

        contact: {

            ownerName: document.getElementById("ownerName").value,

            phone: document.getElementById("phone").value,

            whatsapp: document.getElementById("whatsapp").value,

            email: document.getElementById("email").value

        },

        amenities: getAmenities(),

        rules: getRules()

    };

    properties.push(propertyData);

    renderProperties();

    propertyForm.reset();

    coverPreview.innerHTML = "";

    galleryPreview.innerHTML = "";

});
function renderProperties() {

    const container = document.getElementById("propertyList");

    container.innerHTML = "";

    properties.forEach((property) => {

        const amenities = property.amenities
            .map(item => `<span class="amenity">${item}</span>`)
            .join("");

        const image = property.image || "https://placehold.co/600x400?text=No+Image";

        container.innerHTML += `

        <div class="property-card">

            <div class="property-image">

                <img src="${image}" alt="${property.basicInformation.propertyName}">

                <span class="status">
                    ${property.basicInformation.propertyStatus}
                </span>

            </div>

            <div class="property-content">

                <h2 class="property-name">
                    ${property.basicInformation.propertyName}
                </h2>

                <p class="location">
                    📍 ${property.location.city}, ${property.location.state}
                </p>

                <div class="property-info">

                    <div>
                        <span>Property</span>
                        <strong>${property.basicInformation.propertyType}</strong>
                    </div>

                    <div>
                        <span>Suitable For</span>
                        <strong>${property.basicInformation.suitableFor}</strong>
                    </div>

                    <div>
                        <span>Total Rooms</span>
                        <strong>${property.rooms.totalRooms}</strong>
                    </div>

                    <div>
                        <span>Available Beds</span>
                        <strong>${property.rooms.availableBeds}</strong>
                    </div>

                </div>

                <p class="description">
                    ${property.basicInformation.description}
                </p>

                <p>
                    🎓 Nearby University:
                    <strong>${property.location.university}</strong>
                </p>

                <div class="amenities">
                    ${amenities}
                </div>

                <div class="price">

                    <div>
                        <h2>₹${property.pricing.monthlyRent}</h2>
                        <span>per month</span>
                    </div>

                </div>

                <div class="card-buttons">

                    <button class="view-btn">
                        View Details
                    </button>

                    <button class="contact-btn">
                        Contact Owner
                    </button>

                </div>

            </div>

        </div>

        `;

    });

}