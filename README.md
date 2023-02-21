# Light-Server-Blockly

This is a clone of the Google Blockly library.  It adds support for the LDL language.  The Google Blockly library dependency is well out of date and needs updating.

NOTE: this may not be the best way of approaching this problem.  In particular, the Google Blockly library is well out of date.  Really all that is needed is to add the LDL extension to the Google Blockly dependency.  Something that needs looking for the future.

More details of the main project can be found here: https://github.com/KevinWhite-KWS/Light-Server

## Goal

Extend Google Blockly to add support for creating LDL programs.  That is, add LDL instuctions to the Google Blockly library.

## Where are we and what do we need to do?

This is really an prototype of a solution.  The significant flaw is that it requires what is effectively a fork of the entire Google Blockly project just to add support for the LDL instructions.  This means the Google Blockly dependency has not been updated for some time.

* Eliminate the need to effectively fork the Google Blockly project - eliminate this project!
* Add Google Blockly as a dependency to the LDL editor project (https://github.com/KevinWhite-KWS/Light-Server-Front-End)
* Simply create script files that extend the Google Blockly functionality to add LDL instruction support
* Improve the Google Blockly LDL instructions - many can be significantly improved

## Getting Started

Clone this repository locally:

```gh repo clone KevinWhite-KWS/Light-Server-Blockly```

The LDL blockly extensions are found in the subfolder google\blockly\generators\ldl.
