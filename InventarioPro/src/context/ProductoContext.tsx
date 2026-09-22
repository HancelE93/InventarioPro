import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";

import { api } from "../config/api";

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  fotoBase64?: string | null;
  codigoBarras?: string | null;
  createdAt: string;
};

type ProductoContextType = {
  productos: Producto[];
  cargarProductos: () => Promise<void>;

  agregarProducto: (
    nombre: string,
    precio: number,
    categoria: string,
    fotoBase64?: string | null,
    codigoBarras?: string | null
  ) => Promise<void>;

  eliminarProducto: (id: number) => Promise<void>;
};

const ProductoContext = createContext<
  ProductoContextType | undefined
>(undefined);

type Props = {
  children: ReactNode;
};

export const ProductoProvider = ({ children }: Props) => {
  const [productos, setProductos] = useState<Producto[]>([]);

  // Obtener todos los productos
  const cargarProductos = async () => {
    try {
      const response = await api.get<Producto[]>("/productos");

      setProductos(response.data);
    } catch (error) {
      console.error(
        "Error al cargar productos:",
        error
      );
    }
  };

  // Crear producto
  const agregarProducto = async (
    nombre: string,
    precio: number,
    categoria: string,
    fotoBase64?: string | null,
    codigoBarras?: string | null
  ) => {
    try {
      const response = await api.post<Producto>(
        "/productos",
        {
          nombre,
          precio,
          categoria,
          fotoBase64: fotoBase64 || null,
          codigoBarras: codigoBarras || null
        }
      );

      setProductos((productosActuales) => [
        response.data,
        ...productosActuales
      ]);
    } catch (error) {
      console.error(
        "Error al crear producto:",
        error
      );

      throw error;
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id: number) => {
    try {
      await api.delete(`/productos/${id}`);

      setProductos((productosActuales) =>
        productosActuales.filter(
          (producto) => producto.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Error al eliminar producto:",
        error
      );

      throw error;
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <ProductoContext.Provider
      value={{
        productos,
        cargarProductos,
        agregarProducto,
        eliminarProducto
      }}
    >
      {children}
    </ProductoContext.Provider>
  );
};

export const useProductos = () => {
  const context = useContext(ProductoContext);

  if (!context) {
    throw new Error(
      "useProductos debe utilizarse dentro de ProductoProvider"
    );
  }

  return context;
};