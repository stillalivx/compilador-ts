import { TOKENS } from '../tokens';

import type { Node } from '../type';

const operationTokens = [
  TOKENS.OP_DIV,
  TOKENS.OP_MUL,
  TOKENS.OP_SUMA,
  TOKENS.OP_RESTA
];

const vars: Node[] = [];

/**
 * Realiza analisis semantico para verificar si la estructura es correcta
 * 
 * @param tree - Recibe el arbol binario generado en la fase 2
 * @returns {boolean} - Returna un true si el analisis es correcto
 */
export default function analisisSemantico(tree: (Node | null)[]): boolean {
  // Recorre todos los nodos 'padre' del arbol
  tree.forEach(nodo => {
    if (!nodo) {
      return;
    }

    analizarNodo(nodo);
  });

  return true;
}

/**
 * Analiza si un nodo cumple con la sintaxis requerida. En caso de tener nodos hijos, se
 * utiliza recursividad para evaluarlos
 * 
 * @param nodo - Recibe el nodo que se va a evaluar
 * @param parent - Recibe un el nodo padre del nodo que se va a evaluar
 * @returns {boolean} - Retorna true si el analisis del nodo es correcto
 */
function analizarNodo(nodo: Node, parent?: Node): boolean {
  if (nodo.token === TOKENS.IDENT) {
    if (parent && operationTokens.includes(parent.token)) {
      // Si un identificador se utiliza en una operación, verifica si ya ha sido declarado
      const isNodeDeclared = vars.find(tkn => tkn.valor === nodo.valor);

      if (!isNodeDeclared) {
        throw `La variable ${nodo.valor} no ha sido declarada`;
      }

      if (nodo.right) {
        analizarNodo(nodo.right, nodo);
      }

      if (nodo.left) {
        analizarNodo(nodo.left, nodo);
      }
    // Se cumple si el nodo es un identificador y no contiene un valor especificado
    } else if (!nodo.left) {
      throw `La variable ${nodo.valor} no cuenta con un valor especificado`;
    } else {
      // Si es un identificador compuesto de forma correcta, se agrega a la lista de identificadores
      // ya declarados
      vars.push(nodo);

      analizarNodo(nodo.left, nodo);
    }
    
  } else if (operationTokens.includes(nodo.token)) {
    if (nodo.token === TOKENS.OP_SUMA || nodo.token === TOKENS.OP_RESTA) {
      // Se cumple si el nodo es una suma y no cuenta con un hijo (númerico para determinar su signo)
      if (!nodo.right) {
        throw 'El operador no cuenta con ningún valor para operar';
      }

      analizarNodo(nodo.right, nodo);

      if (nodo.left) {
        analizarNodo(nodo.left, nodo);
      }
    } else {
      if (!nodo.left || !nodo.right) {
        throw `El operador ${nodo.valor} necesita dos valores para operar`;
      }

      analizarNodo(nodo.left, nodo);
      analizarNodo(nodo.right, nodo);
    }
  } else if (nodo.token === TOKENS.VALOR_NUM && parent) {
    if (parent.token === TOKENS.IDENT) {
      return true;
    }

    if (operationTokens.includes(parent.token)) {
      if (parent.token !== TOKENS.OP_SUMA && parent.token !== TOKENS.OP_RESTA) {
        if (!parent.right || !parent.left) {
          throw `El operador ${parent.valor} necesita dos valores para operar`;
        }
  
        if (parent.left.token === TOKENS.VALOR_STR || parent.right.token === TOKENS.VALOR_STR) {
          throw `El operador ${parent.valor} necesita dos valores numericos para operar`;
        }
      } else if (parent.token === TOKENS.OP_RESTA) {
        if (parent.left && parent.right) {
          if (parent.right.token !== parent.left.token) {
            throw `El operador ${parent.valor} necesita dos valores numericos para operar`;
          }
        }
      }
    }
  }

  return true;
}
