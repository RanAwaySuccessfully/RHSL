"use strict";
var rhslCurrentElement = (function () {
    var currentElement = false;
    return function (element) {
        if (!element && element !== false) {
            return currentElement;
        } else {
            if (!element) {element = false;};
            currentElement = element;
        }
    }
})();

window.onload = function() {rhslFirstFunction();};
function rhslFirstFunction(refresh) {
    var elementList = document.querySelectorAll("[rhslcolor]");
    if (refresh) {
        for (var i = 0; i < elementList.length; i++) {rhslAddRemove(elementList[i], false, true);}
    }
    for (var i = 0; i < elementList.length; i++) {
        if (elementList[i].value) {rhslAddRemove(elementList[i], elementList[i].value);} else {rhslAddRemove(elementList[i]);}
    }
}

function rhslAddRemove(element, value, shouldRemove) {
    try {
        if (!element) throw "No element was provided.";
        if (element.tagName !== ("BUTTON") && element.tagName !== ("INPUT")) throw "Element is not <button> or <input>.";
        if (element.tagName === ("INPUT") && (element.type && element.type !== "text")) throw "Input type must be empty or text.";
    } catch(error) {console.error("RHSL: Error while trying to add/remove an EventListener: " + error); return;}
    if (shouldRemove) {
        element.removeEventListener("click", rhslToggle, false);
        element.removeEventListener("input", rhslOnInput, false);
    } else {
        if (!value) {console.warn("RHSL: Color not provided. Using #FFFFFF."); value = "#FFFFFF";}
        element.addEventListener("click", rhslToggle, false);
        element.addEventListener("input", rhslOnInput, false);
        var color = rhslColorConverter(value, true);
        rhslFineChange(element, color);
    }
}

function rhslOnInput(event) {
    rhslToggle(event, false, true);
    var color = rhslColorConverter(event.target.value, true, true);
    color[0] = Math.round(color[0]);
    color[1] = Math.round(color[1]);
    color[2] = Math.round(color[2]);
    rhslFineChange(event.target, color, false, true);
}
function rhslToggle(event, element, refresh) {
    if (!document.getElementById("rhslcolorpickercontainer")) {
        if (!element) {element = event.target;}
        var properties = element.getAttribute("rhslcolor");
        var size;
        var align;
        var hsltype;
        var padding;
        if (properties) {
            properties = rhslProperties(properties);
            for (var i = 0; i < properties.length; i++) {
                if (properties[i][0].match(/^size$/)) {size = properties[i][1]; continue;}
                if (properties[i][0].match(/^align$/)) {align = properties[i][1]; continue;}
                if (properties[i][0].match(/^theme$/)) {themeCSS = properties[i][1]; continue;}
                if (properties[i][0].match(/^hsltype$/)) {hsltype = properties[i][1]; continue;}
                if (properties[i][0].match(/^padding$/)) {padding = properties[i][1];}
            }
        }
        if (!size) {size = [180, 150];} else {
            if (isNaN(size[0]) || size[0] < 75) {size[0] = 180;}
            if (isNaN(size[1]) || size[1] < 75) {size[1] = 150;}
        }
        if (!padding || padding < 0) {padding = 5;}
        if (!align) {align = "left";}
        if (!hsltype) {hsltype = "normal";} // default values
        if (themeCSS === "dark") {
            themeCSS = ["border-color: #555; background: #333;", "border-color: #000;"];
        } else if (Array.isArray(themeCSS)) {
            for (var i = 0; i < 3; i++) {
                if (!themeCSS[i]) {if (i === 2) {themeCSS[i] = "#000";} else {themeCSS[i] = "transparent"; continue;}}
                themeCSS[i] = rhslColorConverter(themeCSS[i]);
                themeCSS[i] = "rgb(" + themeCSS[i][0] + ", " + themeCSS[i][1] + ", " + themeCSS[i][2] + ")";
            }
            themeCSS = ["border-color: " + themeCSS[0] + "; background: " + themeCSS[1] + ";", "border-color: " + themeCSS[2] + ";"];
        } else {
            var themeCSS = ["border-color: #AAA; background: #DDD;", "border-color: #555;"];
        }
        if (hsltype === "luv" && window.hsluv) {
            var hslvalue = rhslColorConverter(element.value);
            hslvalue = window.hsluv.rgbToHsluv([hslvalue[0] / 255, hslvalue[1] / 255, hslvalue[2] / 255]);
            var bg1 = 'linear-gradient(90deg, #EA0064, #D34800, #AC6700, #957200, #817900, #6A8000, #3F8700, #00894B, #00876A, #00867C, #00848B, #00829C, #007EB7, #2A6CFF, #A23EFF, #CD00E2, #D900BC, #E20097, #EA0064)';
            var bg2 = 'linear-gradient(rgba(119, 119, 119, 0), rgba(119, 119, 119, 1))';
            var bg3 = 'linear-gradient(#FFFFFF, ' + window.hsluv.hsluvToHex([hslvalue[0], hslvalue[1], 90]) + ', ' + window.hsluv.hsluvToHex([hslvalue[0], hslvalue[1], 80]) + ', ' + window.hsluv.hsluvToHex([hslvalue[0], hslvalue[1], 70]) + ', ' + window.hsluv.hsluvToHex([hslvalue[0], hslvalue[1], 60]) + ', ' + window.hsluv.hsluvToHex([hslvalue[0], hslvalue[1], 50]) + ', ' + window.hsluv.hsluvToHex([hslvalue[0], hslvalue[1], 40]) + ', ' + window.hsluv.hsluvToHex([hslvalue[0], hslvalue[1], 30]) + ', ' + window.hsluv.hsluvToHex([hslvalue[0], hslvalue[1], 20]) + ', ' + window.hsluv.hsluvToHex([hslvalue[0], hslvalue[1], 10]) + ', #000000)';
        } else {
            var hslvalue = rhslColorConverter(element.value, true);
            var color = "hsl(" + Math.round(hslvalue[0]) + ", " + Math.round(hslvalue[1]) + "%, " + Math.round(hslvalue[2]) + "%)";
            var trimmedcolor = Math.round(hslvalue[0]) + ", " + Math.round(hslvalue[1]) + "%";
            var bg1 = 'linear-gradient(90deg, hsl(0, 100%, 50%), hsl(20, 100%, 50%), hsl(40, 100%, 50%), hsl(60, 100%, 50%), hsl(80, 100%, 50%), hsl(100, 100%, 50%), hsl(120, 100%, 50%), hsl(140, 100%, 50%), hsl(160, 100%, 50%), hsl(180, 100%, 50%), hsl(200, 100%, 50%), hsl(220, 100%, 50%), hsl(240, 100%, 50%), hsl(260, 100%, 50%), hsl(280, 100%, 50%), hsl(300, 100%, 50%), hsl(320, 100%, 50%), hsl(340, 100%, 50%), hsl(360, 100%, 50%))';
            var bg2 = 'linear-gradient(hsla(0, 0%, 50%, 0), hsla(0, 0%, 50%, 1))';
            var bg3 = 'linear-gradient(hsl(' + trimmedcolor + ', 100%), hsl(' + trimmedcolor + ', 50%), hsl(' + trimmedcolor + ', 0%))';
        }
        var huePos = Math.round(((hslvalue[0] / 360) * size[0]) - 10);
        var satPos = Math.round(((size[1] - 1) - (hslvalue[1] / 100) * (size[1] - 1)) - 10);
        var lumPos = Math.round((size[1] - (hslvalue[2] / 100) * size[1]) - 10);
        var colorpicker = document.createElement("div");
        colorpicker.id = "rhslcolorpickercontainer";
        colorpicker.setAttribute("onmousemove", "rhslColorPicker(this, event);");
        colorpicker.setAttribute("onclick", "rhslColorPicker(this, event, true);");
        colorpicker.setAttribute("style", themeCSS[0] + " padding: " + padding++ + "px;");
        colorpicker.innerHTML = '<div class="rhslcolorpicker" style="background: ' + bg1 + '; ' + themeCSS[1] + '">' + 
            '<div style="background: ' + bg2 + '; width: ' + size[0] + 'px; height: ' + size[1] + 'px;">' + 
                '<img src="data:image/gif;base64,R0lGODlhFAAUAIABAAAAAP///yH5BAEKAAEALAAAAAAUABQAAAImjH8AyJ3rolFS0uouZno/D4aZQkJIiaJNaoqu14Ex3Mo1/c6bbhQAOw==" class="rhslcolorpickerselected" style="top: ' + satPos + 'px; left: ' + huePos + 'px;">' + 
            '</div>' + 
        '</div>' + 
        '<div class="rhslcolorpickerside" style="background: ' + bg3 + '; ' + themeCSS[1] + ' margin-left: ' + padding + 'px;">' + 
            '<img src="data:image/gif;base64,R0lGODlhFAAUAIABAAAAAP///yH5BAEKAAEALAAAAAAUABQAAAIdjI+py+0Po5yg2ouz3nmG64GUFXLmeXrqyrZuUwAAOw==" class="rhslcolorpickerselected" style="top: ' + lumPos + 'px; left: -2px;">' + 
        '</div>';
        document.body.appendChild(colorpicker);
        document.body.addEventListener("mousedown", rhslHideColorPicker, true);
        rhslCurrentElement(element);
        rhslAlignElement(colorpicker, element, align);
    } else {
        document.body.removeChild(document.getElementById("rhslcolorpickercontainer"));
        document.body.removeEventListener("mousedown", rhslHideColorPicker, true);
        rhslCurrentElement(false);
    }
    if (refresh) {rhslToggle(event, element);}
}
function rhslProperties(properties, lookFor) {
    properties = properties.split(";");
    properties.pop();
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].charAt(0) === " ") {properties[i] = properties[i].substring(1);}
        properties[i] = properties[i].split(":");
        if (properties[i][1].charAt(0) === " ") {properties[i][1] = properties[i][1].substring(1);}
            if (properties[i][1].match(",")) {
            properties[i][1] = properties[i][1].split(",");
            for (var i2 = 0; i2 < properties[i][1].length; i2++) {
                if (properties[i][1][i2].charAt(0) === " ") {properties[i][1][i2] = properties[i][1][i2].substring(1);}
            }
        }
    } // this is a gigantic mess that somehow still works in the end
    if (lookFor) {
        for (var i = 0; i < properties.length; i++) {
            if (properties[i][0].match(lookFor)) {properties = properties[i][1]; break;}
        }
    }
    return properties;
}
function rhslAlignElement(colorpicker, element, align, attempt) {
    var position = rhslGetPosition(element, true);
    colorpicker.style.top = position[1] + element.offsetHeight + 1 + "px";
    if (!attempt) {attempt = 1;}
    if (align === "left" && attempt < 4) {
        var tempElementPos = position[0] - 5;
        if ((tempElementPos + colorpicker.offsetWidth) > document.body.offsetWidth) {
            attempt++;
            rhslAlignElement(colorpicker, element, "right", attempt);
        } else {colorpicker.style.left = tempElementPos + "px";}
    } else if (align === "right" && attempt < 4) {
        var tempElementPos = position[0] + element.offsetWidth - colorpicker.offsetWidth + 5;
        if (tempElementPos < 0) {
            attempt++;
            rhslAlignElement(colorpicker, element, "left", attempt);
        } else {colorpicker.style.left = tempElementPos + "px";}
    } else if (align === "center" || attempt >= 4) {
        var tempElementPos = position[0] - ((colorpicker.offsetWidth - element.offsetWidth) / 2);
        if ((tempElementPos < 0 || (tempElementPos + (colorpicker.offsetWidth / 2)) > document.body.offsetWidth) && attempt < 4) {
            attempt++;
            rhslAlignElement(colorpicker, element, "left", attempt);
        } else {colorpicker.style.left = tempElementPos + "px";}
    }
}

function rhslHideColorPicker(event) {
    var target = event.target || event.srcElement;
    var colorpicker = document.getElementById("rhslcolorpickercontainer");
    if (target !== colorpicker && !isChildOf(target, colorpicker)) {rhslToggle();}
}
function isChildOf(child, parent) {
    if (child.parentNode === parent) {
        return true;
    } else if (child.parentNode === null) {
        return false;
    } else {return isChildOf(child.parentNode, parent);}
}

function rhslColorPicker(element, event, isclick, coords) {
    if ((!event.which || !event.buttons) && !isclick) {return;}
    var isSide = false;
    var mainColor = element.children[0];
    var sideColor = element.children[1];
    var elementPos = rhslGetPosition(mainColor);
    if (coords) {
        var x = coords[0];
        if (!x && (x !== 0)) {isSide = true;}
        x = Math.round(x / 360 * mainColor.clientWidth);
        var y = Math.round(coords[1] / 100 * mainColor.clientHeight);
    } else {
        var x = event.clientX;
        var y = event.clientY;
        if (x >= rhslGetPosition(sideColor)[0]) {isSide = true;}
        x = x - elementPos[0];
        y = y - elementPos[1];
        if (window.getSelection) {var sel = window.getSelection();} else if (document.selection) {var sel = document.selection.createRange();}
        if (sel && (sel.rangeCount)) {sel.removeAllRanges();}
        if (sel && (sel.text > '')) {document.selection.empty();}
    }
    if (y < 0) {y = 0;}
    if (x < 0) {x = 0;}
    if (x > mainColor.clientWidth && !isSide) {x = mainColor.clientWidth;}
    if (y > mainColor.clientHeight) {y = mainColor.clientHeight;}
    var input = rhslCurrentElement();
    if (input.getAttribute("rhslcolor").match(/hsltype: ?luv;/) && window.hsluv) {var isLUV = true;} else {var isLUV = false;}
    if (isSide) {
        sideColor.firstElementChild.style.top = y - 10 + "px";
        var hue = Math.round((Number(mainColor.children[0].firstElementChild.style.left.match(/-?\d+/)) + 10) / mainColor.clientWidth * 360);
        var sat = Math.round(Math.abs(Number(mainColor.children[0].firstElementChild.style.top.match(/-?\d+/)) + 10 - mainColor.clientHeight) / mainColor.clientHeight * 100);
        var lum = Math.round(((mainColor.clientHeight - y) / mainColor.clientHeight) * 100);
    } else {
        mainColor.children[0].firstElementChild.style.left = x - 10 + "px";
        mainColor.children[0].firstElementChild.style.top = y - 10 + "px";
        var hue = Math.round((x / mainColor.clientWidth) * 360);
        var sat = Math.round(((mainColor.clientHeight - y) / mainColor.clientHeight) * 100);
        var lum = Math.round(Math.abs(Number(sideColor.firstElementChild.style.top.match(/-?\d+/)) + 10 - mainColor.clientHeight) / mainColor.clientHeight * 100);
        if (isLUV) {
            sideColor.style.background = "linear-gradient(#FFFFFF, " + window.hsluv.hsluvToHex([hue, sat, 90]) + ', ' + window.hsluv.hsluvToHex([hue, sat, 80]) + ', ' + window.hsluv.hsluvToHex([hue, sat, 70]) + ', ' + window.hsluv.hsluvToHex([hue, sat, 60]) + ', ' + window.hsluv.hsluvToHex([hue, sat, 50]) + ', ' + window.hsluv.hsluvToHex([hue, sat, 40]) + ', ' + window.hsluv.hsluvToHex([hue, sat, 30]) + ', ' + window.hsluv.hsluvToHex([hue, sat, 20]) + ', ' + window.hsluv.hsluvToHex([hue, sat, 10]) + ", #000000)";
        } else {sideColor.style.background = "linear-gradient(hsl(" + hue + ", " + sat +"%, 100%), hsl(" + hue + ", " + sat +"%, 50%), hsl(" + hue + ", " + sat +"%, 0%))";}
    }
    rhslFineChange(input, [hue, sat, lum], isLUV);
}
function rhslGetPosition(element, noScroll) {
    element = element.getBoundingClientRect();
    if (noScroll) {
        var xScroll = window.pageXOffset || document.documentElement.scrollLeft;
        var yScroll = window.pageYOffset || document.documentElement.scrollTop;
        var x = element.left + xScroll;
        var y = element.top + yScroll;
    } else {
        var x = element.left;
        var y = element.top;
    }
    return [x, y];
}

function rhslFineChange(element, color, isLUV, ignoreValue) {
    var properties = element.getAttribute("rhslcolor");
    var updateSelf;
    var updateLinked;
    if (properties) {
        properties = rhslProperties(properties);
        for (var i = 0; i < properties.length; i++) {
            if (properties[i][0].match(/^update-self$/)) {updateSelf = properties[i][1]; continue;}
            if (properties[i][0].match(/^update-linked$/)) {updateLinked = properties[i][1]; continue;}
        }
    }
    var origColor = color;
    if (!updateSelf) {updateSelf = ["bg-color", "hex"];}
    var textcolor = rhslContrast(rhslColorParser(color, "rgb", isLUV, true), isLUV);
    color = rhslColorParser(color, updateSelf[1], isLUV);
    if (updateSelf[0].match(/\+text$/) || updateSelf[0] === "text" && element.tagName !== ("INPUT")) {element.innerHTML = color;}
    if (updateSelf[0].match(/^bg-color(\+text)?$/)) {
        element.style.background = color; element.style.color = textcolor;
    } else if (updateSelf[0].match(/^bg-only(\+text)?$/)) {
        element.style.background = color;
    } else if (updateSelf[0].match(/^text-color(\+text)?$/)) {
        element.style.color = color;
    } else if (updateSelf[0].match(/^border-color(\+text)?$/)) {
        element.style.borderColor = color;
    } else if (updateSelf[0].match(/^outline-color(\+text)?$/)) {
        element.style.outlineColor = color;
    }
    if (!ignoreValue) {element.value = color;}
    if (updateLinked) {
        var currentLinked;
        if (!Array.isArray(updateLinked)) {updateLinked = [updateLinked];}
        for (var i = 0; i < updateLinked.length; i++) {
            color = origColor;
            currentLinked = updateLinked[i].replace(/[\(\)]/g,"").split(" ");
            if (document.getElementById(currentLinked[0])) {
                element = document.getElementById(currentLinked[0]);
                if (!currentLinked[1]) {currentLinked[1] = "bg+text";}
                if (!currentLinked[2]) {currentLinked[2] = "hex";}
                textcolor = rhslContrast(rhslColorParser(color, "rgb", isLUV, true), isLUV);
                color = rhslColorParser(color, currentLinked[2], isLUV);
                if (currentLinked[1].match(/\+text$/) || currentLinked[1] === "text" && element.tagName !== ("INPUT")) {element.innerHTML = color;}
                if (currentLinked[1].match(/^bg-color(\+text)?$/)) {
                    element.style.background = color; element.style.color = textcolor;
                } else if (currentLinked[1].match(/^bg-only(\+text)?$/)) {
                    element.style.background = color;
                } else if (currentLinked[1].match(/^text-color(\+text)?$/)) {
                    element.style.color = color;
                } else if (currentLinked[1].match(/^border-color(\+text)?$/)) {
                    element.style.borderColor = color;
                } else if (currentLinked[1].match(/^outline-color(\+text)?$/)) {
                    element.style.outlineColor = color;
                }
                element.value = color;
            }
        }
    }
}

function rhslColorConverter(value, toHSL, ignoreWarnings) {
    var invalid = false;
    if (value.match(/^#[\dA-F]{3}$/i) || value.match(/^#[\dA-F]{4}$/i)) {
        value = [value.charAt(1), value.charAt(2), value.charAt(3)];
        value = "#" + value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
    }
    if (value.match(/^#[\dA-F]{6}$/i) || value.match(/^#[\dA-F]{8}$/i)) {
        value = "rgb(" + parseInt(value.substr(1, 2), 16) + ", " + parseInt(value.substr(3, 2), 16) + ", " + parseInt(value.substr(5, 2), 16) + ")";
    }
    if (value.match(/^rgb/)) {
        value = value.replace(/[rgba()]/g,"");
        value = value.split(",");
        if (!Array.isArray(value) || value.length > 4) {invalid = true;}
        for (var i = 0; i < 3; i++) {if (value[i] < 0 || value[i] > 255 || isNaN(value[i])) {invalid = true;}}
        if (!invalid) {
            if (toHSL) {
                value = rgbToHsl(value[0], value[1], value[2]);
                value[0] *= 360;
                value[1] *= 100;
                value[2] *= 100;
            } else {
                value[0] = Number(value[0]);
                value[1] = Number(value[1]);
                value[2] = Number(value[2]);
            }
            return value;
        }
    } else if (value.match(/^hsl/)) {
        value = value.replace(/[hsla%()]/g,"");
        value = value.split(",");
        if (!Array.isArray(value) || value.length > 4) {invalid = true;}
        if (value[0] < 0 || value[0] > 360 || isNaN(value[0])) {invalid = true;}
        if (value[1] < 0 || value[1] > 100 || isNaN(value[1])) {invalid = true;}
        if (value[2] < 0 || value[2] > 100 || isNaN(value[2])) {invalid = true;}
        if (!invalid) {
            if (toHSL) {
                value[0] = Number(value[0]);
                value[1] = Number(value[1]);
                value[2] = Number(value[2]);
            } else {
                value[0] /= 360;
                value[1] /= 100;
                value[2] /= 100;
                value = hslToRgb(value[0], value[1], value[2]);
            }
            return value;
        }
    } else {invalid = true;}
    if (invalid) {
        if (!ignoreWarnings) {console.warn("RHSL: The color must be in either of these formats: #0F0, #00FF00, rgb(0, 255, 0) or hsl(120, 100%, 50%). Their alpha counterparts are supported, but the color picker will discard the alpha value provided. If using HSL values, the hue must not be over 360. Using #000000.");}
        return [0, 0, 0];
    }
}
function rhslColorParser(color, changeTo, isLUV, toArray) {
    if (changeTo.match(/^rgb$/)) {
        if (isLUV) {
            color = window.hsluv.hsluvToRgb(color);
            color[0] *= 255;
            color[1] *= 255;
            color[2] *= 255;
        } else {color = rhslColorConverter("hsl(" + color[0] + ", " + color[1] + "%, " + color[2] + "%)");}
        color[0] = Math.round(color[0]);
        color[1] = Math.round(color[1]);
        color[2] = Math.round(color[2]);
        if (!toArray) {color = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";}
    } else if (changeTo.match(/^hsl$/)) {
        if (isLUV) {
            color = window.hsluv.hsluvToRgb(color);
            color[0] = Math.round(color[0] * 255);
            color[1] = Math.round(color[1] * 255);
            color[2] = Math.round(color[2] * 255);
            color = rhslColorConverter("rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")", true);
        }
        color[0] = Math.round(color[0]);
        color[1] = Math.round(color[1]);
        color[2] = Math.round(color[2]);
        if (!toArray) {color = "hsl(" + color[0] + ", " + color[1] + "%, " + color[2] + "%)";}
    } else { // hex
        if (isLUV) {color = window.hsluv.hsluvToHex(color).toUpperCase();} else {
            color = rhslColorConverter("hsl(" + color[0] + ", " + color[1] + "%, " + color[2] + "%)");
            color = [color[0].toString(16), color[1].toString(16), color[2].toString(16)];
            if (color[0].length < 2) {color[0] = "0" + color[0];}
            if (color[1].length < 2) {color[1] = "0" + color[1];}
            if (color[2].length < 2) {color[2] = "0" + color[2];}
            color = "#" + color.join("").toUpperCase();
        }
    }
    return color;
}
function rhslContrast(bgColor, isLUV) {
    bgColor.forEach(rhslSrgbMadness);
    var L1 = (0.2126 * bgColor[0]) + (0.7152 * bgColor[1]) + (0.0722 * bgColor[2]);
    var L2 = 1; // #FFF
    var L3 = 0; // #000
    var contrast2 = Math.round( (L2 + 0.05) / (L1 + 0.05) * 10) / 10;
    var contrast3 = Math.round( (L1 + 0.05) / (L3 + 0.05) * 10) / 10;
    if (contrast3 > contrast2) {return "#000000";} else {return "#FFFFFF";}
}
function rhslSrgbMadness(value, index, array) {
    value /= 255;
    if (value <= 0.03928) {value /= 12.92;} else {value = Math.pow((value + 0.055) / 1.055, 2.4);}
    array[index] = value;
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}
function hslToRgb(h, s, l) {
    var r, g, b;
    if (s == 0) {r = g = b = l; /* achromatic */} else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
} // https://gist.github.com/mjackson/5311256