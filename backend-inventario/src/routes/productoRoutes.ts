import { Router } from "express";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productoController.js";

const router = Router();

router.get("/productos", obtenerProductos);

router.post("/productos", crearProducto);

router.put("/productos/:id", actualizarProducto);

router.delete("/productos/:id", eliminarProducto);

export default router;