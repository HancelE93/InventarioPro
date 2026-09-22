
import React from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert
} from "react-native";

import {
    useProductos,
    Producto
} from "../context/ProductoContext";

export default function ProductosScreen() {
    const {
        productos,
        eliminarProducto
    } = useProductos();

    const confirmarEliminar = (producto: Producto) => {
        Alert.alert(
            "Eliminar producto",
            `¿Quieres eliminar "${producto.nombre}"?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await eliminarProducto(producto.id);

                            Alert.alert(
                                "Producto eliminado",
                                "El producto fue eliminado correctamente."
                            );
                        } catch (error) {
                            Alert.alert(
                                "Error",
                                "No se pudo eliminar el producto."
                            );
                        }
                    }
                }
            ]
        );
    };

    const renderProducto = ({
        item
    }: {
        item: Producto;
    }) => {
        return (
            <View style={styles.card}>

                {/* IMAGEN */}

                {item.fotoBase64 ? (
                    <Image
                        source={{
                            uri: `data:image/jpeg;base64,${item.fotoBase64}`
                        }}
                        style={styles.imagen}
                    />
                ) : (
                    <View style={styles.sinImagen}>
                        <Text style={styles.iconoSinImagen}>
                            📦
                        </Text>

                        <Text style={styles.sinImagenTexto}>
                            Sin imagen
                        </Text>
                    </View>
                )}

                {/* INFORMACIÓN */}

                <View style={styles.informacion}>

                    <Text
                        style={styles.nombre}
                        numberOfLines={2}
                    >
                        {item.nombre}
                    </Text>

                    <View style={styles.categoriaBadge}>
                        <Text style={styles.categoria}>
                            {item.categoria || "Sin categoría"}
                        </Text>
                    </View>

                    <Text style={styles.codigo}>
                        Código: {item.codigoBarras || "Sin código"}
                    </Text>

                    <Text style={styles.precio}>
                        ${item.precio.toFixed(2)}
                    </Text>

                    <TouchableOpacity
                        style={styles.botonEliminar}
                        onPress={() =>
                            confirmarEliminar(item)
                        }
                        activeOpacity={0.8}
                    >
                        <Text style={styles.textoEliminar}>
                            🗑️  Eliminar
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>
        );
    };

    return (
        <View style={styles.container}>

            {/* ENCABEZADO */}

            <View style={styles.header}>

                <View style={styles.decoracionHeader} />

                <View>
                    <Text style={styles.titulo}>
                        InventarioPro
                    </Text>

                    <Text style={styles.subtitulo}>
                        Gestión de productos
                    </Text>
                </View>

                <View style={styles.contador}>

                    <Text style={styles.numeroProductos}>
                        {productos.length}
                    </Text>

                    <Text style={styles.textoProductos}>
                        productos
                    </Text>

                </View>

            </View>

            {/* LISTA */}

            {productos.length === 0 ? (

                <View style={styles.vacio}>

                    <View style={styles.iconoVacio}>
                        <Text style={styles.emojiVacio}>
                            📦
                        </Text>
                    </View>

                    <Text style={styles.tituloVacio}>
                        Inventario vacío
                    </Text>

                    <Text style={styles.textoVacio}>
                        Todavía no tienes productos registrados.
                    </Text>

                </View>

            ) : (

                <FlatList
                    data={productos}
                    keyExtractor={(item) =>
                        item.id.toString()
                    }
                    renderItem={renderProducto}
                    contentContainerStyle={styles.lista}
                    showsVerticalScrollIndicator={false}
                />

            )}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F4F7FB"
    },

    header: {
        backgroundColor: "#0F2747",
        paddingHorizontal: 20,
        paddingTop: 55,
        paddingBottom: 22,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",
        position: "relative"
    },

    decoracionHeader: {
        position: "absolute",
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: "#1E4A78",
        right: -55,
        top: -75,
        opacity: 0.7
    },

    titulo: {
        fontSize: 27,
        fontWeight: "800",
        color: "#FFFFFF"
    },

    subtitulo: {
        fontSize: 14,
        color: "#B9C9DC",
        marginTop: 5
    },

    contador: {
        backgroundColor: "#1E4A78",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: "center",
        minWidth: 65,
        borderWidth: 1,
        borderColor: "#37628D"
    },

    numeroProductos: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FFFFFF"
    },

    textoProductos: {
        fontSize: 10,
        color: "#C7D7E8",
        marginTop: 1
    },

    lista: {
        padding: 16,
        paddingBottom: 30
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 14,
        padding: 12,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#E1E8F0",

        shadowColor: "#0F2747",
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,

        elevation: 3
    },

    imagen: {
        width: 115,
        height: 125,
        borderRadius: 12,
        backgroundColor: "#EEF3F8"
    },

    sinImagen: {
        width: 115,
        height: 125,
        borderRadius: 12,
        backgroundColor: "#EEF3F8",
        justifyContent: "center",
        alignItems: "center"
    },

    iconoSinImagen: {
        fontSize: 30,
        marginBottom: 5
    },

    sinImagenTexto: {
        color: "#94A3B8",
        fontSize: 12,
        fontWeight: "600"
    },

    informacion: {
        flex: 1,
        marginLeft: 14,
        justifyContent: "center"
    },

    nombre: {
        fontSize: 18,
        fontWeight: "800",
        color: "#0F172A",
        marginBottom: 6
    },

    categoriaBadge: {
        backgroundColor: "#E8F1FB",
        borderRadius: 6,
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginBottom: 6
    },

    categoria: {
        fontSize: 12,
        fontWeight: "700",
        color: "#1E4A78"
    },

    codigo: {
        fontSize: 12,
        color: "#64748B",
        marginBottom: 6
    },

    precio: {
        fontSize: 20,
        fontWeight: "800",
        color: "#0F2747",
        marginBottom: 9
    },

    botonEliminar: {
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        paddingVertical: 7,
        paddingHorizontal: 11,
        borderRadius: 8,
        alignSelf: "flex-start"
    },

    textoEliminar: {
        color: "#DC2626",
        fontSize: 12,
        fontWeight: "700"
    },

    vacio: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 35
    },

    iconoVacio: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#E8F1FB",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 18
    },

    emojiVacio: {
        fontSize: 40
    },

    tituloVacio: {
        fontSize: 21,
        fontWeight: "800",
        color: "#0F2747",
        marginBottom: 7
    },

    textoVacio: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 21
    }

});
