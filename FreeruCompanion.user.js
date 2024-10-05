// ==UserScript==
// @name Freeru Companion
// @author MAX1MDEV
// @namespace MAX1MDEV
// @version 4.6
// @homepage https://github.com/MAX1MDEV/FreeruCompanion
// @supportURL https://github.com/MAX1MDEV/FreeruCompanion/issues
// @updateURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/main/FreeruCompanion.user.js
// @downloadURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/main/FreeruCompanion.user.js
// @description Auto confirm tasks
// @description:ru Автоматическое подтверждение заданий
// @match ://freeru.lol/games/cases*
// @match ://freeru.lol/games/giveaways/games*
// @icon https://freeru.lol/_nuxt/img/logo.8508f2a.png
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
  container.style.flexDirection = 'column';
  container.style.justifyContent = 'space-between';
  container.style.zIndex = '1000';
  document.body.appendChild(container);

  var mainButton = document.createElement('button');
  mainButton.textContent = 'Подтвердить';
  mainButton.style.background = 'green';
  mainButton.style.color = 'white';
  mainButton.style.border = 'none';
  mainButton.style.borderRadius = '5px';
  mainButton.style.userSelect = 'none';
  mainButton.style.padding = '10px 20px';
  container.appendChild(mainButton);

  var toggleContainer = document.createElement('div');
  toggleContainer.style.display = 'flex';
  toggleContainer.style.alignItems = 'center';
  toggleContainer.style.marginTop = '5px';
  container.appendChild(toggleContainer);

  var toggleLabel = document.createElement('span');
  toggleLabel.textContent = 'Авто-продажа';
  toggleLabel.style.color = 'white';
  toggleLabel.style.border = 'none';
  toggleLabel.style.background = 'green';
  toggleLabel.style.padding = '10px 20px';
  toggleLabel.style.borderRadius = '5px';
  toggleLabel.style.marginRight = '5px';
  toggleLabel.style.userSelect = 'none';
  toggleContainer.appendChild(toggleLabel);

  var toggleSwitch = document.createElement('input');
  toggleSwitch.type = 'checkbox';
  toggleSwitch.id = 'auto-sell-toggle';
  toggleSwitch.style.width = '31px';
  toggleSwitch.style.height = '31px';
  toggleSwitch.style.background = 'green';
  toggleSwitch.style.accentColor = 'green';
  toggleSwitch.style.borderRadius = '5px';
  toggleContainer.appendChild(toggleSwitch);

  var langButton = document.createElement('button');
  langButton.textContent = 'RU';
  langButton.style.background = 'green';
  langButton.style.color = 'white';
  langButton.style.border = 'none';
  langButton.style.borderRadius = '5px';
  langButton.style.marginTop = '5px';
  langButton.style.userSelect = 'none';
  langButton.style.padding = '10px 20px';
  container.appendChild(langButton);

  langButton.addEventListener('click', function() {
    if (langButton.textContent === 'EN') {
      langButton.textContent = 'RU';
      mainButton.textContent = 'Подтвердить';
      toggleLabel.textContent = 'Авто-продажа';
    } else {
      langButton.textContent = 'EN';
      mainButton.textContent = 'Confirm';
      toggleLabel.textContent = 'Auto-sell'
    }
  });

  mainButton.addEventListener('click', function() {
    confirmTasks();
    window.open('', '_blank').close();
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
    langButton.style.background = 'darkgreen';
    langButton.style.color = 'white';
    langButton.style.cursor = 'pointer';
  });

  langButton.addEventListener('mouseout', function() {
    langButton.style.background = 'green';
    langButton.style.color = 'white';
    langButton.style.cursor = 'default';
  });

  toggleSwitch.addEventListener('mouseover', function() {
    toggleSwitch.style.background = 'darkgreen';
    toggleSwitch.style.accentColor = 'darkgreen';
    toggleSwitch.style.cursor = 'pointer';
  });

  toggleSwitch.addEventListener('mouseout', function() {
    toggleSwitch.style.background = 'green';
    toggleSwitch.style.accentColor = 'green';
    toggleSwitch.style.cursor = 'default';
  });

  toggleSwitch.addEventListener('change', function() {
  if (toggleSwitch.checked) {
    localStorage.setItem('autoSellEnabled', 'true');
    setInterval(autoSell, 1000);
  } else {
    localStorage.setItem('autoSellEnabled', 'false');
    clearInterval(autoSell);
  }
  });

  var autoSellEnabled = localStorage.getItem('autoSellEnabled');
  if (autoSellEnabled === 'true') {
    toggleSwitch.checked = true;
    setInterval(autoSell, 1000);
  } else {
    toggleSwitch.checked = false;
  }

  function confirmTasks() {
  var blueButtons = document.querySelectorAll('.task-card__button.task-card__button_stretch.btn.btn-blue');
  var borderedButtons = document.querySelectorAll('.task-card__button.task-card__button_stretch.btn.btn-bordered');
  let i = 0;

  function clickNextPair() {
    if (i < blueButtons.length) {
      blueButtons[i].click();
      setTimeout(function() {
        if (i < borderedButtons.length) {
          borderedButtons[i].click();
        }
        i++;
        setTimeout(clickNextPair, 2000);
      }, 2000);
    }
  }

  clickNextPair();
}

  function emulateClick() {
    var button = document.querySelector('.case-items-tape__open-button.btn.btn-blue.btn-lg');
    if (button) {
      button.click();
    }
  }

  function autoSell() {
    var button = document.querySelector('.case-available-item-buttons__sell-button.btn.btn-bordered');
    if (button) {
      button.click();
    }
  }

  function giveawayClick() {
    var button = document.querySelector('.get-reward-button.btn.btn-blue.btn-lg');
    if (button) {
      button.click();
    }
  }

  toggleSwitch.addEventListener('change', function() {
    if (toggleSwitch.checked) {
      setInterval(autoSell, 1000);
    } else {
      clearInterval(autoSell);
    }
  });

  setInterval(giveawayClick, 300);
  setInterval(emulateClick, 300);
})();
