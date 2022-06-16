/**
 * Crea el codigo intermedio con su formato para ser visualizado por el usuario
 *
 * @param {Array} - Codigo intermedio
 */ 
export default function createTextInterCode(inter: any[][]): string {
  let text = '';

  inter.forEach(stmt => {
    text += `${joinStatement(stmt)}\n`;
  });

  return text;
}

/**
 * Recibe una instruccion para darle formato a texto
 */ 
function joinStatement(stmt: any[]) {
  let text = '';

  stmt.forEach(item => {
    if (Array.isArray(item)) {
      text += joinStatement(item);
    } else {
      text += ' ' + item;
    }
  });

  return text;
}
