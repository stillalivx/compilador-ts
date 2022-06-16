import { TOKENS } from '../tokens';

import type { Node } from '../type';

// Tokes de las operaciones matematicas
const operationTokens = [
  TOKENS.OP_DIV,
  TOKENS.OP_MUL,
  TOKENS.OP_SUMA,
  TOKENS.OP_RESTA
];
  
/**
 * Genera el codigo intermedio tomando el arbol binario generado en la fase 3
 *
 * @param tree - Arbol binario generado en la fase 2
 * @returns {Array} - Arreglo de instrucciones que componen el codigo intermedio
 */ 
export default function generacionCodigoIntermedio(tree: (Node | null)[]): any[][] {
  const interStmts: any[][] = [];

  tree.forEach(node => {
    if (!node) { // Si no existe el nodo, termina la ejecucion de la funcion
      return;
    }

    // En caso contrario, interpretamos el nodo y guardamos el resultado dentro del arreglo
    interStmts.push(interpretNode(node));
  });

  return interStmts;
}

/**
 * Interpreta los nodos, leyendo desde la raiz hasta sus hojas, creando el codigo intermedio
 *
 * @param node - Nodo
 * @returns {Array} - Arreglo con los componentes de cada instruccion del codigo intermedio
 */ 
function interpretNode(node: Node): any[] {
  // Es verdadero si el token es un identificador
  if (node.token === TOKENS.IDENT) {
    const stmt = [node.valor, "<"];

    // Si contiene un nodo hijo, lleva acabo recursividad
    if (node.right) {
      stmt.push(...interpretNode(node.right));
    }

    // Si contiene un nodo hijo, lleva acabo recursividad
    if (node.left) {
      stmt.push(...interpretNode(node.left));
    }

    return stmt;
  } else {
    // En caso de que contenga ambos hijos
    if (node.left && node.right) {
      const stmt: any[][] = [[], []];

      let leftNodeInterpret = null;
      let rightNodeInterpret = null;

      // Es verdad si el nodo contiene un token de operacion
      if (operationTokens.includes(node.left.token)) {
        // Lleva acabo recursividad de su nodo hijo
        leftNodeInterpret = interpretNode(node.left);
      } else {
        // Guarda el valor del nodo directamente
        leftNodeInterpret = node.left.valor;
      }

      if (operationTokens.includes(node.right.token)) {
        rightNodeInterpret = interpretNode(node.right)
      } else {
        rightNodeInterpret = node.right.valor;
      }

      // Es verdad si el nodo fue interpretado y no es un valor
      if (Array.isArray(leftNodeInterpret)) {
        if (Array.isArray(leftNodeInterpret[0])) {
          // Guardamos cada uno de los valores que la funcion interpreto
          stmt[0].push(...leftNodeInterpret[0]);
        } else {
          if (Array.isArray(leftNodeInterpret)) {
            stmt[0].push(...leftNodeInterpret);
          } else {
            stmt[0].push(leftNodeInterpret);
          }
        }

        // Es verdad si el nodo interpretado cuenta con otro arreglo dentro de el
        if (leftNodeInterpret[1]) {
          // Este arreglo contiene las operaciones, se guardan en la interpretacion
          stmt[1].push(...leftNodeInterpret[1]);
        }
      } else {
        // Si es un valor primitivo, lo guarda directamente
        stmt[0].push(leftNodeInterpret);
      }

      if (Array.isArray(rightNodeInterpret)) {
        if (Array.isArray(rightNodeInterpret[0])) {
          stmt[0].push(...rightNodeInterpret[0]);
        } else {
          if (Array.isArray(rightNodeInterpret)) {
            stmt[0].push(...rightNodeInterpret);
          } else {
            stmt[0].push(rightNodeInterpret);
          }
        }

        if (rightNodeInterpret[1]) {
          stmt[1].push(...rightNodeInterpret[1]);
        }
      } else {
        stmt[0].push(rightNodeInterpret);
      }
   
      stmt[1].unshift(node.valor);

      return stmt;
    } 

    // En caso de ser un valor con un signo negativo o positivo
    if (node.right) {
      if (typeof node.right.valor === 'number') {
        // Guardamos el valor numerico, convirtiendolo de string a number
        return [parseFloat(`${node.valor}${node.right.valor}`)];
      } else {
        // Separamos el operador del numero, generando el codigo interpretado
        return [[node.right.valor], [node.valor]];
      }
    }
  }

  // Si ninguna de las condiciones se cumple, mandamos el valor del nodo sin procesar
  return [node.valor];
}
