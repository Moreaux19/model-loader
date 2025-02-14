import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { toggleDropdown } from './dropdown.js';

// Переменные с HTML элементами
const uploadButton = document.querySelector('.upload-button');
const uploadInput = document.querySelector('.upload-input');
const modalWindow = document.querySelector('.modal-window');
const modalWindowClose = document.querySelector('.modal-window-close');
const changeColorButton = document.querySelector('.change-color-button');

// Переменная для хранения модели
let model;

// Создаём рендерер
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('.canvas')
});
// Создаём сцену
const scene = new THREE.Scene();
// Создаём камеру
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Создаём освещение
const light = new THREE.AmbientLight(0xffffff);
// Создаём управление моделью
const controls = new OrbitControls(camera, renderer.domElement);
// Создаём луч, отслеживающий направление от камеры до мыши
const raycaster = new THREE.Raycaster();
// Создаём вектор, хранящий координаты мыши
const mouse = new THREE.Vector2();

// Устанавливаем позицию камеры
camera.position.z = 5;

//Устанавливаем размер рендера
renderer.setSize(window.innerWidth, window.innerHeight);
// Устанавливаем белый цвет фона
renderer.setClearColor(0xffffff);

// Устанавливаем плавность движения модели
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Добавляем освещение в сцену
scene.add(light);

// Функция загрузки модели
function modelLoader() {
  // Обработчик выбора файла
  uploadInput.addEventListener('change', event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    // Запускаем асинхронный обработчик, который сработает после прочтения файла модели
    reader.onload = function (e) {
      // Получаем данные файла в виде массива байтов
      const arrayBuffer = e.target.result;
      // Загружаем(парсим из массива байтов в 3D) модель и добавляем в сцену
      const loader = new GLTFLoader();
      loader.parse(arrayBuffer, '', gltf => {
        model = gltf.scene;
        scene.add(model);
        //Обходим все дочерние элементы модели
        model.traverse(child => {
          // Вешаем на каждый дочерний элемент обработчик
          child.onClick = handleModelClick;
        });
      });
    };
    // Прочтение файла
    reader.readAsArrayBuffer(file);
  });
}

// Функция рендера и управления моделью
function renderModel() {
  // Отрисовка модели
  requestAnimationFrame(renderModel);

  // Обновляем управление камерой
  controls.update();

  // Загрузка модели
  renderer.render(scene, camera);
}

// Функция открытия модального окна
const openModal = () => {
  modalWindow.style.display = 'flex';
};

// Функция закрытия модального окна
const closeModal = () => {
  modalWindow.style.display = 'none';
};

// Функция обработки клика на модель
const handleModelClick = () => {
  openModal();
};

// Функция изменения цвета модели
const changeColor = () => {
  // Проверяем загружена ли модель
  if (model) {
    model.traverse(child => {
      if (child.isMesh && child.material) {
        const color = child.material.color.getHexString();
        // Меняем цвет
        if (color === '89c4ff') {
          child.material.color.set(0x0000ff);
          closeModal();
        } else if (color === '0000ff') {
          child.material.color.set(0x89c4ff);
          closeModal();
        }
      }
    });
  }
};

// Слушатель нажатия на кнопку загрузки файла
uploadButton.addEventListener('click', () => {
  uploadInput.click();
});

// Слушатель упревления модели мышью
window.addEventListener('mousedown', event => {
  // Нормализуем координаты мыши для луча
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Устанавливаем лучу координаты клика и изначальную позицию(камеру)
  raycaster.setFromCamera(mouse, camera);

  // Создаём массив пересечений луча с моделью(включая дочерние объекты)
  const intersections = raycaster.intersectObjects(scene.children, true);
  // Проверяем было ли пересечение луча с моделью и открываем модальное окно
  if (intersections.length > 0) {
    handleModelClick();
  }
});

// Обработчик закрытия модального окна
modalWindowClose.addEventListener('click', closeModal);

// Слушатель изменения цвета
changeColorButton.addEventListener('click', changeColor);

document.querySelectorAll('.dropdown-button').forEach(button => {
  button.addEventListener('click', function () {
    toggleDropdown(this);
  });
});

modelLoader();
renderModel();
