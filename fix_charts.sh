#!/bin/bash

# Path to the file
FILE="crypto-ai-trading-platform/src/components/admin/Charts.tsx"

# Make a backup of the original file
cp "$FILE" "${FILE}.bak"

# Fix the first occurrence (lines 142-146)
sed -i 's/style="font-weight: 500;"/style={{fontWeight: "500"}}/g' "$FILE"
sed -i 's/style="display: flex; justify-content: space-between; margin-top: 4px;"/style={{display: "flex", justifyContent: "space-between", marginTop: "4px"}}/g' "$FILE"
sed -i 's/style="color: #6b7280;"/style={{color: "#6b7280"}}/g' "$FILE"
sed -i 's/style="font-weight: 500; color: ${color};"/style={{fontWeight: "500", color: "${color}"}}/g' "$FILE"

# Fix the second occurrence (lines 278-282)
sed -i 's/style="font-weight: 500;"/style={{fontWeight: "500"}}/g' "$FILE"
sed -i 's/style="display: flex; justify-content: space-between; margin-top: 4px;"/style={{display: "flex", justifyContent: "space-between", marginTop: "4px"}}/g' "$FILE"
sed -i 's/style="color: #6b7280;"/style={{color: "#6b7280"}}/g' "$FILE"
sed -i 's/style="font-weight: 500; color: ${color};"/style={{fontWeight: "500", color: "${color}"}}/g' "$FILE"

# Fix the third occurrence (line 445)
sed -i 's/style="font-weight: 500; margin-bottom: 4px;"/style={{fontWeight: "500", marginBottom: "4px"}}/g' "$FILE"

# Fix the fourth occurrence (lines 458-460)
sed -i 's/style="display: flex; justify-content: space-between; margin-top: 2px;"/style={{display: "flex", justifyContent: "space-between", marginTop: "2px"}}/g' "$FILE"
sed -i 's/style="color: #6b7280; margin-right: 12px;"/style={{color: "#6b7280", marginRight: "12px"}}/g' "$FILE"
sed -i 's/style="font-weight: 500; color: ${serie.color};"/style={{fontWeight: "500", color: "${serie.color}"}}/g' "$FILE"

# Fix the fifth occurrence (lines 475-477)
sed -i 's/style="display: flex; justify-content: space-between; margin-top: 8px; padding-top: 4px; border-top: 1px dashed #e5e7eb;"/style={{display: "flex", justifyContent: "space-between", marginTop: "8px", paddingTop: "4px", borderTop: "1px dashed #e5e7eb"}}/g' "$FILE"
sed -i 's/style="color: #6b7280; font-weight: 500;"/style={{color: "#6b7280", fontWeight: "500"}}/g' "$FILE"
sed -i 's/style="font-weight: 600; color: #111827;"/style={{fontWeight: "600", color: "#111827"}}/g' "$FILE"

echo "Style attributes converted to React JSX format in $FILE"
