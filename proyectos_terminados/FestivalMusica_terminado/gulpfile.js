const { src, dest, watch, parallel} = require("gulp");

// CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//JavaScript
const terser = require('gulp-terser-js');

function css(done){
    src('src/scss/**/*.scss') // Identificar el archivo de SASS
        .pipe(sourcemaps.init())
        .pipe(plumber())// no terminar npm si hay algun error
        .pipe( sass() )// Compilarlo
        .pipe( postcss([autoprefixer(), cssnano()])) // Arreglar archivo css para simplicar
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css')) // Almacenar en el disco duro

    done(); // Callback que avisa a gulp cuando llegamos al final
}

// imagenes
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache');

function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

async function versionWebp(done) {
 
    const webp = await import("gulp-webp"); // Manda a traer la dependencia instalada con "npm install --save-dev gulp-webp" desde la terminal"
 
 
    const opciones = {
        quality: 50 // Esto define que tanta calidad se le bajarán a las imágenes
    }
 
    src('src/img/**/*.{png,PNG,jpg,JPG}') // Busca recursivamente en todos los archivos y carpetas de la carpeta img con los formatos especificados
        .pipe(webp.default(opciones)) // Los convierte en formato WEBP y les baja la calidad especificada
        .pipe(dest('build/img')) // Los guarda en una nueva carpeta
    
    done(); // Callback que avisa a gulp cuando llegamos al final de la ejecución del script
}

async function versionAvif(done) {
 
    const avif = await import("gulp-avif"); // Manda a traer la dependencia instalada con "npm install --save-dev gulp-webp" desde la terminal"
 
 
    const opciones = {
        quality: 50 // Esto define que tanta calidad se le bajarán a las imágenes
    }
 
    src('src/img/**/*.{png,PNG,jpg,JPG}') // Busca recursivamente en todos los archivos y carpetas de la carpeta img con los formatos especificados
        .pipe(avif.default(opciones)) // Los convierte en formato WEBP y les baja la calidad especificada
        .pipe(dest('build/img')) // Los guarda en una nueva carpeta
    
    done(); // Callback que avisa a gulp cuando llegamos al final de la ejecución del script
}

function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'))
        done();
}

function dev(done){
    watch("src/scss/**/*.scss", css)
    watch('src/js/**/*.js', javascript)

    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);