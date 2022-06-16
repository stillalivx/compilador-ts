import { readFile } from 'fs/promises';
import 'colors';

import createTreeStructure from './utils/createTreeStructure';
import createTextInterCode from './utils/createTextInterCode';

import analisisLexico from './fases/analisisLexico';
import analisisSintaxis from './fases/analisisSintaxis';
import analisisSemantico from './fases/analisisSemantico';
import generacionCodigoIntermedio from './fases/generacionCodigoIntermedio';
import optimizacion from './fases/optimizacion';

let path = process.argv[2] as string; // Toma la ruta del archivo que se va a compilar

if (!path) {
  throw 'No se ha especificado el archivo del script';
}

path = path.trim();

// Verifica si el archivo tiene la extensión .sx
if (!path.endsWith('.sx')) {
  throw 'La extensión del archivo no es válida';
}

(async () => {
  let file;

  try {
    file = await readFile(path, { encoding: 'utf-8' }); // Lee el archivo 
  } catch (e) {
    throw 'No se ha encontrado el archivo especificado'
  }

  const resFase1 = analisisLexico(file);
  
  console.log('\nFASE 1 - ANALISIS LEXICO\n'.blue);
  console.log(resFase1);

  const resFase2 = analisisSintaxis(resFase1);
  
  console.log('\nFASE 2 - ANALISIS SINTAXIS\n'.blue);
  console.log(createTreeStructure(resFase2, 0));
  
  console.log('\nFASE 3 - ANALISIS SINTAXIS\n'.blue);
  
  analisisSemantico(resFase2);

  console.log('El arbol binario es valido. \u2714'.green);
  
  const resFase4 = generacionCodigoIntermedio(resFase2);

  console.log('\nFASE 4 - GENERACION DE CODIGO INTERMEDIO\n'.blue);
  console.log(createTextInterCode(resFase4));

  const resFase5 = optimizacion(resFase4);
  
  console.log('\nFASE 5 - OPTIMIZACIÓN\n'.blue);
  console.log(createTextInterCode(resFase5));

  console.log('\nFASE 6 - TABLA DE SIMBOLOS\n'.blue);
  console.log(resFase4);
})().catch((e) => {
  console.log(e.toString().red);
});
