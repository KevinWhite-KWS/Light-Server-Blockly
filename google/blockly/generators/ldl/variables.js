/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating JavaScript for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.LDL.variables');

goog.require('Blockly.LDL');


Blockly.LDL['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.LDL.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.VARIABLE_CATEGORY_NAME);
  return [code, Blockly.LDL.ORDER_ATOMIC];
};

Blockly.LDL['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.LDL.valueToCode(block, 'VALUE',
      Blockly.LDL.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.LDL.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  return varName + ' = ' + argument0 + ';\n';
};
