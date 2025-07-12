// ===== 1-timer.js =====
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  startBtn: document.querySelector('[data-start]'),
  dateInput: document.querySelector('#datetime-picker'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate = null;
let timerId = null;

// Початковий стан — кнопка Start неактивна
refs.startBtn.disabled = true;

// Налаштування flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selected = selectedDates[0];

    if (selected <= new Date()) {
      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      refs.startBtn.disabled = true;
      userSelectedDate = null; // скидаю дату
    } else {
      userSelectedDate = selected;
      refs.startBtn.disabled = false;
    }
  },
};

// Ініціалізація календаря
flatpickr(refs.dateInput, options);

// Обробка кліку на Start
refs.startBtn.addEventListener('click', onStart);

function onStart() {
  if (!userSelectedDate) return;

  refs.startBtn.disabled = true;
  refs.dateInput.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      refs.dateInput.disabled = false;
      refs.startBtn.disabled = true;
      return;
    }

    const timeLeft = convertMs(diff);
    updateTimerUI(timeLeft);
  }, 1000);
}

// Оновлення інтерфейсу таймера
function updateTimerUI({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

// Функція обчислення днів/годин/хв/сек із мс
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для форматування чисел з провідним нулем
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
