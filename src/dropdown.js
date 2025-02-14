export function toggleDropdown(button) {
  // Находим ближайший ul внутри контейнера
  const dropdownMenu = button.nextElementSibling;

  // Переключаем видимость списка
  if (dropdownMenu.style.display === 'block') {
    dropdownMenu.style.display = 'none';
  } else {
    dropdownMenu.style.display = 'block';
  }
}
