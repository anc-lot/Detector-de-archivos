const fileInput = document.getElementById('file-input');
const scanButton = document.getElementById('scan-btn');
const messageElement = document.getElementById('message');
const fileNameElement = document.getElementById('file-name');
const fileExtensionElement = document.getElementById('file-extension');
const fileHashElement = document.getElementById('file-hash');
const loader = document.getElementById('loader');

// Lista de hashes maliciosos (ejemplo)
const maliciousHashes = [
  'd2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2',
  'c3ba40f7e84e647a8155142523329a87bbdecb4d31959af99e12867e70332c42'
];

// Lista de extensiones maliciosas (ejemplo)
const maliciousExtensions = ['exe', 'bat', 'js', 'vbs', 'scr'];

scanButton.addEventListener('click', function () {
  const file = fileInput.files[0];
  if (!file) {
    messageElement.textContent = "Por favor, selecciona un archivo para escanear.";
    return;
  }

  loader.style.display = 'block'; // Mostrar loader

  fileNameElement.textContent = file.name;
  const fileExtension = file.name.split('.').pop();
  fileExtensionElement.textContent = fileExtension;

  if (maliciousExtensions.includes(fileExtension.toLowerCase())) {
    messageElement.textContent = "¡Cuidado! Este archivo podría ser malicioso por su extensión.";
    messageElement.style.color = "red";
    loader.style.display = 'none'; // Ocultar loader
    return;
  }

  const reader = new FileReader();
  reader.onload = async function () {
    const hash = await sha256(reader.result);
    fileHashElement.textContent = hash;

    if (maliciousHashes.includes(hash)) {
      messageElement.textContent = "¡Cuidado! Este archivo es malicioso por su hash.";
      messageElement.style.color = "red";
    } else {
      messageElement.textContent = "El archivo parece seguro.";
      messageElement.style.color = "green";
    }

    loader.style.display = 'none'; // Ocultar loader
  };
  reader.onerror = function () {
    messageElement.textContent = "Error al leer el archivo.";
    loader.style.display = 'none'; // Ocultar loader
  };
  reader.readAsArrayBuffer(file);
});

async function sha256(buffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Configuración de partículas
particlesJS('particles-js', {
  particles: {
    number: { value: 80 },
    color: { value: "#00ffcc" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: { enable: true, color: "#00ffcc" },
    move: { enable: true, speed: 2 }
  }
});