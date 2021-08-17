/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/DynamicDateOption"],function(t){"use strict";var e=t.extend("sap.m.CustomDynamicDateOption",{metadata:{library:"sap.m",properties:{getText:{type:"function"},getValueHelpUITypes:{type:"function"},createValueHelpUI:{type:"function"},getValueHelpOutput:{type:"function"},getGroup:{type:"function"},getGroupHeader:{type:"function"},format:{type:"function"},parse:{type:"function"},toDates:{type:"function"},enhanceFormattedValue:{type:"function"}}}});function p(t){return t.charAt(0).toUpperCase()+t.slice(1)}["getText","getValueHelpUITypes","createValueHelpUI","getValueHelpOutput","getGroup","getGroupHeader","format","parse","toDates","enhanceFormattedValue"].forEach(function(a){e.prototype[a]=function(){var e="get"+p(a);var n=this[e]();return n?n.apply(this,arguments):t.prototype[a].apply(this,arguments)}});return e});