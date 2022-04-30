import { TOKENS } from '../tokens';

import type { Node } from '../type';

/**
 * Crea la estructura principal de los nodos padres de nivel más alto
 * 
 * @param nodes - Arbol bonario creado en la fase 2
 * @param nivel - Nivel de identacion para hijos de nodos
 */
export default function createTreeStructure(nodes: (Node | null)[], nivel: number) {
  let str = '';

  if (nivel === 0) {
    str += `${TOKENS.PROGRAM}\n\u2502\n`;
  }

  nodes.forEach((node, mIdx) => {
    if (!node) {
      return;
    }

    let mainKeepConnChar = '\u251C';
    let nextKeepChar = '\u2502';    

    if (mIdx === nodes.length - 1) {
      mainKeepConnChar = '\u2514';
      nextKeepChar = ' ';
    } 

    str += `${mainKeepConnChar}${'\u2500'.repeat(2)}${TOKENS.STMT}\n`;
    str += drawChildNode(node, nivel + 1, nextKeepChar);

    if (mIdx < nodes.length - 1) {
      str += `\u2502\n`;
    }
  });

  return str;
}

/**
 * 
 * @param node - Nodo
 * @param nivel - Nivel de identacion para hijos de nodos 
 * @param beginChar - Carácter que se imprimirá el principio de la cadena
 * @param childChar - Carácter que se imprimirá al principio de cada nodo hijo
 * @returns 
 */
function drawChildNode(node: Node, nivel: number, beginChar: string, childChar: string = '\u2514') {
  let str = '';

  str += `${beginChar}${' '.repeat(4 + (4 * nivel))}\u2502\n`;
  str += `${beginChar}${' '.repeat(4 + (4 * nivel))}${childChar}${'\u2500'.repeat(2)}${node.token} \u2192 ${node.valor}\n`;
  
  if (node.left) {
    let connChar = childChar;

    if (node.right) {
      connChar = '\u251C';
    }

    str += drawChildNode(node.left, nivel + 1, beginChar, connChar);
  }

  if (node.right) {
    str += drawChildNode(node.right, nivel + 1, beginChar);
  }

  return str;
}
