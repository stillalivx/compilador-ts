import { TOKENS } from '../tokens';

import type { TokenValue, Node } from '../type';

const operationTokens = [
  TOKENS.OP_DIV,
  TOKENS.OP_MUL,
  TOKENS.OP_SUMA,
  TOKENS.OP_RESTA
];

/**
 * Crea el arbol binario con cada uno de los tokens, dando el orden por instruccion que necesitan 
 * las siguientes fases
 * 
 * @param lexicalResult 
 * @returns 
 */
export default function analisisSintaxis(lexicalResult: TokenValue[]) {
  const splitTokensByStmts = [];

  // Se dividirá el arreglo de token (generado en la primera fase) usando como delimitador
  // el caracter ';'
  while (lexicalResult.length > 0) {
    let idx = lexicalResult.findIndex(tkn => tkn.token === TOKENS.END); // Se encuentra la primera posición que contenga un token
                                                                        // ';'
    const splitTokens = lexicalResult.slice(0, idx); // Se toman todos los tokens desde la primera posición hasta la encontrada en 'idx' 

    lexicalResult = lexicalResult.slice(idx + 1); // Se borran los caracteres ya guardados en 'splitTokens'

    splitTokensByStmts.push(splitTokens); // El arreglo de elementos que componen una instrucción se introduce al arreglo
                                          // 'splitTokensByStmts'
  }

  const tree = splitTokensByStmts.map(stmt => {
    let lastNode: Node | null = null;

    // Las instrucciones se evaluarán de derecha a izquierda
    for (let index = stmt.length - 1; index >= 0; index--) {
      const tkn = stmt[index];      

      // Si no hay un nodo guardado en lastNode, se asigna uno nuevo y continua con la siguiente iteración
      if (!lastNode) {
        lastNode = {
          ...tkn,
          right: null,
          left: null
        };

        continue;
      }

      if (tkn.token === TOKENS.VALOR_NUM || tkn.token === TOKENS.VALOR_STR) {

        // Se cumple cuando el nodo padre es un operador
        if (operationTokens.includes(lastNode.token)) {
          lastNode.left = {
            ...tkn,
            right: null,
            left: null
          }
        }
      // Se cumple si el token evaluado es un operador, el nodo en lastNode se asigna como hijo
      } else if ((operationTokens.includes(tkn.token))) {
        const newNode: Node = {
          ...tkn,
          left: null,
          right: { ...lastNode }
        };

        lastNode = newNode;
      } else if (tkn.token === TOKENS.IDENT) {
        // Se cumple si el nodo padre es un operador y hay una instrucción precedida que se deba
        // analizar
        if (operationTokens.includes(lastNode.token) && stmt[index - 1]) {
          lastNode.left = {
            ...tkn,
            right: null,
            left: null
          }
        } else {
          const newNode: Node = {
            ...tkn,
            left: { ...lastNode },
            right: null
          };
  
          lastNode = newNode;
        }
      }
    }

    return lastNode;
  });
  
  return tree;
}