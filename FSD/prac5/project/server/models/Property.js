const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: true,
        trim: true
    },
    propertyType: {
        type: String,
        enum: ["pg", "hostel", "apartment"],
        required: true
    },
    roomType: {
        type: String,
        enum: ["single", "double", "triple", "dormitory"],
        required: true
    },
    gender: {
        type: String,
        enum: ["boys", "girls", "unisex"],
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        match: /^[0-9]{6}$/
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    mapLink: {
        type: String,
        trim: true,
        default: ""
    },
    lat: {
        type: Number,
        default: null
    },
    lng: {
        type: Number,
        default: null
    },
    monthlyRent: {
        type: Number,
        required: true,
        min: 0
    },
    securityDeposit: {
        type: Number,
        required: true,
        min: 0
    },
    availableRooms: {
        type: Number,
        required: true,
        min: 1
    },
    availability: {
        type: String,
        enum: ["available", "occupied", "pending"],
        default: "available"
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    ownerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/
    },
    facilities: [{
        type: String,
        enum: ["wifi", "meals", "parking", "laundry", "housekeeping", "powerBackup", "ac", "water", "security", "cctv", "gym", "studyArea"]
    }],
    images: [{
        type: String
    }],
    image: {
        type: String,
        default: null
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

propertySchema.index({ city: 1, location: 1 });
propertySchema.index({ propertyName: "text", location: "text", city: "text", description: "text" });
propertySchema.index({ lat: 1, lng: 1 });

module.exports = mongoose.model("Property", propertySchema);