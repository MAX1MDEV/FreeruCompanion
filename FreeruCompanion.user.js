// ==UserScript==
// @name Freeru Companion
// @author MaximDev
// @namespace MAX1MDEV
// @version 9.0
// @homepage https://github.com/MAX1MDEV/FreeruCompanion
// @supportURL https://github.com/MAX1MDEV/FreeruCompanion/issues
// @updateURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/main/FreeruCompanion.user.js
// @downloadURL https://raw.githubusercontent.com/MAX1MDEV/FreeruCompanion/main/FreeruCompanion.user.js
// @description Auto confirm tasks, control tab opening, and handle promocodes
// @description:ru Автоматическое подтверждение заданий, контроль открытия вкладок и обработка промокодов
// @match *://freeru.me/games/cases*
// @match *://freeru.me/games/giveaways/games*
// @icon https://freeru.me/_nuxt/img/logo.8508f2a.png
// @grant none
// ==/UserScript==

(function() {
  'use strict';

  var preventTabOpening = false;
  var originalWindowOpen = window.open;
  var isConfirmingTasks = false;
  var isHandlingPromocode = false;
  let promocodeInterval;
  let noButtonsCount = 0;
  let passCount = 0;
  var isAutoMode = false;
  var autoInterval;
  var casesToClick = [
  'a[href^="/games/cases/diamondcase"]',
  'a[href^="/games/cases/richcase"]',
  'a[href^="/games/cases/animecase"]',
  'a[href^="/games/cases/amonguscase"]',
  'a[href^="/games/cases/globalcase"]',
  'a[href^="/games/cases/mysterycase"]',
  'a[href^="/games/cases/cs2case"]'
  ];
  var currentCaseIndex = 0;

  function toggleLinkBlocking(enable) {
      document.removeEventListener('click', blockLinks, true);
      if (enable) {
          document.addEventListener('click', blockLinks, true);
      } else {
          restoreLinks();
      }
  }

  function blockLinks(event) {
      let el = event.target.closest('a');
      if (preventTabOpening && el && el.target === '_blank') {
          event.preventDefault();
          let taskUrl = el.href;

          let iframe = document.createElement('iframe');
          iframe.src = taskUrl;
          iframe.style.width = '1px';
          iframe.style.height = '1px';
          iframe.style.position = 'absolute';
          iframe.style.left = '-9999px';

          document.body.appendChild(iframe);

          setTimeout(() => {
              iframe.remove();
              console.log('iframe удален, сайт "думает", что страница была открыта');
          }, 5000);
      }
  }

  function restoreLinks() {
      document.querySelectorAll('a[href="javascript:void(0)"]').forEach(el => {
          if (el.dataset.originalHref) {
              el.href = el.dataset.originalHref;
              if (el.dataset.originalTarget) {
                  el.setAttribute('target', el.dataset.originalTarget);
              }
              delete el.dataset.originalHref;
              delete el.dataset.originalTarget;
          }
      });
  }

  function observePageChanges() {
    const observer = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if (mutation.type === 'childList') {
          if (document.querySelector('.case-cards') || document.querySelector('.case-items-tape__open-button')) {
            observer.disconnect();
            if (isAutoMode) {
              setTimeout(clickNextCase, 1000);
            }
            break;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

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
  container.style.zIndex = '99999999';
  document.body.appendChild(container);


  var autoButton = document.createElement('button');
  autoButton.textContent = 'Авто';
  autoButton.style.background = 'green';
  autoButton.style.color = 'white';
  autoButton.style.border = 'none';
  autoButton.style.borderRadius = '5px';
  autoButton.style.userSelect = 'none';
  autoButton.style.padding = '10px 20px';
  container.appendChild(autoButton);

  var mainButton = document.createElement('button');
  mainButton.textContent = 'Подтвердить';
  mainButton.style.background = 'green';
  mainButton.style.color = 'white';
  mainButton.style.border = 'none';
  mainButton.style.borderRadius = '5px';
  mainButton.style.userSelect = 'none';
  mainButton.style.padding = '10px 20px';
  mainButton.style.marginTop = '5px';
  container.appendChild(mainButton);

  var promocodeButton = document.createElement('button');
  promocodeButton.textContent = 'Промокод';
  promocodeButton.style.background = 'green';
  promocodeButton.style.color = 'white';
  promocodeButton.style.border = 'none';
  promocodeButton.style.borderRadius = '5px';
  promocodeButton.style.userSelect = 'none';
  promocodeButton.style.padding = '10px 20px';
  promocodeButton.style.marginTop = '5px';
  container.appendChild(promocodeButton);

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
      autoButton.textContent = isAutoMode ? 'Остановить' : 'Авто';
      mainButton.textContent = isConfirmingTasks ? 'Остановить' : 'Подтвердить';
      promocodeButton.textContent = isHandlingPromocode ? 'Остановить' : 'Промокод';
      toggleLabel.textContent = 'Авто-продажа';
      preventTabLabel.textContent = 'Блокировать открытие вкладок';
    } else {
      langButton.textContent = 'EN';
      autoButton.textContent = isAutoMode ? 'Stop' : 'Auto';
      mainButton.textContent = isConfirmingTasks ? 'Stop' : 'Confirm';
      promocodeButton.textContent = isHandlingPromocode ? 'Stop' : 'Promocode';
      toggleLabel.textContent = 'Auto-sell';
      preventTabLabel.textContent = 'Block tabs from opening';
    }
  });

  autoButton.addEventListener('click', function() {
    if (isAutoMode) {
      stopAutoMode();
    } else {
      startAutoMode();
    }
  });

  mainButton.addEventListener('click', function() {
    if (isConfirmingTasks) {
      stopConfirmTasks();
    } else {
      startConfirmTasks();
    }
  });

  promocodeButton.addEventListener('click', function() {
    if (isHandlingPromocode) {
      stopHandlePromocode();
    } else {
      startHandlePromocode();
    }
  });

  autoButton.addEventListener('mouseover', function() {
    autoButton.style.background = isAutoMode ? '#FF8C00' : 'darkgreen';
    autoButton.style.cursor = 'pointer';
  });

  autoButton.addEventListener('mouseout', function() {
    autoButton.style.background = isAutoMode ? 'red' : 'green';
    autoButton.style.cursor = 'default';
  });
  mainButton.addEventListener('mouseover', function() {
    mainButton.style.background = isConfirmingTasks ? '#FF8C00' : 'darkgreen';
    mainButton.style.color = 'white';
    mainButton.style.cursor = 'pointer';
  });

  mainButton.addEventListener('mouseout', function() {
    mainButton.style.background = isConfirmingTasks ? 'red' : 'green';
    mainButton.style.color = 'white';
    mainButton.style.cursor = 'default';
  });

  promocodeButton.addEventListener('mouseover', function() {
    promocodeButton.style.background = isHandlingPromocode ? '#FF8C00' : 'darkgreen';
    promocodeButton.style.color = 'white';
    promocodeButton.style.cursor = 'pointer';
  });

  promocodeButton.addEventListener('mouseout', function() {
    promocodeButton.style.background = isHandlingPromocode ? 'red' : 'green';
    promocodeButton.style.color = 'white';
    promocodeButton.style.cursor = 'default';
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

   var storedPreventTabOpening = localStorage.getItem('preventTabOpening') === 'true';
   preventTabOpening = storedPreventTabOpening;
   preventTabSwitch.checked = storedPreventTabOpening;

   preventTabSwitch.addEventListener('change', function() {
       preventTabOpening = preventTabSwitch.checked;
       localStorage.setItem('preventTabOpening', preventTabOpening.toString());
       toggleLinkBlocking(preventTabOpening);
   });

   toggleLinkBlocking(preventTabOpening);

   var openedWindows = [];

  function startAutoMode() {
    isAutoMode = true;
    autoButton.textContent = 'Остановить';
    autoButton.style.background = 'red';
    currentCaseIndex = 0;
    clickNextCase();
    observePageChanges();
  }

  function stopAutoMode() {
    isAutoMode = false;
    autoButton.textContent = 'Авто';
    autoButton.style.background = 'green';
    clearTimeout(autoInterval);
  }

  function clickNextCase() {
  if (!isAutoMode) return;

  function findAndClickCase() {
      for (let i = 0; i < casesToClick.length; i++) {
        const caseLink = document.querySelector(casesToClick[i]);
        if (caseLink) {
          caseLink.click();
          currentCaseIndex = (i + 1) % casesToClick.length;
          setTimeout(handleCaseOpening, 2000);
          return true;
        }
      }
      return false;
    }
    if (!findAndClickCase()) {
      console.log("No more cases found, returning to main page");
      clickFreeCasesLink();
      currentCaseIndex = 0;
    }
  }
  function startConfirmTasks() {
    isConfirmingTasks = true;
    passCount = 0;
    mainButton.textContent = langButton.textContent === 'RU' ? 'Остановить' : 'Stop';
    mainButton.style.background = 'red';
    confirmTasks();
  }

  function stopConfirmTasks() {
    isConfirmingTasks = false;
    passCount = 0;
    mainButton.textContent = langButton.textContent === 'RU' ? 'Подтвердить' : 'Confirm';
    mainButton.style.background = 'green';
  }

  async function confirmTasks() {
    let clickCount = 0;
    const maxClicks = 5;
    const pauseDuration = 2000;

    async function clickButtons() {
      var blueButtons = document.querySelectorAll('.task-card__button.task-card__button_stretch.btn.btn-blue');
      var borderedButtons = document.querySelectorAll('.task-card__button.task-card__button_stretch.btn.btn-bordered');
      if (blueButtons.length === 0 && borderedButtons.length === 0) {
        return false;
      }
      for (let button of blueButtons) {
        button.click();
        if (!preventTabOpening) {
          var newWindow = window.open('', '_blank');
          if (newWindow) {
            openedWindows.push(newWindow);
          }
        }
      }
      for (let button of borderedButtons) {
        button.click();
      }
      return true;
    }

    async function continuousClick() {
      if (isConfirmingTasks) {
        const result = await clickButtons();
        if (result === true) {
          clickCount++;
          if (clickCount >= maxClicks) {
            await new Promise(resolve => setTimeout(resolve, pauseDuration));
            clickCount = 0;
          }
          setTimeout(continuousClick, 100);
        } else {
          passCount++;
          if (passCount >= 2) {
            stopConfirmTasks();
          } else {
            setTimeout(continuousClick, 100);
          }
        }
      }
    }
    continuousClick();
  }

  function startHandlePromocode() {
    isHandlingPromocode = true;
    promocodeButton.textContent = langButton.textContent === 'RU' ? 'Остановить' : 'Stop';
    promocodeButton.style.background = 'red';
    handlePromocode();
  }

  function stopHandlePromocode() {
    clearInterval(promocodeInterval);
    isHandlingPromocode = false;
    promocodeButton.textContent = langButton.textContent === 'RU' ? 'Промокод' : 'Promocode';
    promocodeButton.style.background = 'green';
  }

  async function handlePromocode() {
    try {
      await navigator.clipboard.readText();
    } catch (err) {
      alert('Для работы функции промокода необходим доступ к буферу обмена. Пожалуйста, предоставьте разрешение при появлении запроса.');
      stopHandlePromocode();
      return;
    }
    const labelElement = document.querySelector('.text-field__label');
    if (labelElement) {
      labelElement.click();
      if (promocodeInterval) {
        clearInterval(promocodeInterval);
      }
      function tryInsertPromocode() {
        const promocodeElement = document.querySelector('.promocode-box__promocode');
        const inputElement = Array.from(document.querySelectorAll('.text-field__input'))
                                   .find(el => el.getAttribute('placeholder') === '');
        if (promocodeElement && inputElement) {
          const promocodeText = promocodeElement.textContent.trim();
          if (promocodeText && !promocodeText.includes('*')) {
            navigator.clipboard.writeText(promocodeText).then(() => {
              inputElement.focus();
              document.execCommand('insertText', false, promocodeText);
              const inputEvent = new Event('input', { bubbles: true, cancelable: true });
              inputElement.dispatchEvent(inputEvent);
              const submitButton = document.querySelector('.promo-code-form__button.btn.btn-blue.btn-lg');
              if (submitButton) {
                setTimeout(() => {
                  submitButton.click();
                  submitButton.click();
                  submitButton.click();
                  submitButton.click();
                  submitButton.click();
                }, 500);
                stopHandlePromocode();
              } else {
                console.log('Кнопка отправки промокода не найдена');
              }
            }).catch(err => {
              console.error('Не удалось скопировать промокод в буфер обмена:', err);
              stopHandlePromocode();
            });
          } else if (promocodeText.includes('*')) {
            console.log('Промокод все еще содержит "*" и не может быть вставлен');
          } else {
            console.log('Промокод не найден в элементе promocode-box__promocode');
          }
        } else {
          console.log('Не удалось найти элемент промокода или поле ввода с пустым placeholder');
        }
      }
      tryInsertPromocode();
      promocodeInterval = setInterval(tryInsertPromocode, 400);
    } else {
      stopHandlePromocode();
    }
  }

  function closeOpenedWindows() {
    openedWindows = openedWindows.filter(window => {
      if (!window.closed) {
        window.close();
        return false;
      }
      return true;
    });
  }

  setInterval(closeOpenedWindows, 300);

  function emulateClick() {
    var button = document.querySelector('.case-items-tape__open-button.btn.btn-blue.btn-lg');
    if (button) {
      button.click();
    }
  }

  function autoSell() {
    if (isAutoMode) return;
    var button = document.querySelector('.case-available-item-buttons__sell-button.btn.btn-bordered');
    if (button) {
      button.click();
      if (window.location.href === 'https://freeru.me/games/cases/promocodecase') {
        if (!isConfirmingTasks && toggleSwitch.checked) {
          startConfirmTasks();
        }
      }
      //setTimeout(clickFreeCasesLink, 1000);
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

  function handleCaseOpening() {
    const openButton = document.querySelector('.case-items-tape__open-button.btn.btn-blue.btn-lg');
    if (openButton) {
      openButton.click();
      setTimeout(() => {
        const sellButton = document.querySelector('.case-available-item-buttons__sell-button.btn.btn-bordered');
        if (sellButton) {
          sellButton.click();
          setTimeout(clickFreeCasesLink, 1000);
        } else {
          clickFreeCasesLink();
        }
      }, 2000);
    } else {
      console.log("Case opening button not found, returning to main page");
      clickFreeCasesLink();
    }
  }

  function clickFreeCasesLink() {
    const freeCasesLink = document.querySelector('li[data-v-939007d8].breadcrumb__item a[href="/games/cases"]');
    if (freeCasesLink) {
      freeCasesLink.click();
      setTimeout(observePageChanges, 1000);
    } else {
      console.log("Free cases link not found");
      if (isAutoMode) {
        setTimeout(clickNextCase, 1000);
      }
    }
  }

  //function textOnPageCheck() {
  //  const observer = new MutationObserver(() => {
  //    if (document.body.innerText.includes("Повторно")) {
  //      const freeCasesLink = document.querySelector('li.breadcrumb__item a[href="/games/cases"]');
  //      if (freeCasesLink) {
  //        freeCasesLink.click();
  //      }
  //    }
  //  });
  //  observer.observe(document.body, {
  //    childList: true,
  //    subtree: true,
  //    characterData: true
  //  });
  //}

  setInterval(giveawayClick, 300);
  setInterval(emulateClick, 300);
  //textOnPageCheck();
  observePageChanges();
})();
