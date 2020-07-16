FILE=$1
basename "$FILE"
f="$(basename -- $FILE)"
convert $1 -resize 1240x1754 -background black -gravity center -extent 1240x1754 $f
