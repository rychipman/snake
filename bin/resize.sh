#!/bin/bash

dir="$1"

for file in "$dir"/*; do
	convert "$file" -resize 680x680 "$file"
done
