// ==UserScript==
// @name Freeru Companion
// @author MaximDev
// @namespace MAX1MDEV
// @version 6.6
// @homepage https://github.com/MAX1MDEV/FreeruCompanion
// @supportURL https://github.com/MAX1MDEV/FreeruCompanion/issues
// @updateURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/main/FreeruCompanion.user.js
// @downloadURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/main/FreeruCompanion.user.js
// @description Auto confirm tasks and control tab opening
// @description:ru Автоматическое подтверждение заданий и контроль открытия вкладок
// @match ://freeru.lol/games/cases*
// @match ://freeru.lol/games/giveaways/games*
// @icon https://freeru.lol/_nuxt/img/logo.8508f2a.png
// @grant none
// ==/UserScript==

(function() {
  'use strict';

  var preventTabOpening = false;
  var originalWindowOpen = window.open;

  function updateWindowOpen() {
    window.open = preventTabOpening ? function() { return null; } : originalWindowOpen;
  }

  updateWindowOpen();

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

  var preventTabContainer = document.createElement('div');
  preventTabContainer.style.display = 'flex';
  preventTabContainer.style.alignItems = 'center';
  preventTabContainer.style.marginTop = '5px';
  container.appendChild(preventTabContainer);

  var preventTabLabel = document.createElement('span');
  preventTabLabel.textContent = 'Блокировать открытие вкладок';
  preventTabLabel.style.color = 'white';
  preventTabLabel.style.border = 'none';
  preventTabLabel.style.background = 'green';
  preventTabLabel.style.padding = '10px 20px';
  preventTabLabel.style.borderRadius = '5px';
  preventTabLabel.style.marginRight = '5px';
  preventTabLabel.style.userSelect = 'none';
  preventTabContainer.appendChild(preventTabLabel);

  var preventTabSwitch = document.createElement('input');
  preventTabSwitch.type = 'checkbox';
  preventTabSwitch.id = 'prevent-tab-toggle';
  preventTabSwitch.style.width = '31px';
  preventTabSwitch.style.height = '31px';
  preventTabSwitch.style.background = 'green';
  preventTabSwitch.style.accentColor = 'green';
  preventTabSwitch.style.borderRadius = '5px';
  preventTabContainer.appendChild(preventTabSwitch);

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
      preventTabLabel.textContent = 'Блокировать открытие вкладок';
    } else {
      langButton.textContent = 'EN';
      mainButton.textContent = 'Confirm';
      toggleLabel.textContent = 'Auto-sell';
      preventTabLabel.textContent = 'Block tabs from opening';
    }
  });

  // Add hover effects to mainButton
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

  // Add hover effects to langButton
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

  // Add hover effects to toggleSwitch
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

  // Add hover effects to preventTabSwitch
  preventTabSwitch.addEventListener('mouseover', function() {
    preventTabSwitch.style.background = 'darkgreen';
    preventTabSwitch.style.accentColor = 'darkgreen';
    preventTabSwitch.style.cursor = 'pointer';
  });

  preventTabSwitch.addEventListener('mouseout', function() {
    preventTabSwitch.style.background = 'green';
    preventTabSwitch.style.accentColor = 'green';
    preventTabSwitch.style.cursor = 'default';
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

  preventTabSwitch.addEventListener('change', function() {
    preventTabOpening = preventTabSwitch.checked;
    localStorage.setItem('preventTabOpening', preventTabOpening.toString());
    updateWindowOpen();
  });

  var storedPreventTabOpening = localStorage.getItem('preventTabOpening');
  if (storedPreventTabOpening === 'true') {
    preventTabSwitch.checked = true;
    preventTabOpening = true;
  } else {
    preventTabSwitch.checked = false;
    preventTabOpening = false;
  }
  updateWindowOpen();

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
