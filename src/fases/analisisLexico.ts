import { TOKENS } from '../tokens';

import type { TokenValue } from '../type';

/**
 * Realiza el analisis lexico de un archivo que se desea compilar
 * 
 * @param content - String generado al leer el archivo que se quiere compilar
 * @returns {TokenValue[]} - Returna un arreglo de objetos { token: TOKEN, valor: 'Cualquier valor' }
 */
export default function analisisLexico(content: string): TokenValue[] {
  const stmts = content.split('\n'); // Separamos el string en renglones tomando como delimitador el carácter ';'
  const tokens: TokenValue[] = [];

  let isCommentMultiLine = false;

  stmts.forEach((stmt, line) => {
    if (!stmt.trim()) {
      return;
    }

    let subStmt = stmt.trim();

    if (/^\/\//.test(subStmt)) { // Se cumple cuando el string comienza con '//'
      return;
    }

    if (/^\/\*/.test(subStmt)) { // Se cumple cuando el string comienza con '/*'
      isCommentMultiLine = true;
      return;
    } else if (/^\*\//.test(subStmt)) { // Se cumple cuando el string contiene '*/'
      if (isCommentMultiLine) {
        isCommentMultiLine = false;
        return;
      }

      throw 'Se espera la apertura para el comentario multilinea (/*)'
    } else if (isCommentMultiLine) {
      return;
    }

    if (isCommentMultiLine) {
      return;
    }

    while (subStmt.length) {
      const isCom = subStmt.match(/^\s*(")\s*/); // Se cumple si el string comienza con '"'

      if (isCom) {
        const strContent = subStmt.match(/^\s*"(.+)(?=("))/); // Retorna el contenido que se encuentre entre comillas. Por ejemplo:
                                                              // "Hola mundo" > true
                                                              // Hola mundo"  > false

        if (!strContent) {
          throw `El valor string es invalido. Se espera comilla de cierre. Linea ${line + 1}`;
        }

        const allChars = subStmt.match(/^\s*(")(.+)(")\s*/); // Verifica si la composición de la declaración es correcta

        if (!allChars) {
          throw `Error en la composición del string. Linea ${line + 1}`;
        }

        const previousToken = tokens[tokens.length - 1];

        if (previousToken && ['-', '*', '/'].includes(previousToken.valor)) { // Verifica si el string no es precedido por un operador
          throw `No es posible realizar la operación con un string. Linea ${line + 1}`;
        }

        tokens.push(
          { token: TOKENS.VALOR_STR, valor: allChars[2] } // Crea el token VAL_STR junto con su valor
        );

        subStmt = subStmt.substring(allChars[0].length).trim(); // Recorta la linea para no validar nuevamente lo anterior
        continue;
      }

      const isValNumOrIdent = subStmt.match(/^\s*([a-zA-Z\.0-9]+)\s*/); // Se cumple si el string comienza con valores numericos o alfanumericos

      if (isValNumOrIdent) {
        if (/^\d+/.test(isValNumOrIdent[1])) { // Se cumple si el string comienza con numeros
          if (/[a-zA-Z]+/.test(isValNumOrIdent[1])) { // Se cumple si contiene caracteres no numericos
            throw `El nombre de variable no puede iniciar con un número. Linea ${line + 1}`;
          }

          tokens.push({ token: TOKENS.VALOR_NUM, valor: parseFloat(isValNumOrIdent[1]) }); // En caso contrario, crea el token VAL_NUM junto con su valor
        } else {
          tokens.push({ token: TOKENS.IDENT, valor: isValNumOrIdent[1] }); // En caso contrario, crea el token IDENT junto con su valor
        }

        subStmt = subStmt.substring(isValNumOrIdent[0].length).trim();
        continue;
      }

      const isOperator = subStmt.match(/^\s*([=|*|\-|+|\/])\s*/); // Se cumple si contiene caracteres de operaciones

      if (isOperator) { 
        if (isOperator[1] === '=') {
          tokens.push({ token: TOKENS.OP_ASIG, valor: '=' }); // Crea el token OP_ASIG con el valor '='
        } else {
          const previousToken = tokens[tokens.length - 1];

          if (previousToken.token !== TOKENS.VALOR_NUM && previousToken.token !== TOKENS.IDENT) {
            const nxtSegment = subStmt.substring(isOperator[0].length).trim(); // Hace una copia del siguiente segmente que se analizará

            if (isOperator[1] !== '-' && isOperator[1] !== '+' && !/^\s*\d/.test(nxtSegment)) { // Es verdad si el no operador es + o - y el siguiente segmento
                                                                                                // no es un valor numerico para operar 
              throw `El operador ${isOperator[1]} no tiene ningún valor para operar. Linea ${line + 1}`;
            }
          }

          switch (isOperator[1]) {
            case '+':
              tokens.push({ token: TOKENS.OP_SUMA, valor: '+' });
              break;
  
            case '-':
              tokens.push({ token: TOKENS.OP_RESTA, valor: '-' });
              break;
  
            case '*':
              tokens.push({ token: TOKENS.OP_MUL, valor: '*' });
              break;
  
            default:
              tokens.push({ token: TOKENS.OP_DIV, valor: '/' });
              break;
          }
        }

        subStmt = subStmt.substring(isOperator[0].length).trim();
        continue;
      }

      const isEnd = subStmt.match(/^\s*(;)\s*/); // Es verdad si el string comienza con ;

      if (isEnd) {
        tokens.push({ token: TOKENS.END, valor: isEnd[1] });

        subStmt = subStmt.substring(isEnd[0].length).trim();
        continue;
      }
    }

    if (tokens[tokens.length - 1].token !== TOKENS.END) { // Es verdad si el renglón analizado no contiene ';'
      throw `Se espera un ; al final de la instrucción. Linea ${line + 1}`;
    }
  });

  return tokens;
}
