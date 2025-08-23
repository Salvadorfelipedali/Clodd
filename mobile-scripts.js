/**
 * Мобильные исправления для сайта Clodd
 * ВАЖНО: НЕ ЛОМАТЬ существующие элементы - айфон, логотипы, анимации диалогов
 */

(function() {
  'use strict';

  // Проверяем, что мы на мобильном устройстве
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Исправление: Блокировка скролла основного сайта при открытом модальном окне
  function initModalScrollFix() {
    if (!isMobile()) return;

    // Функция для блокировки скролла
    function disableScroll() {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }

    // Функция для разблокировки скролла
    function enableScroll() {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    // Отслеживаем открытие модальных окон
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Проверяем, не модальное ли это окно
            if (node.classList && (node.classList.contains('modal-overlay') || 
                node.classList.contains('fixed') && node.classList.contains('inset-0'))) {
              disableScroll();
            }
          }
        });
        
        mutation.removedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Проверяем, не модальное ли это окно
            if (node.classList && (node.classList.contains('modal-overlay') || 
                node.classList.contains('fixed') && node.classList.contains('inset-0'))) {
              enableScroll();
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Также отслеживаем клики по кнопкам закрытия
    document.addEventListener('click', function(event) {
      // Если кликнули по backdrop модального окна или кнопке закрытия
      if (event.target.classList.contains('modal-overlay') || 
          event.target.closest('[data-action="close-modal"]') ||
          event.target.closest('.modal-close')) {
        enableScroll();
      }
    });

    // Обработка ESC для закрытия модальных окон
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        enableScroll();
      }
    });
  }

  // Исправление: Динамическая фиксация высоты блока проблем
  function initProblemsHeightFix() {
    if (!isMobile()) return;

    const problemsSection = document.querySelector('[data-section="problems"]') || 
                          document.querySelector('.problems-section') ||
                          document.querySelector('.problems-container');
    
    if (problemsSection) {
      // Вычисляем максимальную высоту карточек
      function calculateMaxHeight() {
        const cards = problemsSection.querySelectorAll('.problem-card, .bg-white');
        let maxHeight = 500; // минимальная высота
        
        cards.forEach(card => {
          const cardHeight = card.offsetHeight;
          if (cardHeight > maxHeight) {
            maxHeight = cardHeight;
          }
        });
        
        problemsSection.style.minHeight = maxHeight + 100 + 'px';
      }
      
      // Устанавливаем высоту после загрузки
      setTimeout(calculateMaxHeight, 100);
      
      // Пересчитываем при изменении размера окна
      window.addEventListener('resize', function() {
        if (isMobile()) {
          calculateMaxHeight();
        }
      });
    }
  }

  // Исправление: Центрирование иконки автоматизации
  function initAutomationIconCenter() {
    if (!isMobile()) return;

    const automationSections = document.querySelectorAll('.automation-ready, [data-section="automation"], .automation-block');
    
    automationSections.forEach(section => {
      const icons = section.querySelectorAll('.icon, .w-16, .h-16');
      icons.forEach(icon => {
        // Добавляем центрирование
        icon.style.margin = '0 auto';
        icon.style.display = 'block';
        
        // Центрируем родительский контейнер
        const parent = icon.parentElement;
        if (parent) {
          parent.style.textAlign = 'center';
          parent.style.justifyContent = 'center';
          parent.style.alignItems = 'center';
        }
      });
    });
  }

  // Общие оптимизации для мобильной версии
  function initGeneralMobileOptimizations() {
    if (!isMobile()) return;

    // Оптимизация касаний
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });
    
    // Предотвращаем случайный зум при двойном тапе
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
    
    // Оптимизация viewport для мобильных
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }

  // Функция для безопасной инициализации после загрузки DOM
  function initMobileFixes() {
    try {
      initModalScrollFix();
      initProblemsHeightFix();
      initAutomationIconCenter();
      initGeneralMobileOptimizations();
      
      console.log('Мобильные исправления Clodd успешно инициализированы (без свайпа)');
    } catch (error) {
      console.warn('Ошибка при инициализации мобильных исправлений:', error);
    }
  }

  // Инициализация после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileFixes);
  } else {
    initMobileFixes();
  }

  // Пересчет при изменении ориентации
  window.addEventListener('orientationchange', function() {
    setTimeout(function() {
      if (isMobile()) {
        initMobileFixes();
      }
    }, 100);
  });

})();

/**
 * ВАЖНЫЕ ЗАМЕЧАНИЯ:
 * 
 * 1. НЕ ЛОМАЕМ айфон и анимации диалогов - они остаются без изменений
 * 2. Все исправления применяются только на мобильных устройствах (max-width: 768px)
 * 3. Десктопная версия остается нетронутой
 * 4. Код написан безопасно с обработкой ошибок
 * 5. Используется passive listeners для оптимизации производительности
 * 6. УБРАНА вся логика свайпа и индикаторов - сайт работает в штатном режиме
 */