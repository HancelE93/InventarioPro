
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    ScrollView
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import {
    CameraView,
    useCameraPermissions
} from "expo-camera";

import { useProductos } from "../context/ProductoContext";

export default function NuevoProductoScreen({ navigation }: any) {
    const { agregarProducto } = useProductos();

    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria, setCategoria] = useState("");
    const [fotoBase64, setFotoBase64] =
        useState<string | null>(null);
    const [codigoBarras, setCodigoBarras] =
        useState<string | null>(null);

    const [mostrarEscaner, setMostrarEscaner] =
        useState(false);

    const [permisoCamara, solicitarPermisoCamara] =
        useCameraPermissions();

    const tomarFoto = async () => {
        const permiso =
            await ImagePicker.requestCameraPermissionsAsync();

        if (!permiso.granted) {
            Alert.alert(
                "Permiso necesario",
                "Necesitamos permiso para utilizar la cámara."
            );
            return;
        }

        const resultado =
            await ImagePicker.launchCameraAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                quality: 0.5,
                base64: true
            });

        if (
            !resultado.canceled &&
            resultado.assets[0].base64
        ) {
            setFotoBase64(
                resultado.assets[0].base64
            );
        }
    };

    const abrirEscaner = async () => {
        if (!permisoCamara?.granted) {
            const permiso =
                await solicitarPermisoCamara();

            if (!permiso.granted) {
                Alert.alert(
                    "Permiso necesario",
                    "Necesitamos permiso para utilizar la cámara."
                );
                return;
            }
        }

        setMostrarEscaner(true);
    };

    const codigoDetectado = ({
        data
    }: {
        data: string;
    }) => {
        setCodigoBarras(data);
        setMostrarEscaner(false);

        Alert.alert(
            "Código detectado",
            `Código: ${data}`
        );
    };

    const guardarProducto = async () => {
        if (!nombre.trim()) {
            Alert.alert(
                "Campo obligatorio",
                "Ingresa el nombre del producto."
            );
            return;
        }

        if (!precio.trim()) {
            Alert.alert(
                "Campo obligatorio",
                "Ingresa el precio del producto."
            );
            return;
        }

        const precioNumerico =
            Number(precio);

        if (
            isNaN(precioNumerico) ||
            precioNumerico <= 0
        ) {
            Alert.alert(
                "Precio inválido",
                "Ingresa un precio válido."
            );
            return;
        }

        try {
            await agregarProducto(
                nombre.trim(),
                precioNumerico,
                categoria.trim(),
                fotoBase64,
                codigoBarras
            );

            Alert.alert(
                "Producto guardado",
                "El producto fue registrado correctamente.",
                [
                    {
                        text: "Continuar",
                        onPress: () => {
                            setNombre("");
                            setPrecio("");
                            setCategoria("");
                            setFotoBase64(null);
                            setCodigoBarras(null);

                            navigation.navigate("Productos");
                        }
                    }
                ]
            );

        } catch (error) {
            Alert.alert(
                "Error",
                "No se pudo guardar el producto."
            );
        }
    };

    if (mostrarEscaner) {
        return (
            <View style={styles.escanerContainer}>

                <View style={styles.escanerHeader}>
                    <Text style={styles.tituloEscaner}>
                        Escanear código
                    </Text>

                    <Text style={styles.subtituloEscaner}>
                        Coloca el código dentro de la cámara
                    </Text>
                </View>

                <View style={styles.cameraContainer}>

                    <CameraView
                        style={styles.camera}
                        facing="back"
                        barcodeScannerSettings={{
                            barcodeTypes: [
                                "qr",
                                "ean13",
                                "ean8",
                                "upc_a",
                                "upc_e",
                                "code39",
                                "code93",
                                "code128"
                            ]
                        }}
                        onBarcodeScanned={
                            codigoDetectado
                        }
                    />

                    <View style={styles.marcoEscaner}>
                        <View style={styles.esquinaTopLeft} />
                        <View style={styles.esquinaTopRight} />
                        <View style={styles.esquinaBottomLeft} />
                        <View style={styles.esquinaBottomRight} />
                    </View>

                </View>

                <Text style={styles.instruccion}>
                    Apunta la cámara hacia un código QR
                    o de barras
                </Text>

                <TouchableOpacity
                    style={styles.botonCerrarEscaner}
                    onPress={() =>
                        setMostrarEscaner(false)
                    }
                    activeOpacity={0.8}
                >
                    <Text style={styles.textoBoton}>
                        Cerrar escáner
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }

    return (
        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >

            {/* ENCABEZADO */}

            <View style={styles.header}>

                <View style={styles.headerDecoracion} />

                <Text style={styles.titulo}>
                    Nuevo producto
                </Text>

                <Text style={styles.subtitulo}>
                    Agrega un producto al inventario
                </Text>

            </View>

            {/* FORMULARIO */}

            <View style={styles.formulario}>

                <Text style={styles.label}>
                    Nombre del producto
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ej: PlayStation 5"
                    placeholderTextColor="#94A3B8"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <Text style={styles.label}>
                    Precio
                </Text>

                <View style={styles.precioContainer}>

                    <Text style={styles.simboloPrecio}>
                        $
                    </Text>

                    <TextInput
                        style={styles.inputPrecio}
                        placeholder="0.00"
                        placeholderTextColor="#94A3B8"
                        value={precio}
                        onChangeText={setPrecio}
                        keyboardType="decimal-pad"
                    />

                </View>

                <Text style={styles.label}>
                    Categoría
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ej: Consolas"
                    placeholderTextColor="#94A3B8"
                    value={categoria}
                    onChangeText={setCategoria}
                />

                {/* FOTO */}

                <Text style={styles.seccionTitulo}>
                    Imagen del producto
                </Text>

                <TouchableOpacity
                    style={styles.botonCamara}
                    onPress={tomarFoto}
                    activeOpacity={0.8}
                >

                    <View style={styles.iconoCaja}>
                        <Text style={styles.iconoBoton}>
                            📷
                        </Text>
                    </View>

                    <View>
                        <Text style={styles.textoBotonPrincipal}>
                            Tomar foto
                        </Text>

                        <Text style={styles.textoBotonSecundario}>
                            Captura una imagen del producto
                        </Text>
                    </View>

                </TouchableOpacity>

                {fotoBase64 && (
                    <View style={styles.previewContainer}>

                        <Image
                            source={{
                                uri: `data:image/jpeg;base64,${fotoBase64}`
                            }}
                            style={styles.preview}
                        />

                        <View style={styles.previewEtiqueta}>
                            <Text style={styles.previewTexto}>
                                ✓ Imagen lista
                            </Text>
                        </View>

                    </View>
                )}

                {/* CÓDIGO */}

                <Text style={styles.seccionTitulo}>
                    Código del producto
                </Text>

                <TouchableOpacity
                    style={styles.botonEscanear}
                    onPress={abrirEscaner}
                    activeOpacity={0.8}
                >

                    <View style={styles.iconoCajaAzul}>
                        <Text style={styles.iconoBoton}>
                            📱
                        </Text>
                    </View>

                    <View>
                        <Text style={styles.textoBotonPrincipalAzul}>
                            Escanear código
                        </Text>

                        <Text style={styles.textoBotonSecundario}>
                            QR o código de barras
                        </Text>
                    </View>

                </TouchableOpacity>

                {codigoBarras && (
                    <View style={styles.codigoContainer}>

                        <View style={styles.codigoIcono}>
                            <Text style={styles.checkCodigo}>
                                ✓
                            </Text>
                        </View>

                        <View style={styles.codigoInfo}>

                            <Text style={styles.codigoTitulo}>
                                Código detectado
                            </Text>

                            <Text style={styles.codigoTexto}>
                                {codigoBarras}
                            </Text>

                        </View>

                    </View>
                )}

                {/* GUARDAR */}

                <TouchableOpacity
                    style={styles.botonGuardar}
                    onPress={guardarProducto}
                    activeOpacity={0.85}
                >

                    <Text style={styles.iconoGuardar}>
                        ✓
                    </Text>

                    <Text style={styles.textoGuardar}>
                        Guardar Producto
                    </Text>

                </TouchableOpacity>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    scroll: {
        flex: 1,
        backgroundColor: "#F4F7FB"
    },

    container: {
        paddingBottom: 40
    },

    header: {
        backgroundColor: "#0F2747",
        paddingHorizontal: 20,
        paddingTop: 55,
        paddingBottom: 25,
        position: "relative",
        overflow: "hidden"
    },

    headerDecoracion: {
        position: "absolute",
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: "#1E4A78",
        right: -45,
        top: -65,
        opacity: 0.7
    },

    titulo: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF"
    },

    subtitulo: {
        fontSize: 14,
        color: "#B9C9DC",
        marginTop: 6
    },

    formulario: {
        paddingHorizontal: 20,
        paddingTop: 20
    },

    label: {
        fontSize: 14,
        fontWeight: "700",
        color: "#334155",
        marginBottom: 7,
        marginTop: 14
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: "#D7E0EA",
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#0F172A",
        backgroundColor: "#FFFFFF"
    },

    precioContainer: {
        height: 52,
        borderWidth: 1,
        borderColor: "#D7E0EA",
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center"
    },

    simboloPrecio: {
        fontSize: 18,
        fontWeight: "700",
        color: "#64748B",
        marginLeft: 15
    },

    inputPrecio: {
        flex: 1,
        height: 52,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#0F172A"
    },

    seccionTitulo: {
        fontSize: 16,
        fontWeight: "800",
        color: "#0F172A",
        marginTop: 25,
        marginBottom: 10
    },

    botonCamara: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D7E0EA",
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center"
    },

    iconoCaja: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#EEF4FA",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },

    iconoCajaAzul: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: "#E8F1FB",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },

    iconoBoton: {
        fontSize: 23
    },

    textoBotonPrincipal: {
        fontSize: 15,
        fontWeight: "800",
        color: "#0F172A"
    },

    textoBotonPrincipalAzul: {
        fontSize: 15,
        fontWeight: "800",
        color: "#1D5FA7"
    },

    textoBotonSecundario: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 2
    },

    previewContainer: {
        marginTop: 14,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#D7E0EA"
    },

    preview: {
        width: "100%",
        height: 230
    },

    previewEtiqueta: {
        paddingVertical: 9,
        paddingHorizontal: 12,
        backgroundColor: "#F0FDF4"
    },

    previewTexto: {
        color: "#15803D",
        fontWeight: "700",
        fontSize: 13
    },

    botonEscanear: {
        backgroundColor: "#F1F7FD",
        borderWidth: 1,
        borderColor: "#BFD7ED",
        borderRadius: 14,
        padding: 14,
        flexDirection: "row",
        alignItems: "center"
    },

    codigoContainer: {
        marginTop: 12,
        backgroundColor: "#F0FDF4",
        borderWidth: 1,
        borderColor: "#BBF7D0",
        borderRadius: 12,
        padding: 13,
        flexDirection: "row",
        alignItems: "center"
    },

    codigoIcono: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#DCFCE7",
        justifyContent: "center",
        alignItems: "center"
    },

    checkCodigo: {
        color: "#15803D",
        fontSize: 17,
        fontWeight: "800"
    },

    codigoInfo: {
        marginLeft: 10,
        flex: 1
    },

    codigoTitulo: {
        fontSize: 12,
        color: "#64748B",
        marginBottom: 2
    },

    codigoTexto: {
        fontSize: 16,
        fontWeight: "800",
        color: "#166534"
    },

    botonGuardar: {
        backgroundColor: "#0F766E",
        height: 56,
        borderRadius: 13,
        marginTop: 30,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",

        shadowColor: "#0F766E",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,

        elevation: 4
    },

    iconoGuardar: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "800",
        marginRight: 8
    },

    textoGuardar: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800"
    },

    escanerContainer: {
        flex: 1,
        backgroundColor: "#000000"
    },

    escanerHeader: {
        paddingTop: 55,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: "#0F2747"
    },

    tituloEscaner: {
        color: "#FFFFFF",
        fontSize: 23,
        fontWeight: "800",
        textAlign: "center"
    },

    subtituloEscaner: {
        color: "#CBD5E1",
        fontSize: 13,
        textAlign: "center",
        marginTop: 5
    },

    cameraContainer: {
        flex: 1,
        position: "relative"
    },

    camera: {
        flex: 1
    },

    marcoEscaner: {
        position: "absolute",
        top: "35%",
        left: "10%",
        right: "10%",
        height: 150
    },

    esquinaTopLeft: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 35,
        height: 35,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: "#FFFFFF"
    },

    esquinaTopRight: {
        position: "absolute",
        top: 0,
        right: 0,
        width: 35,
        height: 35,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: "#FFFFFF"
    },

    esquinaBottomLeft: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 35,
        height: 35,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: "#FFFFFF"
    },

    esquinaBottomRight: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 35,
        height: 35,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: "#FFFFFF"
    },

    instruccion: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 14,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: "#0F172A"
    },

    botonCerrarEscaner: {
        backgroundColor: "#DC2626",
        height: 52,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },

    textoBoton: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "800"
    }

});
