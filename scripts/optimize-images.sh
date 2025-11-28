#!/bin/bash

# Script para optimizar imágenes del portfolio
# Requiere: npm install -g sharp-cli o usar cwebp/avif

echo "🖼️ Optimizando imágenes para rendimiento web..."

# Directorio de entrada y salida
INPUT_DIR="public/projects"
OUTPUT_DIR="public/projects-optimized"

# Crear directorio de salida si no existe
mkdir -p "$OUTPUT_DIR"

# Verificar si sharp-cli está instalado
if command -v sharp &> /dev/null; then
    echo "Usando sharp-cli para optimización..."
    
    for file in "$INPUT_DIR"/*.png; do
        filename=$(basename "$file" .png)
        
        # WebP optimizado para web (quality 80, max width 1200)
        sharp -i "$file" -o "$OUTPUT_DIR/${filename}.webp" -- resize 1200 --withoutEnlargement --webp --quality 80
        
        # AVIF para navegadores modernos (mejor compresión)
        sharp -i "$file" -o "$OUTPUT_DIR/${filename}.avif" -- resize 1200 --withoutEnlargement --avif --quality 60
        
        # Thumbnail para mobile (max width 640)
        sharp -i "$file" -o "$OUTPUT_DIR/${filename}-mobile.webp" -- resize 640 --withoutEnlargement --webp --quality 75
        
        echo "✅ Optimizado: $filename"
    done

# Alternativa con cwebp si está disponible
elif command -v cwebp &> /dev/null; then
    echo "Usando cwebp para optimización..."
    
    for file in "$INPUT_DIR"/*.png; do
        filename=$(basename "$file" .png)
        cwebp -q 80 -resize 1200 0 "$file" -o "$OUTPUT_DIR/${filename}.webp"
        echo "✅ Convertido a WebP: $filename"
    done

else
    echo "⚠️ No se encontró sharp-cli ni cwebp"
    echo ""
    echo "Para optimizar imágenes, ejecuta:"
    echo "  npm install -g sharp-cli"
    echo ""
    echo "O usa una herramienta online como:"
    echo "  - squoosh.app"
    echo "  - tinypng.com"
    echo ""
    echo "📋 Tamaños recomendados:"
    echo "  - Desktop: máximo 1200px de ancho, WebP quality 80"
    echo "  - Mobile: máximo 640px de ancho, WebP quality 75"
    echo "  - Formato preferido: WebP o AVIF"
fi

echo ""
echo "📊 Comparación de tamaños:"
echo "Originales:"
du -h "$INPUT_DIR"/*.png 2>/dev/null

if [ -d "$OUTPUT_DIR" ] && [ "$(ls -A $OUTPUT_DIR)" ]; then
    echo ""
    echo "Optimizadas:"
    du -h "$OUTPUT_DIR"/* 2>/dev/null
fi

