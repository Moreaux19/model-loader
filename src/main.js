import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const uploadButton = document.querySelector('.upload-button');
const uploadInput = document.querySelector('.upload-input');

// Обработчик нажатия на кнопку
uploadButton.addEventListener('click', () => {
  uploadInput.click();
});

// Создаём сцену
const scene = new THREE.Scene();

// Создаём камеру и устанавливаем её позицию
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Создаём рендерер и устанавливаем его размер
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('.canvas')
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Добавляем освещение
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// Управление моделью
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Плавное движение
controls.dampingFactor = 0.05; // Уровень плавности
controls.maxPolarAngle = Math.PI / 2; // Ограничение вертикального наклона камеры(чтобы модель не ушла за рамки экрана)

// Функция для создания кнопки и загрузки GLB модели
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
        scene.add(gltf.scene);
      });
    };
    // Прочтение файла
    reader.readAsArrayBuffer(file);
  });
}

// Функция анимации
function renderModel() {
  // Отрисвка модели
  requestAnimationFrame(renderModel);

  // Обновляем управление камерой
  controls.update();
  // Загрузка модели
  renderer.render(scene, camera);
}
renderModel();

// Инициализируем загрузчик
window.onload = modelLoader;
