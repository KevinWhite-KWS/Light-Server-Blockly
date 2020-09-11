/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating JavaScript for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.LDL.procedures');

goog.require('Blockly.LDL');


Blockly.LDL['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.LDL.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
  var xfix1 = '';
  if (Blockly.LDL.STATEMENT_PREFIX) {
    xfix1 += Blockly.LDL.injectId(Blockly.LDL.STATEMENT_PREFIX,
        block);
  }
  if (Blockly.LDL.STATEMENT_SUFFIX) {
    xfix1 += Blockly.LDL.injectId(Blockly.LDL.STATEMENT_SUFFIX,
        block);
  }
  if (xfix1) {
    xfix1 = Blockly.LDL.prefixLines(xfix1, Blockly.LDL.INDENT);
  }
  var loopTrap = '';
  if (Blockly.LDL.INFINITE_LOOP_TRAP) {
    loopTrap = Blockly.LDL.prefixLines(
        Blockly.LDL.injectId(Blockly.LDL.INFINITE_LOOP_TRAP,
        block), Blockly.LDL.INDENT);
  }
  var branch = Blockly.LDL.statementToCode(block, 'STACK');
  var returnValue = Blockly.LDL.valueToCode(block, 'RETURN',
      Blockly.LDL.ORDER_NONE) || '';
  var xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Blockly.LDL.INDENT + 'return ' + returnValue + ';\n';
  }
  var args = [];
  var variables = block.getVars();
  for (var i = 0; i < variables.length; i++) {
    args[i] = Blockly.LDL.variableDB_.getName(variables[i],
        Blockly.VARIABLE_CATEGORY_NAME);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
  code = Blockly.LDL.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.LDL.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.LDL['procedures_defnoreturn'] =
    Blockly.LDL['procedures_defreturn'];

Blockly.LDL['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.LDL.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.PROCEDURE_CATEGORY_NAME);
  var args = [];
  var variables = block.getVars();
  for (var i = 0; i < variables.length; i++) {
    args[i] = Blockly.LDL.valueToCode(block, 'ARG' + i,
        Blockly.LDL.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.LDL.ORDER_FUNCTION_CALL];
};

Blockly.LDL['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  var tuple = Blockly.LDL['procedures_callreturn'](block);
  return tuple[0] + ';\n';
};

Blockly.LDL['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.LDL.valueToCode(block, 'CONDITION',
      Blockly.LDL.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (Blockly.LDL.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Blockly.LDL.prefixLines(
        Blockly.LDL.injectId(Blockly.LDL.STATEMENT_SUFFIX, block),
        Blockly.LDL.INDENT);
  }
  if (block.hasReturnValue_) {
    var value = Blockly.LDL.valueToCode(block, 'VALUE',
        Blockly.LDL.ORDER_NONE) || 'null';
    code += Blockly.LDL.INDENT + 'return ' + value + ';\n';
  } else {
    code += Blockly.LDL.INDENT + 'return;\n';
  }
  code += '}\n';
  return code;
};
