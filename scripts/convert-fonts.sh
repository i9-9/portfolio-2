#!/bin/bash

# Script para convertir fuentes TTF a WOFF2
# Requiere: npm install -g ttf2woff2 o woff2_compress

echo "🔤 Convirtiendo fuentes TTF a WOFF2..."

INPUT_DIR="public/fonts"
OUTPUT_DIR="public/fonts-optimized"

mkdir -p "$OUTPUT_DIR"

# Lista de fuentes que realmente se usan (según fonts.ts)
USED_FONTS=(
    "HelveticaNowDisplay-Regular"
    "HelveticaNowDisplay-Medium"
    "HelveticaNowDisplay-Bold"
    "HelveticaNowDisplay-Black"
    "HelveticaNowDisplay-Italic"
    "HelveticaNowText-Regular"
    "HelveticaNowText-Bold"
    "HelveticaNowText-Light"
)

echo "📋 Fuentes en uso:"
for font in "${USED_FONTS[@]}"; do
    echo "  - $font"
done

echo ""

# Verificar si woff2_compress está disponible
if command -v woff2_compress &> /dev/null; then
    echo "Usando woff2_compress..."
    
    for font in "${USED_FONTS[@]}"; do
        if [ -f "$INPUT_DIR/${font}.ttf" ]; then
            woff2_compress "$INPUT_DIR/${font}.ttf"
            mv "$INPUT_DIR/${font}.woff2" "$OUTPUT_DIR/" 2>/dev/null || true
            echo "✅ Convertido: $font"
        fi
    done

# Alternativa con ttf2woff2 npm package
elif command -v ttf2woff2 &> /dev/null; then
    echo "Usando ttf2woff2..."
    
    for font in "${USED_FONTS[@]}"; do
        if [ -f "$INPUT_DIR/${font}.ttf" ]; then
            ttf2woff2 < "$INPUT_DIR/${font}.ttf" > "$OUTPUT_DIR/${font}.woff2"
            echo "✅ Convertido: $font"
        fi
    done

else
    echo "⚠️ No se encontró woff2_compress ni ttf2woff2"
    echo ""
    echo "Para convertir fuentes, instala:"
    echo "  brew install woff2  # macOS"
    echo "  # o"
    echo "  npm install -g ttf2woff2"
    echo ""
    echo "O usa una herramienta online:"
    echo "  - fontsquirrel.com/tools/webfont-generator"
    echo "  - cloudconvert.com/ttf-to-woff2"
fi

echo ""
echo "📊 Comparación de tamaños:"
echo ""
echo "Fuentes originales (todas):"
du -h "$INPUT_DIR"/*.ttf 2>/dev/null | head -10
echo "..."
echo "Total: $(du -sh $INPUT_DIR | cut -f1)"

if [ -d "$OUTPUT_DIR" ] && [ "$(ls -A $OUTPUT_DIR)" ]; then
    echo ""
    echo "Fuentes optimizadas (solo las usadas, WOFF2):"
    du -h "$OUTPUT_DIR"/* 2>/dev/null
    echo "Total optimizado: $(du -sh $OUTPUT_DIR | cut -f1)"
fi

echo ""
echo "📋 Fuentes NO usadas (puedes eliminarlas):"
for file in "$INPUT_DIR"/*.ttf; do
    filename=$(basename "$file" .ttf)
    is_used=false
    for used in "${USED_FONTS[@]}"; do
        if [ "$filename" == "$used" ]; then
            is_used=true
            break
        fi
    done
    if [ "$is_used" == "false" ]; then
        echo "  - $filename.ttf ($(du -h "$file" | cut -f1))"
    fi
done

