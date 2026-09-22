import { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /productos
export const obtenerProductos = async (
  req: Request,
  res: Response
) => {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: {
        id: "desc"
      }
    });

    res.json(productos);
  } catch (error) {
    res.status(500).json({
      error: "No se pudieron obtener los productos"
    });
  }
};

// POST /productos
export const crearProducto = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      nombre,
      precio,
      categoria,
      fotoBase64,
      codigoBarras
    } = req.body;

    if (!nombre || precio === undefined) {
      return res.status(400).json({
        error: "Nombre y precio son obligatorios"
      });
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        precio: Number(precio),
        categoria: categoria || "",
        fotoBase64: fotoBase64 || null,
        codigoBarras: codigoBarras || null
      }
    });

    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({
      error: "No se pudo crear el producto"
    });
  }
};

// PUT /productos/:id
export const actualizarProducto = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const {
      nombre,
      precio,
      categoria,
      fotoBase64,
      codigoBarras
    } = req.body;

    const data: any = {};

    if (nombre !== undefined) {
      data.nombre = nombre;
    }

    if (precio !== undefined) {
      data.precio = Number(precio);
    }

    if (categoria !== undefined) {
      data.categoria = categoria;
    }

    if (fotoBase64 !== undefined) {
      data.fotoBase64 = fotoBase64;
    }

    if (codigoBarras !== undefined) {
      data.codigoBarras = codigoBarras;
    }

    const producto = await prisma.producto.update({
      where: {
        id
      },
      data
    });

    res.json(producto);
  } catch (error) {
    res.status(500).json({
      error: "No se pudo actualizar el producto"
    });
  }
};

// DELETE /productos/:id
export const eliminarProducto = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.producto.delete({
      where: {
        id
      }
    });

    res.json({
      mensaje: "Producto eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      error: "No se pudo eliminar el producto"
    });
  }
};