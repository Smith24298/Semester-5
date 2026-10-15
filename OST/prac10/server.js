import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pgSchema = new mongoose.Schema(
  {
    name: String,
    area: String,
    city: String,
    rent: Number,
    rooms: Number,
    type: String,
    gender: String,
    rating: Number,
    distance: String,
    verified: Boolean,
    amenities: [String],
    description: String,
    image: String,
    owner: { name: String, phone: String, avatar: String },
    ownerId: String,
  },
  { timestamps: true },
);

const PG = mongoose.models.PG || mongoose.model("PG", pgSchema);

const ownerSchema = new mongoose.Schema(
  {
    externalId: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    bio: String,
  },
  { timestamps: true },
);
const Owner = mongoose.models.Owner || mongoose.model("Owner", ownerSchema);

const memoryOwners = new Map();
const memoryProperties = [];

const demoPGs = [
  {
    id: 1,
    name: "The Fern House",
    area: "Koramangala",
    city: "Bengaluru",
    rent: 14500,
    rooms: 2,
    type: "Co-living",
    gender: "Any",
    rating: 4.8,
    distance: "0.8 km from metro",
    verified: true,
    amenities: ["Wi-Fi", "Meals", "Laundry"],
    description:
      "A warm, design-forward home with sunlight, community dinners and a calm work lounge.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    owner: { name: "Maya Rao", phone: "+91 98765 43210", avatar: "MR" },
  },
  {
    id: 2,
    name: "Sunday House",
    area: "Indiranagar",
    city: "Bengaluru",
    rent: 18000,
    rooms: 1,
    type: "Private room",
    gender: "Female",
    rating: 4.9,
    distance: "1.2 km from metro",
    verified: true,
    amenities: ["AC", "Housekeeping", "Gym"],
    description:
      "Quiet private rooms in the middle of Indiranagar, with a rooftop and friendly house rules.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    owner: { name: "Ananya Menon", phone: "+91 91234 56789", avatar: "AM" },
  },
  {
    id: 3,
    name: "Mango Tree PG",
    area: "HSR Layout",
    city: "Bengaluru",
    rent: 11000,
    rooms: 3,
    type: "Shared room",
    gender: "Male",
    rating: 4.6,
    distance: "2.4 km from metro",
    verified: false,
    amenities: ["Wi-Fi", "Parking", "Meals"],
    description:
      "Spacious, practical living for students and young professionals close to cafés and offices.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    owner: { name: "Rohan Kulkarni", phone: "+91 99887 66554", avatar: "RK" },
  },
  {
    id: 4,
    name: "Nook & Nest",
    area: "Whitefield",
    city: "Bengaluru",
    rent: 15500,
    rooms: 1,
    type: "Private room",
    gender: "Any",
    rating: 4.7,
    distance: "0.5 km from metro",
    verified: true,
    amenities: ["Wi-Fi", "AC", "Security"],
    description:
      "A modern, secure stay built for comfortable work weeks and easy city access.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    owner: { name: "Dev Shah", phone: "+91 90000 11223", avatar: "DS" },
  },
];

app.get("/api/pgs", async (req, res) => {
  const { area, maxRent, gender, type } = req.query;
  try {
    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (area) filter.area = new RegExp(area, "i");
      if (maxRent) filter.rent = { $lte: Number(maxRent) };
      if (gender && gender !== "Any") filter.gender = { $in: [gender, "Any"] };
      if (type && type !== "All") filter.type = type;
      const storedListings = await PG.find(filter).sort({ rating: -1 }).lean();
      return res.json(storedListings.length > 0 ? storedListings : demoPGs);
    }
  } catch (error) {
    console.error("PG query failed:", error.message);
  }
  const filtered = [...memoryProperties, ...demoPGs].filter(
    (pg) =>
      (!area || pg.area.toLowerCase().includes(area.toLowerCase())) &&
      (!maxRent || pg.rent <= Number(maxRent)) &&
      (!gender ||
        gender === "Any" ||
        pg.gender === gender ||
        pg.gender === "Any") &&
      (!type || type === "All" || pg.type === type),
  );
  res.json(filtered);
});

app.get("/api/pgs/:id", async (req, res) => {
  try {
    if (
      mongoose.connection.readyState === 1 &&
      mongoose.isValidObjectId(req.params.id)
    ) {
      const listing = await PG.findById(req.params.id).lean();
      if (listing) return res.json(listing);
    }
  } catch (error) {
    console.error("PG detail query failed:", error.message);
  }
  const listing = demoPGs.find((pg) => String(pg.id) === req.params.id);
  if (!listing) return res.status(404).json({ message: "Property not found." });
  res.json(listing);
});

app.post("/api/pgs", async (req, res) => {
  try {
    const payload = { ...req.body, ownerId: req.body.ownerId || "demo-owner" };
    if (
      !payload.name ||
      !payload.area ||
      !payload.rent ||
      !payload.description
    ) {
      return res
        .status(400)
        .json({ message: "Name, area, rent and description are required." });
    }
    if (mongoose.connection.readyState === 1) {
      const listing = await PG.create(payload);
      return res.status(201).json(listing);
    }
    const listing = {
      ...payload,
      id: randomUUID(),
      rating: 0,
      distance: "Owner listing",
      verified: false,
      createdAt: new Date().toISOString(),
    };
    memoryProperties.unshift(listing);
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/api/owners/:ownerId", async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    const owner = await Owner.findOne({
      $or: [
        { externalId: req.params.ownerId },
        ...(mongoose.isValidObjectId(req.params.ownerId)
          ? [{ _id: req.params.ownerId }]
          : []),
      ],
    }).lean();
    if (owner) return res.json(owner);
  }
  const owner = memoryOwners.get(req.params.ownerId);
  res.json(
    owner || {
      _id: req.params.ownerId,
      name: "",
      phone: "",
      email: "",
      bio: "",
    },
  );
});

app.put("/api/owners/:ownerId", async (req, res) => {
  const { name, phone, email = "", bio = "" } = req.body;
  if (!name || !phone)
    return res.status(400).json({ message: "Name and phone are required." });
  if (mongoose.connection.readyState === 1) {
    const owner = await Owner.findOneAndUpdate(
      { externalId: req.params.ownerId },
      { externalId: req.params.ownerId, name, phone, email, bio },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();
    return res.json(owner);
  }
  const owner = {
    _id: req.params.ownerId,
    name,
    phone,
    email,
    bio,
    updatedAt: new Date().toISOString(),
  };
  memoryOwners.set(req.params.ownerId, owner);
  res.json(owner);
});

app.get("/api/owners/:ownerId/pgs", async (req, res) => {
  if (mongoose.connection.readyState === 1)
    return res.json(
      await PG.find({ ownerId: req.params.ownerId })
        .sort({ createdAt: -1 })
        .lean(),
    );
  res.json(
    memoryProperties.filter(
      (property) => property.ownerId === req.params.ownerId,
    ),
  );
});

app.patch("/api/pgs/:id", async (req, res) => {
  if (
    mongoose.connection.readyState === 1 &&
    mongoose.isValidObjectId(req.params.id)
  ) {
    const listing = await PG.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).lean();
    if (listing) return res.json(listing);
  }
  const index = memoryProperties.findIndex(
    (property) => property.id === req.params.id,
  );
  if (index === -1)
    return res.status(404).json({ message: "Property not found." });
  memoryProperties[index] = {
    ...memoryProperties[index],
    ...req.body,
    id: req.params.id,
  };
  res.json(memoryProperties[index]);
});

app.delete("/api/pgs/:id", async (req, res) => {
  if (
    mongoose.connection.readyState === 1 &&
    mongoose.isValidObjectId(req.params.id)
  ) {
    const listing = await PG.findByIdAndDelete(req.params.id).lean();
    if (listing) return res.json({ ok: true });
  }
  const index = memoryProperties.findIndex(
    (property) => property.id === req.params.id,
  );
  if (index === -1)
    return res.status(404).json({ message: "Property not found." });
  memoryProperties.splice(index, 1);
  res.json({ ok: true });
});

app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "demo mode",
  }),
);

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nestly")
  .then(() => console.log("MongoDB connected"))
  .catch(() => console.log("MongoDB unavailable: running in demo mode"));
app.listen(port, () =>
  console.log(`Nestly running at http://localhost:${port}`),
);
