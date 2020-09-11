/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating JavaScript for logic blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.LDL.logic');

goog.require('Blockly.LDL');


Blockly.LDL['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  if (Blockly.LDL.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.LDL.injectId(Blockly.LDL.STATEMENT_PREFIX,
        block);
  }
  do {
    conditionCode = Blockly.LDL.valueToCode(block, 'IF' + n,
        Blockly.LDL.ORDER_NONE) || 'false';
    branchCode = Blockly.LDL.statementToCode(block, 'DO' + n);
    if (Blockly.LDL.STATEMENT_SUFFIX) {
      branchCode = Blockly.LDL.prefixLines(
          Blockly.LDL.injectId(Blockly.LDL.STATEMENT_SUFFIX,
          block), Blockly.LDL.INDENT) + branchCode;
    }
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Blockly.LDL.STATEMENT_SUFFIX) {
    branchCode = Blockly.LDL.statementToCode(block, 'ELSE');
    if (Blockly.LDL.STATEMENT_SUFFIX) {
      branchCode = Blockly.LDL.prefixLines(
          Blockly.LDL.injectId(Blockly.LDL.STATEMENT_SUFFIX,
          block), Blockly.LDL.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.LDL['controls_ifelse'] = Blockly.LDL['controls_if'];

Blockly.LDL['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.LDL.ORDER_EQUALITY : Blockly.LDL.ORDER_RELATIONAL;
  var argument0 = Blockly.LDL.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.LDL.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.LDL['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.LDL.ORDER_LOGICAL_AND :
      Blockly.LDL.ORDER_LOGICAL_OR;
  var argument0 = Blockly.LDL.valueToCode(block, 'A', order);
  var argument1 = Blockly.LDL.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.LDL['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.LDL.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.LDL.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.LDL['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.LDL.ORDER_ATOMIC];
};

Blockly.LDL['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.LDL.ORDER_ATOMIC];
};

Blockly.LDL['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.LDL.valueToCode(block, 'IF',
      Blockly.LDL.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.LDL.valueToCode(block, 'THEN',
      Blockly.LDL.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.LDL.valueToCode(block, 'ELSE',
      Blockly.LDL.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.LDL.ORDER_CONDITIONAL];
};
