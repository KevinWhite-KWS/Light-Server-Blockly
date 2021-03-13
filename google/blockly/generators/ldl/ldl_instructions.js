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

    var splits = statements.split(',');
    var last = splits[splits.length - 1];
    if (last.trim().length === 0) {
        // If there's nothing after the final , split then this means that
        // we need to remove that last , but re-add what came after it
        // as it may have been valid whitespace e.g. carriage-return
        statements = statements.substring(0, statements.length - 1 - last.length) + last;
    }

    return statements;
}


Blockly.LDL['repeat'] = function (block) {
    var infiniteLoop = block.getFieldValue('infiniteLoop') === "TRUE";
    var numberOfTimes = Number(block.getFieldValue("numberOfLoops"));
    numberOfTimes = (infiniteLoop ? 0 : numberOfTimes);
    var timesEncoded = Blockly.LDL.instructions.decToHex(numberOfTimes, 2);


    var instructions = Blockly.LDL.statementToCode(block, 'instructions');
    instructions = Blockly.LDL.instructions.removeTrailingComma(instructions);

    var code =
        '{' +
            '\t"repeat": {\n' +
                '\t\t"times" : ' + numberOfTimes + ',\n' +
                '\t\t"instructions": [\n' +
                    instructions +
                '\t\t]\n' +
            '\t}' +
        '}, \n';

    //var code =
    //    '{\n' +
    //        '\t"name" : "' + name + '",\n' +
    //        '\t"instructions": {\n' +
    //        '\t\t' + instructions +
    //        '\t}\n' +
    //        '}';

    return code;
};

Blockly.LDL['program'] = function (block) {
    var name = block.getFieldValue('programName');
    var instructions = Blockly.LDL.statementToCode(block, 'instructions');
    instructions = Blockly.LDL.instructions.removeTrailingComma(instructions);

    var code =
        '{\n' + 
        '\t"name" : "' + name + '",\n' +
        '\t"instructions": [\n' +
        '\t\t' + instructions +
        '\t]\n' +
        '}';

    return code;
};

Blockly.LDL['ins_0_clear'] = function (block) {
    var duration = Number(block.getFieldValue('duration'));
    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 0);
    var code = '"' + encodedOpCode + '",\n';

    return code;
};

Blockly.LDL['ins_1_solid'] = function (block) {
    var duration = Number(block.getFieldValue('duration'));
    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 1);
    var colour = block.getFieldValue('colour').replace('#', '').toUpperCase();

    // Colour picker.
    var code = '"' + encodedOpCode + colour + '",\n';

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
    var code = '"' + encodedOpCode + partsEncoded + pixels + colours + '",\n';

    return code;
};

Blockly.LDL['ins_3_slider'] = function (block) {
    var duration = Number(block.getFieldValue('duration'));
    var width = Number(block.getFieldValue('width'));
    var startFar = Number(block.getFieldValue('startFar') === 'TRUE');
    var headLength = Number(block.getFieldValue('headLength'));
    var tailLength = Number(block.getFieldValue('tailLength'));
    var sliderColour = block.getFieldValue('sliderColour').replace('#', '').toUpperCase();
    var backgroundColour = block.getFieldValue('backgroundColour').replace('#', '').toUpperCase();

    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 3);
    var encodedWidth = Blockly.LDL.instructions.decToHex(width, 2);
    var encodedHeadLength = Blockly.LDL.instructions.decToHex(headLength, 2);
    var encodedTailLength = Blockly.LDL.instructions.decToHex(tailLength, 2);
    var encodedStartFar = Blockly.LDL.instructions.decToHex(startFar, 1);

    // Colour picker.
    var code = '"' + encodedOpCode + encodedWidth + encodedStartFar + encodedHeadLength + encodedTailLength + sliderColour + backgroundColour + '",\n';

    return code;
};

Blockly.LDL['ins_4_fade'] = function (block) {
    var duration = Number(block.getFieldValue('duration'));
    var step = Number(block.getFieldValue('step'));
    var fadeOut = Number(block.getFieldValue('fadeOut') === 'TRUE');
    var startColour = block.getFieldValue('startColour').replace('#', '').toUpperCase();
    var endColour = block.getFieldValue('endColour').replace('#', '').toUpperCase();

    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 4);
    var encodedStep = Blockly.LDL.instructions.decToHex(step, 2);
    var encodedFadeOut = Blockly.LDL.instructions.decToHex(fadeOut, 1);

    // Colour picker.
    var code = '"' + encodedOpCode + encodedStep + encodedFadeOut + startColour + endColour + '",\n';

    return code;
};

Blockly.LDL['ins_5_stochastic'] = function (block) {
    var duration = Number(block.getFieldValue('duration'));
    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 5);

    // Colour picker.
    var branch = Blockly.LDL.statementToCode(block, 'colours');
    branch = branch !== null ? branch.trim() : null;

    if (branch === null || branch.length <= 0 || branch.length % 6 !== 0) {
        return "";
    }

    var parts = branch.length / 6;
    var partsEncoded = Blockly.LDL.instructions.decToHex(parts, 2);
    var code = '"' + encodedOpCode + partsEncoded + branch + '",\n';

    return code;
};


Blockly.LDL['ins_6_blocks'] = function (block) {
    var duration = Number(block.getFieldValue('duration'));
    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 6);

    // Colour picker.
    var branch = Blockly.LDL.statementToCode(block, 'blocks');
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
    var code = '"' + encodedOpCode + partsEncoded + pixels + colours + '",\n';

    return code;
};

Blockly.LDL['ins_7_rainbow'] = function(block) {
    var duration = Number(block.getFieldValue('duration'));
    var encodedOpCode = Blockly.LDL.instructions.encodeInstructionOpcode(duration, 7);
    var length = Number(block.getFieldValue('length'));
    var lengthEncoded = Blockly.LDL.instructions.decToHex(length, 2);
    var steps = Number(block.getFieldValue('steps'));
    var stepsEncoded = Blockly.LDL.instructions.decToHex(steps, 2); 
    var startFar = Number(block.getFieldValue('startFar') === 'TRUE');
    var startFarEncoded = Blockly.LDL.instructions.decToHex(startFar, 1); 

    // Colour picker.
    var branch = Blockly.LDL.statementToCode(block, 'colours');
    branch = branch !== null ? branch.trim() : null;

    if (branch === null || branch.length <= 0 || branch.length % 6 !== 0) {
        return "";
    }

    var parts = branch.length / 6;
    var partsEncoded = Blockly.LDL.instructions.decToHex(parts, 2);
    var code = '"' + encodedOpCode + lengthEncoded + stepsEncoded + startFarEncoded + partsEncoded + branch + '",\n';

    return code;
};

Blockly.LDL['fixedpixelscolour'] = function (block) {
    var pixels = Number(block.getFieldValue('pixels'));
    var pixelsEncoded = Blockly.LDL.instructions.decToHex(pixels, 2);
    var colour = block.getFieldValue('colour').replace('#', '').toUpperCase();

    // Colour picker.
    var code = pixelsEncoded + colour;

    return code;
};

Blockly.LDL['pixelscolour'] = function (block) {
    var colour = block.getFieldValue('colour').replace('#', '').toUpperCase();
    return colour;
};