export function initCustomInputDate() {

  const calendarContainer = document.querySelectorAll("[input-date]");

  if (calendarContainer.length === 0) return;

  calendarContainer.forEach(calendarElement => {
    // Элементы DOM для управления календарём
    const monthElem = calendarElement.querySelector("[input-date-month]");
    const yearElem = calendarElement.querySelector("[input-date-year]");
    const daysContainer = calendarElement.querySelector('.container-days');
    const prevBtn = calendarElement.querySelector('.prev-month');
    const nextBtn = calendarElement.querySelector('.next-month');
    const inputDate = calendarElement.querySelector('input[type="date"]');
    const value = calendarElement.querySelector('[input-date-value]');
    const wrap = calendarElement.querySelector('[input-date-wrap]');
    const yearDropdown = calendarElement.querySelector('[input-date-year-dropdown]');

    // Названия месяцев
    const monthNames = [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    // Текущая дата для выделения сегодняшнего дня
    const today = new Date();

    // Состояние: текущий отображаемый год и месяц (0-11)
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let currentDay = today.getDate();

    const startYear = currentYear - 50;
    const endYear = currentYear + 10;

    if (inputDate.value !== '') {
      const [year, month, day] = inputDate.value.split('-');
      currentDay = Number(day);
      currentMonth = Number(month) - 1;
      currentYear = Number(year);
    } 

    // Функция обновляет заголовок с месяцем и годом
    function renderHeader(year, month) {
      monthElem.textContent = monthNames[month];
      yearElem.textContent = year;
    }

    function renderYearDropdown() {
      for (let year = startYear; year <= endYear; year++) {
        const yearDiv = document.createElement('div');
        yearDiv.className = 'year-item';
        yearDiv.textContent = year;
        yearDiv.setAttribute('role', 'listitem');
        yearDiv.addEventListener('click', ev => clickYear(ev));
        yearDropdown.appendChild(yearDiv);
      }
    }

    // Получить количество дней в указанном месяце и году
    function getDaysInMonth(year, month) {
      // Передаём 0 в день — получаем последний день предыдущего месяца
      return new Date(year, month + 1, 0).getDate();
    }

    // Определить первый день недели в виде индекса (понедельник = 0)
    function getStartDay(year, month) {
      let startDay = new Date(year, month, 1).getDay(); // 0 (воск) - 6 (суб)
      return (startDay === 0) ? 6 : startDay - 1;
    }

    function clickYear(ev) {
      currentYear = Number(ev.target.textContent);
      updateDate(currentDay, currentMonth, currentYear);
      renderCalendar(currentYear, currentMonth);
      yearDropdown.classList.remove('show')
    }

    // Обработчик клика по дню календаря
    function clickDay(year, month, day) {
      updateDate(day, month, year);
      currentDay = day;
    }

    // Функция отображает дни месяца, включая пустые ячейки для выравнивания
    function renderDays(year, month) {
      daysContainer.innerHTML = '';
      const daysInMonth = getDaysInMonth(year, month);
      const startDay = getStartDay(year, month);

      // Добавляем пустые ячейки перед первым числом месяца
      for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day', 'empty');
        daysContainer.appendChild(emptyCell);
      }

      // Добавляем числа дней месяца с обработчиком клика
      for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.textContent = day;

        // Подсвечиваем сегодня, если совпадает дата
        if (
          year === currentYear &&
          month === currentMonth &&
          day === currentDay
        ) {
          dayCell.classList.add('today');
          dayCell.classList.add('selected');
          dayCell.setAttribute('aria-current', 'date');
          updateDate(day, month, year);
        }



        // Для доступности указываем роль и tabindex
        dayCell.setAttribute('role', 'gridcell');
        dayCell.setAttribute('tabindex', '-1');

        // Вешаем обработчик клика по дню
        dayCell.addEventListener('click', () => {
          calendarElement.querySelector('.day.selected') && calendarElement.querySelector('.day.selected').classList.remove('selected');
          dayCell.classList.add('selected');

          clickDay(year, month, day);
        });

        daysContainer.appendChild(dayCell);
      }
    }

    // Функция обновляет дату в поле ввода
    function updateDate(newDay, newMonth, newYear) {
      const dayStr = newDay.toString().padStart(2, '0');
      const monthStr = (newMonth + 1).toString().padStart(2, '0');
      inputDate.value = `${newYear}-${monthStr}-${dayStr}`;
      value.textContent = `${dayStr}.${monthStr}.${newYear}`;
    }

    // Общая функция отрисовки календаря
    function renderCalendar(year, month) {
      renderHeader(year, month);
      renderDays(year, month);
      renderYearDropdown();
    }

    // Обработчики кликов по кнопкам переключения месяца
    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar(currentYear, currentMonth);
    });

    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentYear, currentMonth);
    });

    // Обработчик клика по календарю
    wrap.addEventListener('click', () => {
      calendarElement.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!calendarElement.contains(e.target)) {
        calendarElement.classList.remove('show');
      }
    });

    yearElem.addEventListener('click', () => {
      yearDropdown.classList.toggle('show');
    });

    // Отрисовать календарь при загрузке страницы
    renderCalendar(currentYear, currentMonth);
  })


}