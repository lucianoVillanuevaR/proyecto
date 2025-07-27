🚀 Proyecto Semestral – Metodología del Desarrollo IECI 2025-1
Bienvenido al repositorio del backend de la plantilla base para el proyecto semestral de Metodología del Desarrollo. Este proyecto está construido con Node.js, Express y PostgreSQL.

🛠️ Sigue esta guía paso a paso para clonar, configurar y ejecutar el servidor localmente.

📦 Requisitos Previos
Antes de comenzar, asegúrate de tener instalado en tu sistema:

✅ Node.js (versión 22.x.x LTS)

✅ PostgreSQL (versión 16.x.x)

✅ Git

⚙️ Instalación y Ejecución
1️⃣ Clona el repositorio
bash
Copiar
Editar
git clone https://github.com/HunterUrisus/Backend-Plantilla-MDD-2025-1
cd Backend-Plantilla-MDD-2025-1/
2️⃣ Accede a la carpeta del backend e instala las dependencias
bash
Copiar
Editar
cd backend/
npm install
3️⃣ Configura las variables de entorno
Renombra el archivo .env.example a .env:

bash
Copiar
Editar
mv .env.example .env
Luego edita el archivo .env y completa con tus datos:

env
Copiar
Editar
PORT=3000
HOST=localhost
DB_USERNAME=TU_USUARIO_POSTGRES
PASSWORD=TU_CONTRASEÑA_POSTGRES
DATABASE=NOMBRE_BASE_DATOS
SESSION_SECRET=CODIGO_ULTRA_SECRETO_DE_JWT
4️⃣ Configura PostgreSQL
Asegúrate de tener creada la base de datos con el nombre, usuario y contraseña que configuraste en el archivo .env.

5️⃣ Inicia el servidor
bash
Copiar
Editar
npm start
El backend estará corriendo en:
👉 http://localhost:3000

