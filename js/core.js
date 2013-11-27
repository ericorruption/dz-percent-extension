/*
    ---------------------------------------------
    -   JS Stuff
    -   /core.js
    -   Namespace, major scripts etc...
    ---------------------------------------------
    -   Author: Eric Quanz (based on work of James Haley)
    -           eric.quanz@gmail.com
    -           2013
    ---------------------------------------------
*/

var app = {};

//  ++ Initiation
//----------------------------------------------
//  First run settings/animations
app.init = function () {
    // Load functions
    app.memory.load();
    app.watcher.assign();

    // Assign Actions
    $('oSetDefault').observe('click', app.memory.setDefault);
    $('oAboutShow').observe('click', function () {
        $('oMainPage').addClassName('hidden');
        $('oAboutPage').removeClassName('hidden');
    });
    $('oAboutClose').observe('click', function () {
        $('oAboutPage').addClassName('hidden');
        $('oMainPage').removeClassName('hidden');
    });
};

//  ++ Utilities
//----------------------------------------------
(app.utils = function () {
    return {
        rnd: function (nMax) {
            nMax = nMax || 1000000000;
            return Math.floor(Math.random() * nMax);
        }
    };
}());

//  ++ localStorage
//----------------------------------------------
//  Check if first time/load previous figures
(app.memory = function () {
    return {
        load: function () {
            var bDefaultsSet = localStorage.emCalcDefaultsSet || false;
            if (bDefaultsSet) {
                $('oContext').value = localStorage.defaultContext;
                $('oPercent').value = localStorage.defaultPercent;
                $('oBase').value = localStorage.defaultBase;
            } else {
                $('oContext').value = '940px';
                $('oPercent').value = '100%';
                $('oBase').value = '940px';
            }
        },
        setDefault: function () {
            localStorage.emCalcDefaultsSet = true;
            localStorage.defaultContext = $('oContext').value;
            localStorage.defaultPercent = $('oPercent').value;
            localStorage.defaultBase = $('oBase').value;

            // Update link to show updated
            $('oSetDefault').update('Saved as default values!');
            window.setTimeout(function () {
                $('oSetDefault').update('Set as default values');
            }, 5000);
        }
    };
}());

//  ++ Calculations
//----------------------------------------------------
//  Observe the text fields and calculate live values
(app.watcher = function () {
    var oCalculate = function (e) {
            var nCurrentValue = e.findElement().value.tidyNumeric(),
                nCurrentBase,
                nCurrentContext;

            if (isNaN(nCurrentValue) !== true) {
                // Calculate required sum
                if (e.findElement().id === 'oPercent') {
                    nCurrentContext = $('oContext').value.tidyNumeric();

                    $('oBase').value = ((nCurrentContext * nCurrentValue) / 100).tidyDecimal(0) + 'px';
                } else if (e.findElement().id === 'oContext') {
                    nCurrentBase = $('oBase').value.tidyNumeric();

                    $('oPercent').value = (nCurrentValue === 0 ? 0 : (100 * (nCurrentBase / nCurrentValue)).tidyDecimal(3)) + '%';
                } else if (e.findElement().id === 'oBase') {
                    nCurrentContext = $('oContext').value.tidyNumeric();

                    $('oPercent').value = (nCurrentValue === 0 || nCurrentContext === 0 ? 0 : (100 * (nCurrentValue / nCurrentContext)).tidyDecimal(3)) + '%';
                }
            }
        };

    // Public functions
    return {
        assign: function () {
            // Key ups
            $('oContext').observe('keyup', function (e) {
                oCalculate(e);
            });
            $('oPercent').observe('keyup', function (e) {
                oCalculate(e);
            });
            $('oBase').observe('keyup', function (e) {
                oCalculate(e);
            });

            // Blur
            $('oContext').observe('blur', function (e) {
                e.findElement().value = e.findElement().value.tidyNumeric().tidyDecimal(0) + 'px';
            });
            $('oPercent').observe('blur', function (e) {
                e.findElement().value = e.findElement().value.tidyNumeric().tidyDecimal(3) + '%';
            });
            $('oBase').observe('blur', function (e) {
                e.findElement().value = e.findElement().value.tidyNumeric().tidyDecimal(0) + 'px';
            });
        }
    };
}());

//  ++ Useful prototypes
//----------------------------------------------

// Remove last full stop prototype
String.prototype.trimFullStops = function () {
    return this.replace(/^\.+|\.+$/, "");
};

// Make Numeric
String.prototype.tidyNumeric = function () {
    return Math.abs(this.replace(/[^0-9.]/ig, '').trimFullStops());
};

// Tidy value
Number.prototype.tidyDecimal = function (n) {
    return Math.abs(this.toFixed(n));
}

//  ++ Run Site
//----------------------------------------------
document.observe("dom:loaded", app.init);