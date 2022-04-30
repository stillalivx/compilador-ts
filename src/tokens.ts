export enum TOKENS {
  STMT = 'Instrucción',
  PROGRAM = 'Programa',
  OP_SUMA = 'OperacionSuma',                          // +
  OP_RESTA = 'OperacionResta',                        // -
  OP_MUL = 'OperacionMultiplicacion',                 // *
  OP_DIV = 'OperacionDivision',                       // /
  OP_ASIG = 'OperacionAsignacion',                    // =
  COM = 'CaracterComilla',                            // "
  END = 'CarecterPuntoComa',                          // ;
  COMENT_LINEA = 'ComentarioLinea',                   // //
  COMENT_MULTI_INI = 'ComentarioMultiLineaInicio',    // /*
  COMENT_MULTI_END = 'ComentarioMultiLineaFin',       // */
  IDENT = 'Identificador',
  VALOR_STR = 'ValorString',
  VALOR_NUM = 'ValorNumerico'
};
