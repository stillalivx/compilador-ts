/**
 * Analiza el codigo intermedio y en caso de ser necesario realiza la optimizacion de 
 * casa instruccion 
 *
 * @param {Array} - Instrucciones del codigo intermedio
 * @returns {Array} - Instrucciones del codigo intermedio ya optimizados
 *
 */ 
export default function optimizacion(stmts: any[][]) {
  return stmts.map(stmt => {
    // Es verdad si la instruccion intermedia contiene 4 elementos
    if (stmt.length === 4) {
      let ops = stmt[stmt.length - 1];
      let nums = stmt[stmt.length - 2];

      if (Array.isArray(ops) && Array.isArray(nums)) {
        // Si el arreglo de numeros solo contiene 1, terminamos de analizar la instruccion
        if (nums.length === 1) {
          return stmt;
        }

        const optimNums = [];
        const optimOps = [];

        // Mientras haya numeros que optimizar, se seguira ejecutando el ciclo
        while (nums.length) {
          let num1Idx: number;
          let num2Idx: number;
          let opIdx: number;

          if (ops.includes('*') || ops.includes('/')) {
            if (ops.includes('*')) {
              opIdx = ops.indexOf('*');
            } else {
              opIdx = ops.indexOf('/');
            }

            num1Idx = opIdx;
            num2Idx = num1Idx + 1;
          } else {
            num1Idx = 0;
            num2Idx = 1;
            opIdx = 0;
          }

          const num1 = nums[num1Idx];
          const num2 = nums[num2Idx];

          // Es verdad solo existe un digito
          if (num1 && !num2) {
            // Lo agregamos al arreglo de numeros ya optimizados
            optimNums.push(num1);
            // Lo eliminamos del arreglo de numeros
            nums.splice(num1Idx, 1);

            // Es verdad si existe una operacion
            if (ops[0]) {
              // Se agregar el operador al arreglo de operadores ya optimizados
              optimOps.push(ops[0]);
              // Se elimina del arreglo de operadores
              ops.splice(0, 1);
            }

            continue;
          } 

          // Es verdad si el primer numero es un identificador y no un numero
          if (typeof num1 !== 'number') {
            optimNums.push(num1);
            nums.splice(num1Idx, 1);

            // Es verdad si el operador de los numeros es una mul o una div
            if (['*', '/'].includes(ops[0])) {
              optimNums.push(num2);
              nums.splice(num1Idx, 1);
            }

            optimOps.push(ops[opIdx]);
            ops.splice(opIdx, 1);
          // Es verdad si el segundo numero es un identificador y no un numero
          } else if (typeof num2 !== 'number') {
            optimNums.push(num1, num2);
            nums.splice(num1Idx, 2);

            optimOps.push(ops[opIdx]);
            ops.splice(opIdx, 1);
          // Es verdad si ambos numeros se pueden operar
          } else if (num1 && num2) {
            let result: number;
            
            // En caso de que el operador es una mul o div
            if (['*', '/'].includes(ops[opIdx])) {
              if (ops[opIdx] === '*') {
                result = num1 * num2;
              } else {
                result = num1 / num2;
              }

              // Se elimina el primer numero en el que se hace la operacion
              nums.splice(num1Idx, 1);
              // Se sustituye el segundo numero por el resultado
              nums[num1Idx] = result;

              ops.splice(opIdx, 1);
            } else {
              // Es verdad si en el arreglo de operadores optimizados existen multiplicaciones
              // para evitar hacer sumas o restas cuando aún no es posible por las leyes de los
              // signos
              if (optimOps.includes('*') || optimOps.includes('/')) {
                optimNums.push(num1, num2);
                nums.splice(num1Idx, 2);

                optimOps.push(ops[opIdx]);
                ops.splice(opIdx, 1);
              // Si no se encuentra, se realizan las operaciones tales como suma o resta
              } else {
                if (ops[opIdx] === '+') {
                  result = num1 + num2;
                } else {
                  result = num1 - num2;
                }

                nums.splice(num1Idx, 1);
                nums[num1Idx] = result;

                ops.splice(opIdx, 1);
              }
            }
          }
        }

        // Los arreglos con los numeros y operaciones sin optimizar son sustituidas por
        // los valores ya optimizados
        stmt[stmt.length - 1] = optimOps;
        stmt[stmt.length - 2] = optimNums;
      }
    }  

    return stmt;
  });
}
