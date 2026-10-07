import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
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
  },
  { timestamps: true },
);

const PG = mongoose.models.PG || mongoose.model("PG", pgSchema);

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
      if (storedListings.length > 0) return res.json(storedListings);
    }
  } catch (error) {
    console.error("PG query failed:", error.message);
  }
  const filtered = demoPGs.filter(
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

app.post("/api/pgs", async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1)
      return res
        .status(503)
        .json({ message: "Connect MongoDB to publish a listing." });
    const listing = await PG.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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
