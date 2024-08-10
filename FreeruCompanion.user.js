// ==UserScript==
// @name Freeru Companion
// @author MaximDev
// @namespace MaximDev
// @version 2.1
// @homepage https://github.com/MAX1MDEV/FreeruCompanion
// @supportURL https://github.com/MAX1MDEV/FreeruCompanion/issues
// @updateURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/main/FreeruCompanion.user.js
// @downloadURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/main/FreeruCompanion.user.js
// @description Auto confirm tasks
// @description:ru Автоматическое подтверждение заданий
// @match ://freeru.vip/games/cases*
// @match ://freeru.vip/games/giveaways/games*
// @grant none
// ==/UserScript==

(function() {
  'use strict';

  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '50%';
  container.style.right = '0';
  container.style.transform = 'translateY(-50%)';
  container.style.background = 'white';
  container.style.padding = '10px';
  container.style.border = '1px solid #ccc';
  container.style.borderRadius = '5px';
  container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
  container.style.display = 'flex';
  container.style.justifyContent = 'space-between';
  container.style.zIndex = '1000';
  document.body.appendChild(container);

  var mainButton = document.createElement('button');
  mainButton.textContent = 'Подтвердить';
  mainButton.style.background = 'green';
  mainButton.style.color = 'white';
  mainButton.style.border = 'none';
  mainButton.style.borderRadius = '5px';
  mainButton.style.padding = '10px 20px';
  container.appendChild(mainButton);

  var langButton = document.createElement('button');
  langButton.textContent = 'RU';
  langButton.style.background = 'white';
  langButton.style.color = 'black';
  langButton.style.border = '1px solid #ccc';
  langButton.style.borderRadius = '5px';
  langButton.style.padding = '5px 10px';
  container.appendChild(langButton);

  langButton.addEventListener('click', function() {
    if (langButton.textContent === 'EN') {
      langButton.textContent = 'RU';
      mainButton.textContent = 'Подтвердить';
    } else {
      langButton.textContent = 'EN';
      mainButton.textContent = 'Confirm';
    }
  });

  mainButton.addEventListener('click', function() {
    confirmTasks();
    window.open('', '_self').close();
  });

  mainButton.addEventListener('mouseover', function() {
    mainButton.style.background = 'darkgreen';
    mainButton.style.color = 'white';
    mainButton.style.cursor = 'pointer';
  });

  mainButton.addEventListener('mouseout', function() {
    mainButton.style.background = 'green';
    mainButton.style.color = 'white';
    mainButton.style.cursor = 'default';
  });

  langButton.addEventListener('mouseover', function() {
    langButton.style.background = 'gray';
    langButton.style.color = 'white';
    langButton.style.cursor = 'pointer';
  });

  langButton.addEventListener('mouseout', function() {
    langButton.style.background = 'white';
    langButton.style.color = 'black';
    langButton.style.cursor = 'default';
  });

  function confirmTasks() {
    var buttons = document.querySelectorAll('.task-card__button.task-card__button_stretch.btn.btn-blue');
    buttons.forEach(function(button) {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
      if (!button.hasAttribute('href') && !button.hasAttribute('target')) {
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
      }
    });

    var buttons_con = document.querySelectorAll('.task-card__button.task-card__button_stretch.btn.btn-bordered');
    buttons_con.forEach(function(button) {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });
      button.click();
    });
  }
})();
