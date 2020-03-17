FILE=$1
basename "$FILE"
f="$(basename -- $FILE)"
convert $1 -strip -quality 75 $f
