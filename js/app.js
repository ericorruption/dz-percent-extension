'use strict';

var $setDefaultsBtn,
    $contextField,
    $baseField,
    $percentField;



var utils = {
  tidyNumeric: function(value) {
    var tidiedNumeric = value.replace(/[^0-9.]/ig, '');
    tidiedNumeric  = tidiedNumeric.replace(/^\.+|\.+$/, '');
    return Math.abs(tidiedNumeric);
  },

  tidyDecimal: function(value, decimalPoints) {
    return Math.abs(value.toFixed(decimalPoints));
  },

  settings: {
    loadDefaults: function() {
      var areDefaultsSet = localStorage.defaultsSet || false;
      if (areDefaultsSet) {
        $contextField.value = localStorage.defaultContext;
        $baseField.value = localStorage.defaultBase;
        $percentField.value = localStorage.defaultPercent;
      }
    },
    setDefaults: function() {
      localStorage.defaultsSet = true;
      localStorage.defaultContext = $contextField.value;
      localStorage.defaultBase = $baseField.value;
      localStorage.defaultPercent = $percentField.value;

      var defaultText = $setDefaultsBtn.innerHTML;

      $setDefaultsBtn.innerHTML = 'Defaults set!';
      setTimeout(function() {
        $setDefaultsBtn.innerHTML = defaultText;
      }, 2000);
    }
  }
};



function calculate(e) {
  var targetId = e.target.id,
      value = utils.tidyNumeric(e.target.value),
      contextValue = utils.tidyNumeric($contextField.value),
      baseValue    = utils.tidyNumeric($baseField.value);

  switch(targetId) {
    case 'context':
      $percentField.value = '0%';

      if (value !== 0) {
        $percentField.value = utils.tidyDecimal(100 * (baseValue / value) , 3) + '%';
      }

      if (e.type === 'blur') {
        e.target.value = utils.tidyDecimal(value, 0) + 'px';
      }

      break;

    case 'base':
      $percentField.value = '0%';

      if (value !== 0 && contextValue !== 0) {
        $percentField.value = utils.tidyDecimal(100 * (value / contextValue) , 3) + '%';
      }

      if (e.type === 'blur') {
        e.target.value = utils.tidyDecimal(value, 0) + 'px';
      }

      break;

    case 'percent':
      $baseField.value = utils.tidyDecimal(contextValue * value / 100, 0) + 'px';

      if (e.type === 'blur') {
        e.target.value = utils.tidyDecimal(value, 3) + '%';
      }
      break;
  }
}



function init() {
  $setDefaultsBtn = document.getElementById('set-defaults');
  $contextField   = document.getElementById('context');
  $baseField      = document.getElementById('base');
  $percentField   = document.getElementById('percent');

  var fields = [$contextField, $baseField, $percentField];

  for (var i = 0; i < fields.length; i++) {
    fields[i].addEventListener('input', calculate);
    fields[i].addEventListener('blur', calculate);
  }

  $setDefaultsBtn.addEventListener('click', utils.settings.setDefaults);

  utils.settings.loadDefaults();
}

document.addEventListener('DOMContentLoaded', init);
