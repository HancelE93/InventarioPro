import express from "express";
import cors from "cors";
import productoRoutes from "./routes/productoRoutes.js";

const app = express();

app.use(cors());

app.use(express.json({
  limit: "10mb"
}));

app.use(productoRoutes);

app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend InventarioPro funcionando 🚀"
  });
});

const PORT = 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});