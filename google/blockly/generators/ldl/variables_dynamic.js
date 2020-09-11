/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating JavaScript for dynamic variable blocks.
 * @author fenichel@google.com (Rachel Fenichel)
 */
'use strict';

goog.provide('Blockly.LDL.variablesDynamic');

goog.require('Blockly.LDL');
goog.require('Blockly.LDL.variables');


// JavaScript is dynamically typed.
Blockly.LDL['variables_get_dynamic'] =
    Blockly.LDL['variables_get'];
Blockly.LDL['variables_set_dynamic'] =
    Blockly.LDL['variables_set'];
