// ==UserScript==
// @name Freeru Companion
// @author MaximDev
// @namespace MaximDev
// @version 1.0
// @homepage https://github.com/MAX1MDEV/FreeruCompanion
// @supportURL https://github.com/MAX1MDEV/FreeruCompanion/issues
// @updateURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/master/GiveawayCompanion.user.js
// @downloadURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/master/GiveawayCompanion.user.js
// @description Auto confirm tasks
// @description Автоматическое подтверждение заданий
// @match *://freeru.vip/*
// @grant none
// ==/UserScript==

(function() {
  'use strict';

  // Первый скрипт
  var buttons = document.querySelectorAll('.task-card__button.task-card__button_stretch.btn.btn-blue');
  buttons.forEach(function(button) {
    var event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
      detail: 0,
      buttons: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
    });
    button.dispatchEvent(event);
    event.preventDefault();
  });

  // Второй скрипт
  var buttons = document.querySelectorAll('.task-card__button.task-card__button_stretch.btn.btn-bordered');
  buttons.forEach(function(button) {
    button.click();
  });
})();