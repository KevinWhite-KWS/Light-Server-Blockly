/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Generating JavaScript for colour blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.LDL.instructions');

goog.require('Blockly.LDL');

Blockly.LDL.instructions.decToHex = function (value, minCharacters) {
    var encodedValue = value.toString(16);
    encodedValue = "0".repeat(minCharacters - encodedValue.length) + encodedValue;

    return encodedValue.toUpperCase();
};

Blockly.LDL.instructions.encodeInstructionOpcode = function (duration, opCode) {
    var durationEncoded = Blockly.LDL.instructions.decToHex(duration, 2);
    var opCodeEncoded = Blockly.LDL.instructions.decToHex(opCode, 2);
    var instruction = opCodeEncoded + durationEncoded + '0000';

    return instruction;
};

Blockly.LDL.instructions.removeTrailingComma = function (statements) {
    if (statements === null || statements.length === 0) {
        return statements;
    }

    // white space at end of statement - needs to be more sophisticated
    var lastChar = statements.slice(-1);
    debugger;
    alert(lastChar);

    return statements;
}

Blockly.LDL['ins_0_clear'] = function (block) {
    var duration = Number(block.getFieldValue('duration'));
    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 0);
    var code = '"instruction" : "' + encodedOpCode + '",\n';

    return code;
};

Blockly.LDL['ins_1_solid'] = function (block) {
    var duration = Number(block.getFieldValue('duration'));
    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 1);
    var colour = block.getFieldValue('colour').replace('#', '').toUpperCase();

    // Colour picker.
    var code = '"instruction" : "' + encodedOpCode + colour + '",\n';

    return code;
};

Blockly.LDL['ins_2_pattern'] = function (block) {
    var duration = Number(block.getFieldValue('duration'));
    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 2);

    // Colour picker.
    var branch = Blockly.LDL.statementToCode(block, 'pattern');
    branch = branch !== null ? branch.trim() : null;

    if (branch === null || branch.length <= 0 || branch.length % 8 !== 0) {
        return "";
    }

    var parts = branch.length / 8;
    var pixels = "";
    var colours = "";
    for (var i = 0; i < parts; i++) {
        var startPattern = i * 8;
        pixels += branch.substring(startPattern, startPattern + 2);
        colours += branch.substring(startPattern + 2, startPattern + 8);
    }
    var partsEncoded = Blockly.LDL.instructions.decToHex(parts, 2);
    var code = '"instruction" : "' + encodedOpCode + partsEncoded + pixels + colours + '",\n';

    return code;
};

Blockly.LDL['fixedpixelscolour'] = function (block) {
    var pixels = Number(block.getFieldValue('pixels'));
    var pixelsEncoded = Blockly.LDL.instructions.decToHex(pixels, 2);
    var colour = block.getFieldValue('colour').replace('#', '').toUpperCase();

    // Colour picker.
    var code = pixelsEncoded + colour;
    alert("'" + code + "'");

    return code;
};