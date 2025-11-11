# 💳 PicoBanco - Sistema Bancario Vulnerable

> **⚠️ ADVERTENCIA:** Esta aplicación contiene vulnerabilidades de seguridad **INTENCIONALES** con fines educativos. **NUNCA** usar este código en producción o ambientes reales.

**Universidad Técnica Nacional**  
**ITI-922 - Seguridad de TI II**  
**Proyecto 1 - Sistema con Vulnerabilidades OWASP Top 10**  
**Jairo Rodriguez y Jefry Morera**

---

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
3. [Arquitectura General](#-arquitectura-general)
4. [Requisitos Previos](#-requisitos-previos)
5. [Instrucciones de Instalación](#-instrucciones-de-instalación)
6. [Configuración de Base de Datos](#-configuración-de-base-de-datos)
7. [Credenciales por Defecto](#-credenciales-por-defecto)
8. [Catálogo de Vulnerabilidades](#-catálogo-de-vulnerabilidades)
9. [Contribuciones del Equipo](#-contribuciones-del-equipo)
10. [Referencias](#-referencias)

---

## 🎯 Descripción del Proyecto

### Propósito de la Aplicación

**PicoBanco** es un sistema bancario web educativo diseñado específicamente para demostrar y estudiar vulnerabilidades de seguridad en aplicaciones web modernas. El sistema simula las operaciones básicas de un banco digital, permitiendo a los usuarios realizar transacciones financieras, gestionar ahorros y pagar servicios.

### Funcionalidades Principales

El sistema incluye las siguientes características:

#### 🔐 Autenticación y Gestión de Usuarios
- Registro de nuevos usuarios con email y contraseña
- Inicio de sesión con generación de tokens JWT
- Gestión de perfil personal (nombre, email, contraseña)
- Cierre de sesión

#### 💸 Transferencias Bancarias
- Transferencias entre cuentas usando número de cuenta
- Validación de balance antes de transferir
- Descripción personalizada para cada transacción
- Historial completo de transacciones realizadas y recibidas

#### 💰 Sistema de Ahorro Virtual
- Creación de "sobres de ahorro" con nombre y meta
- Depósitos desde cuenta principal a sobres
- Retiros de sobres a cuenta principal
- Seguimiento de progreso hacia metas de ahorro
- Historial de movimientos por sobre

#### 💳 Pago de Servicios
- Pago de servicios públicos (electricidad, agua, internet, teléfono)
- Registro de información del servicio y proveedor
- Historial de pagos realizados
- Referencias de pago

#### 📊 Dashboard y Reportes
- Resumen de balance actual
- Estadísticas de transacciones
- Vista de sobres de ahorro activos
- Historial completo de actividad financiera

### Objetivos Educativos

Este proyecto tiene como objetivos:

1. **Comprender** las vulnerabilidades más críticas del OWASP Top 10 2021
2. **Implementar intencionalmente** fallos de seguridad en un entorno controlado
3. **Demostrar** cómo se explotan estas vulnerabilidades
4. **Aprender** las mejores prácticas para prevenir estos ataques en aplicaciones reales

### Alcance del Sistema

PicoBanco implementa **9 de las 10 vulnerabilidades** del OWASP Top 10 2021:

- **Backend:** Node.js/Express con 18 archivos vulnerables
- **Frontend:** React con 9 archivos vulnerables
- **Base de Datos:** PostgreSQL con 6 tablas
- **Total:** 27 archivos con vulnerabilidades documentadas en comentarios

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Runtime:** Node.js v18.x o superior
- **Framework:** Express.js v4.18.x
- **Base de Datos:** PostgreSQL v14.x o superior
- **Cliente PostgreSQL:** pg (node-postgres) v8.11.x
- **Autenticación:** JWT (jsonwebtoken) v9.0.x
- **Hashing:** bcryptjs v2.4.x (implementación segura) + MD5 (implementación vulnerable intencional)
- **CORS:** cors v2.8.x
- **Variables de entorno:** dotenv v16.x

### Frontend
- **Framework:** React v18.x
- **Routing:** React Router DOM v6.x
- **HTTP Client:** Axios v1.6.x
- **Estilos:** Tailwind CSS v3.x + CSS personalizado
- **Build Tool:** Vite v5.x

### Base de Datos
- **DBMS:** PostgreSQL 14.x
- **Tablas:** 
  - `users` - Información de usuarios y credenciales
  - `accounts` - Cuentas bancarias con balance
  - `transactions` - Historial de transferencias
  - `savings_envelopes` - Sobres de ahorro virtuales
  - `savings_movements` - Movimientos en sobres
  - `service_payments` - Pagos de servicios

### Control de Versiones
- **Git** con repositorio en GitHub/GitLab (privado)

---

## 🏗️ Arquitectura General

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Navegador Web)                   │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │   Login    │  │ Dashboard  │  │   Perfil   │           │
│  │  Register  │  │  Ahorros   │  │ Servicios  │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└───────────────────────┬──────────────────────────────────────┘
                        │
                        │ HTTP/HTTPS (REST API)
                        │ JSON
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Node.js/Express)                  │
│                         Puerto: 4000                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    RUTAS (Routes)                     │   │
│  │  /api/auth  /api/users  /api/transactions  /api/...  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │              MIDDLEWARE (Auth, CORS)                  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │              CONTROLADORES (Controllers)              │   │
│  │  AuthController, UserController, etc.                │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │                 MODELOS (Models)                      │   │
│  │  UserModel, TransactionModel, etc.                   │   │
│  └────────────────────┬─────────────────────────────────┘   │
└───────────────────────┼──────────────────────────────────────┘
                        │
                        │ SQL Queries (pg Pool)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│               BASE DE DATOS (PostgreSQL)                     │
│                      Puerto: 5432                            │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐               │
│  │  users   │ │ accounts │ │ transactions │               │
│  └──────────┘ └──────────┘ └──────────────┘               │
│  ┌──────────────────┐ ┌─────────────────────┐             │
│  │ savings_envelopes│ │  service_payments   │             │
│  └──────────────────┘ └─────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos Típico

#### Autenticación
```
1. Usuario ingresa email y password en frontend
2. POST /api/auth/login → Backend
3. Backend hashea password y compara con BD
4. Backend genera JWT token
5. Frontend almacena token en localStorage
6. Subsecuentes requests incluyen token en header Authorization
```

#### Transferencia Bancaria
```
1. Usuario completa formulario de transferencia
2. POST /api/transactions con datos
3. Backend verifica autenticación (JWT)
4. Valida que cuentas existan
5. Verifica balance suficiente
6. Inicia transacción SQL
7. Actualiza balances de ambas cuentas
8. Registra transacción en historial
9. Commit o Rollback según resultado
10. Retorna respuesta al frontend
```

---

## 📦 Requisitos Previos

### Software Necesario

#### Obligatorio
- **Node.js:** v18.17.0 o superior ([descargar](https://nodejs.org/))
- **npm:** v9.6.0 o superior (incluido con Node.js)
- **PostgreSQL:** v14.0 o superior ([descargar](https://www.postgresql.org/download/))
- **Git:** v2.40.0 o superior ([descargar](https://git-scm.com/))

#### Opcional pero Recomendado
- **pgAdmin 4:** Para administrar la base de datos visualmente
- **Postman:** Para probar la API REST
- **VS Code:** Editor con extensiones ESLint, Prettier, PostgreSQL

### Verificar Instalación

```bash
# Verificar Node.js
node --version
# Debe mostrar: v18.x.x o superior

# Verificar npm
npm --version
# Debe mostrar: 9.x.x o superior

# Verificar PostgreSQL
psql --version
# Debe mostrar: psql (PostgreSQL) 14.x o superior

# Verificar Git
git --version
# Debe mostrar: git version 2.x.x o superior
```

### Sistemas Operativos Soportados

✅ **Windows 10/11** (x64)  
✅ **Linux** (Ubuntu 20.04+, Debian 11+, Fedora 36+)  
✅ **macOS** (Monterey 12+ en Intel y Apple Silicon)

---

## 🚀 Instrucciones de Instalación

### 1. Clonar el Repositorio

```bash
# Clonar desde GitHub/GitLab
git clone https://github.com/tu-usuario/picobanco.git
cd picobanco
```

### 2. Estructura del Proyecto

```
picobanco/
├── backend/                # Servidor Node.js/Express
│   ├── src/
│   │   ├── config/        # db.js (conexión PostgreSQL)
│   │   ├── controllers/   # Lógica de negocio (5 archivos)
│   │   ├── middleware/    # auth.middleware.js
│   │   ├── models/        # Modelos de datos (4 archivos)
│   │   ├── routes/        # Rutas de API (5 archivos)
│   │   ├── utils/         # crypto.util.js
│   │   └── index.js       # Punto de entrada
│   ├── package.json
│   └── .env.example
│
├── frontend/              # Cliente React
│   ├── src/
│   │   ├── components/    # Header, TransactionCard
│   │   ├── pages/         # 9 páginas (Login, Home, etc.)
│   │   ├── services/      # auth, transaction, user services
│   │   ├── hooks/         # useApi.js
│   │   └── app.jsx
│   ├── package.json
│   └── .env.example
│
├── database/              # Scripts SQL
│   ├── schema.sql         # Definición de tablas
│   └── seed.sql           # Datos de prueba
│
└── README.md              # Este archivo
```

### 3. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cp .env.example .env
nano .env  # o code .env, vim .env
```

**Contenido de `.env` (backend):**

```env
# Configuración del Servidor
PORT=4000
NODE_ENV=development

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=picobanco_user
DB_PASSWORD=tu_password_seguro_aqui
DB_NAME=picobanco_db

# JWT
JWT_SECRET=change_this_secret_in_prod_debe_ser_muy_largo_y_aleatorio
JWT_EXPIRY=8h
```

### 4. Configurar Frontend

```bash
cd ../frontend
npm install

# Crear archivo .env
cp .env.example .env
nano .env
```

**Contenido de `.env` (frontend):**

```env
# URL del Backend API
VITE_API_BASE_URL=http://localhost:4000/api

# Modo vulnerable (propósitos educativos)
VITE_APP_MODE=vulnerable
```

### 5. Iniciar Aplicación

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Servidor corriendo en http://localhost:4000

# Terminal 2: Frontend
cd frontend
npm run dev
# Aplicación corriendo en http://localhost:5173
```

---

## 💾 Configuración de Base de Datos

### 1. Crear Usuario y Database

```bash
# Conectar a PostgreSQL como superusuario
psql -U postgres

# O en Linux:
sudo -u postgres psql
```

```sql
-- Crear usuario
CREATE USER picobanco_user WITH PASSWORD 'tu_password_seguro_aqui';

-- Crear base de datos
CREATE DATABASE picobanco_db OWNER picobanco_user;

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON DATABASE picobanco_db TO picobanco_user;

-- Salir
\q
```

### 2. Crear Schema de Base de Datos

Crear archivo `database/schema.sql`:

```sql
-- ============================================
-- PICOBANCO - DATABASE SCHEMA
-- ============================================

-- Eliminar tablas si existen
DROP TABLE IF EXISTS service_payments CASCADE;
DROP TABLE IF EXISTS savings_movements CASCADE;
DROP TABLE IF EXISTS savings_envelopes CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Tabla: users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    account_number VARCHAR(20) UNIQUE,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: accounts
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    currency VARCHAR(3) DEFAULT 'CRC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- Tabla: transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    receiver_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_amount CHECK (amount > 0),
    CONSTRAINT different_accounts CHECK (sender_id != receiver_id)
);

-- Tabla: savings_envelopes
CREATE TABLE savings_envelopes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    balance DECIMAL(15, 2) DEFAULT 0.00 NOT NULL,
    goal_amount DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_savings_balance CHECK (balance >= 0)
);

-- Tabla: savings_movements
CREATE TABLE savings_movements (
    id SERIAL PRIMARY KEY,
    envelope_id INTEGER NOT NULL REFERENCES savings_envelopes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_movement_type CHECK (type IN ('deposit', 'withdrawal')),
    CONSTRAINT positive_movement_amount CHECK (amount > 0)
);

-- Tabla: service_payments
CREATE TABLE service_payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    service_provider VARCHAR(255) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    reference VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT positive_payment_amount CHECK (amount > 0)
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_account_number ON users(account_number);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_sender ON transactions(sender_id);
CREATE INDEX idx_transactions_receiver ON transactions(receiver_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_savings_user_id ON savings_envelopes(user_id);
CREATE INDEX idx_payments_user_id ON service_payments(user_id);
CREATE INDEX idx_payments_created_at ON service_payments(created_at DESC);
```

### 3. Cargar Datos de Prueba

Crear archivo `database/seed.sql`:

```sql
-- ============================================
-- PICOBANCO - SEED DATA
-- ============================================

-- Usuarios (passwords hasheados con MD5 + salt "pico_salt_2025")
-- Juan: password123
-- María: maria2024  
-- Admin: admin123
INSERT INTO users (name, email, password, account_number, role) VALUES
('Juan Pérez', 'juan@picobanco.com', '482c811da5d5b4bc6d497ffa98491e38', 'CR1234567890123456', 'user'),
('María González', 'maria@picobanco.com', 'e10adc3949ba59abbe56e057f20f883e', 'CR9876543210987654', 'user'),
('Administrador', 'admin@picobanco.com', '0192023a7bbd73250516f069df18b500', 'CR0000000000000001', 'admin'),
('Carlos Ramírez', 'carlos@picobanco.com', 'fcea920f7412b5da7be0cf42b8c93759', 'CR1111222233334444', 'user'),
('Ana Martínez', 'ana@picobanco.com', '25d55ad283aa400af464c76d713c07ad', 'CR5555666677778888', 'user');

-- Cuentas bancarias
INSERT INTO accounts (user_id, balance, currency) VALUES
(1, 5000.00, 'CRC'),
(2, 3500.50, 'CRC'),
(3, 100000.00, 'CRC'),
(4, 2000.00, 'CRC'),
(5, 7500.25, 'CRC');

-- Transacciones de ejemplo
INSERT INTO transactions (sender_id, receiver_id, amount, description) VALUES
(1, 2, 500.00, 'Pago por cena del viernes'),
(2, 4, 250.00, 'Préstamo personal'),
(3, 1, 1000.00, 'Bono de bienvenida'),
(4, 5, 100.00, 'Regalo de cumpleaños');

-- Sobres de ahorro
INSERT INTO savings_envelopes (user_id, name, description, balance, goal_amount) VALUES
(1, 'Vacaciones 2025', 'Viaje a Europa', 1500.00, 5000.00),
(1, 'Fondo de Emergencia', 'Para imprevistos', 2000.00, 10000.00),
(2, 'Carro Nuevo', 'Toyota Corolla', 3000.00, 15000.00);

-- Pagos de servicios
INSERT INTO service_payments (user_id, service_name, service_provider, account_number, amount, reference) VALUES
(1, 'Electricidad', 'ICE', '123456789', 15000.00, 'REF-2024-001'),
(1, 'Agua', 'AyA', '987654321', 5000.00, 'REF-2024-002'),
(2, 'Internet', 'Tigo', '555123456', 25000.00, 'REF-2024-003');
```

### 4. Ejecutar Scripts

```bash
# Crear schema
psql -U picobanco_user -d picobanco_db -f database/schema.sql

# Cargar datos
psql -U picobanco_user -d picobanco_db -f database/seed.sql
```

### 5. Verificar

```bash
psql -U picobanco_user -d picobanco_db

# Listar tablas
\dt

# Ver usuarios
SELECT id, name, email, account_number FROM users;

# Ver balances
SELECT u.name, a.balance FROM accounts a JOIN users u ON a.user_id = u.id;

# Salir
\q
```

---

## 🔑 Credenciales por Defecto

### Usuarios de Prueba

| Nombre | Email | Password | Rol | Account Number | Balance |
|--------|-------|----------|-----|----------------|---------|
| Juan Pérez | `juan@picobanco.com` | `password123` | user | CR1234567890123456 | $5000.00 |
| María González | `maria@picobanco.com` | `maria2024` | user | CR9876543210987654 | $3500.50 |
| Administrador | `admin@picobanco.com` | `admin123` | admin | CR0000000000000001 | $100000.00 |
| Carlos Ramírez | `carlos@picobanco.com` | `carlos456` | user | CR1111222233334444 | $2000.00 |
| Ana Martínez | `ana@picobanco.com` | `ana789` | user | CR5555666677778888 | $7500.25 |

### Conexiones

```
Backend API: http://localhost:4000
Frontend: http://localhost:5173
PostgreSQL: localhost:5432

Database: picobanco_db
User: picobanco_user
Password: [el configurado en .env]
```

---

## 🚨 Catálogo de Vulnerabilidades

Este proyecto implementa **9 de las 10 vulnerabilidades** del OWASP Top 10 2021 con propósitos educativos.

### Resumen Ejecutivo

| # | Vulnerabilidad | Severidad | Archivos | Descripción Breve |
|---|----------------|-----------|----------|-------------------|
| **A01** | Broken Access Control | 🔴 CRÍTICA | 15 | IDOR permite acceso a recursos ajenos |
| **A02** | Cryptographic Failures | 🔴 CRÍTICA | 16 | MD5 + salt fijo, tokens en localStorage |
| **A03** | Injection | 🔴 CRÍTICA | 10 | SQL Injection por concatenación |
| **A04** | Insecure Design | 🟠 ALTA | 19 | Sin rate limiting, race conditions |
| **A05** | Security Misconfiguration | 🟠 ALTA | 26 | CORS abierto, errores verbosos |
| **A06** | Vulnerable Components | 🟡 MEDIA | 1 | MD5 para passwords |
| **A07** | Auth Failures | 🔴 CRÍTICA | 15 | Logout sin invalidar token |
| **A08** | Data Integrity Failures | 🟡 MEDIA | 8 | Sin validación de integridad |
| **A09** | Logging Failures | 🟠 ALTA | 27 | Sin logs de eventos críticos |

### Estadísticas

```
Total de Vulnerabilidades: 9/10 (90% del OWASP Top 10 2021)
Archivos con Vulnerabilidades: 27
Severidad Crítica: 4 vulnerabilidades
Severidad Alta: 3 vulnerabilidades
Severidad Media: 2 vulnerabilidades
```

---

## 🎯 A01:2021 - Broken Access Control (IDOR)

### Descripción Técnica
**Insecure Direct Object References (IDOR)** permite a usuarios autenticados acceder a recursos de otros usuarios simplemente cambiando un ID en la URL o manipulando valores en localStorage.

### Ubicación en el Código

**Backend:**
- `src/controllers/user.controller.js` - Líneas 18-31 (getUserById sin verificar ownership)
- `src/controllers/transaction.controller.js` - Líneas 80-93 (getByUser sin verificar ownership)
- `src/routes/user.routes.js` - Líneas 13-17 (PUT/DELETE sin verificar permisos)

**Frontend:**
- `src/pages/Profile.jsx` - Líneas 21-43 (userId manipulable en localStorage)
- `src/pages/myTransactions.jsx` - Líneas 18-35 (userId de localStorage sin validar)

### Impacto
- Acceso no autorizado a datos personales y financieros
- Modificación de perfiles ajenos
- Visualización de transacciones de otros usuarios
- Escalación de privilegios (user → admin)

---

## 🔐 A02:2021 - Cryptographic Failures

### Descripción Técnica
Uso de algoritmos criptográficos débiles (MD5) con salt fijo predecible, y almacenamiento de datos sensibles en localStorage sin cifrado.

### Ubicación en el Código

**Backend:**
- `src/utils/crypto.util.js` - Líneas 16-27 (MD5 con WEAK_SALT fijo)
- `src/controllers/auth.controller.js` - Líneas 18-22 (uso de weakHash para passwords)
- `src/models/user.model.js` - Líneas 60-64 (SELECT incluye password hash)

**Frontend:**
- `src/services/auth.service.js` - Líneas 16-25 (token en localStorage)
- `src/hooks/useApi.js` - Líneas 11-15 (token sin cifrar)
- `src/pages/Profile.jsx` - Líneas 21-28 (userId y accountNumber sin cifrar)

### Impacto
- Passwords crackeables en minutos con rainbow tables
- Tokens JWT robables vía XSS
- Suplantación de identidad modificando localStorage
- Datos sensibles expuestos sin protección

---

## 💉 A03:2021 - Injection (SQL Injection)

### Descripción Técnica
Concatenación directa de valores del usuario en queries SQL sin sanitización ni uso de prepared statements.

### Ubicación en el Código

**Backend:**
- `src/models/transaction.model.js` - Líneas 23-62 (concatenación en INSERT, UPDATE)
- `src/models/user.model.js` - Líneas 35-40 (findByUsernameRaw con concatenación)

### Impacto
- Control total de la base de datos
- Eliminación de tablas (DROP TABLE)
- Extracción de passwords y datos sensibles
- Modificación de balances bancarios
- Creación de usuarios administradores

---

## 🎨 A04:2021 - Insecure Design

### Descripción Técnica
Fallas fundamentales en el diseño de la aplicación que permiten ataques que no pueden prevenirse solo con implementación correcta.

### Ubicación en el Código

**Backend:**
- `src/routes/auth.routes.js` - Líneas 20-23 (sin rate limiting en login/register)
- `src/models/transaction.model.js` - Líneas 28-35 (race condition - sin SELECT FOR UPDATE)
- `src/controllers/savings.controller.js` - Líneas 56-77 (sin límites de depósito)

**Frontend:**
- `src/pages/login.jsx` - Líneas 17-40 (sin CAPTCHA ni rate limiting)
- `src/pages/Register.jsx` - Líneas 38-47 (acepta passwords débiles)

### Impacto
- Ataques de fuerza bruta sin límite
- Sobregiros bancarios por condiciones de carrera
- Registro masivo de cuentas spam
- Bypass de validaciones del cliente

---

## ⚙️ A05:2021 - Security Misconfiguration

### Descripción Técnica
Configuraciones inseguras que exponen información sensible o permiten accesos no autorizados.

### Ubicación en el Código

**Backend:**
- `src/index.js` - Líneas 14-15 (CORS abierto a todos los orígenes)
- `src/middleware/auth.middleware.js` - Líneas 5-6 (JWT_SECRET débil por defecto)
- `src/controllers/transaction.controller.js` - Líneas 39-41 (stack trace expuesto)
- `src/config/db.js` - Líneas 8-14 (sin SSL para conexión DB)

**Frontend:**
- `src/hooks/useApi.js` - Líneas 21-27 (console.error en producción)

### Impacto
- Exposición de información del sistema (stack traces)
- CORS abierto permite CSRF attacks
- JWT crackeable con secret débil
- DoS con payloads gigantes

---

## 📦 A06:2021 - Vulnerable and Outdated Components

### Descripción Técnica
Uso intencional de algoritmo MD5 para hashing de passwords, considerado criptográficamente roto desde 2004.

### Ubicación en el Código

**Backend:**
- `src/utils/crypto.util.js` - Líneas 16-27 (uso de MD5)

### Impacto
- Passwords crackeables en segundos con herramientas modernas
- No proporciona protección adecuada contra ataques de diccionario

---

## 🔑 A07:2021 - Identification and Authentication Failures

### Descripción Técnica
Gestión insegura de sesiones y autenticación que permite robo de identidad y bypass de controles.

### Ubicación en el Código

**Backend:**
- `src/controllers/auth.controller.js` - Líneas 145-148 (logout stateless)
- `src/middleware/auth.middleware.js` - Líneas 15-28 (sin blacklist de tokens)

**Frontend:**
- `src/services/auth.service.js` - Líneas 16-26 (token en localStorage)
- `src/components/header.jsx` - Líneas 8-16 (logout solo en cliente)
- `src/pages/Profile.jsx` - Líneas 76-108 (cambio de password sin verificar actual)

### Impacto
- Tokens robados funcionan hasta su expiración (8 horas)
- Logout no invalida sesión en servidor
- Cambio de password sin autenticación adicional
- Sin MFA o verificación en dos pasos

---

## 📊 A08:2021 - Software and Data Integrity Failures

### Descripción Técnica
Falta de validación de integridad de datos en tránsito y en reposo.

### Ubicación en el Código

**Backend:**
- `src/controllers/transaction.controller.js` - Líneas 17-38 (sin validación de integridad)

**Frontend:**
- `src/hooks/useApi.js` - Líneas 5-8 (sin validación de respuestas)

### Impacto
- Datos pueden ser modificados en tránsito
- Sin validación de checksums o firmas digitales

---

## 📝 A09:2021 - Security Logging and Monitoring Failures

### Descripción Técnica
Ausencia completa de sistema de logging para eventos de seguridad críticos.

### Ubicación en el Código

**Todos los archivos (27 archivos):**
- Sin registro de intentos de login fallidos
- Sin logging de transacciones financieras
- Sin registro de cambios de password
- Sin alertas de actividad sospechosa
- Solo console.error que no persiste

### Impacto
- Ataques completamente invisibles
- Imposible investigar incidentes
- Sin trazabilidad de operaciones críticas
- Sin alertas en tiempo real

---

## 👥 Contribuciones del Equipo

### Distribución de Tareas

#### [Jairo Rodriguez]
- ✅ Backend completo (18 archivos)
  - Configuración de base de datos y conexión
  - Implementación de controllers con vulnerabilidades
  - Modelos con SQL Injection intencional
  - Routes y middleware de autenticación
- ✅ Scripts SQL (schema.sql y seed.sql)
- ✅ Documentación del catálogo de vulnerabilidades (backend)

#### [Jefry Morera]
- ✅ Frontend completo (9 archivos)
  - Páginas de autenticación (Login, Register)
  - Dashboard y gestión de transacciones
  - Sistema de ahorros y pagos de servicios
  - Componentes reutilizables
- ✅ Integración Frontend-Backend
- ✅ Testing manual de vulnerabilidades
- ✅ README.md e instrucciones de instalación

### Estadísticas de Git

```bash
# Obtener estadísticas
git shortlog -sn --all --no-merges

```

### Metodología de Trabajo

**Desarrollo Ágil en Sprints:**

1. **Sprint 1 (3 días):** Planificación y setup inicial
   - Definición de arquitectura
   - Setup de repositorio Git
   - Configuración de entornos

2. **Sprint 2 (5 días):** Desarrollo Backend
   - Implementación de API REST
   - Modelos y controladores vulnerables
   - Base de datos

3. **Sprint 3 (5 días):** Desarrollo Frontend
   - Interfaces de usuario
   - Integración con backend
   - Routing y navegación

4. **Sprint 4 (3 días):** Testing y Documentación
   - Verificación de vulnerabilidades
   - Documentación completa
   - Scripts de explotación

5. **Sprint 5 (2 días):** Preparación de defensa
   - Revisión final
   - Preparación de demos
   - Ensayos de presentación

**Total:** 18 días de desarrollo activo

---

## 📚 Referencias

### OWASP Top 10 2021
- **Sitio oficial:** https://owasp.org/www-project-top-ten/
- **PDF español:** https://owasp.org/Top10/es/
- **GitHub:** https://github.com/OWASP/Top10

### Documentación Técnica
- **Node.js:** https://nodejs.org/docs/
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/
- **PostgreSQL:** https://www.postgresql.org/docs/
- **JWT:** https://jwt.io/

### Herramientas de Seguridad
- **Burp Suite Community:** https://portswigger.net/burp
- **OWASP ZAP:** https://www.zaproxy.org/
- **SQLMap:** https://sqlmap.org/
- **Hashcat:** https://hashcat.net/hashcat/

### Recursos Educativos
- **OWASP WebGoat:** https://owasp.org/www-project-webgoat/
- **Damn Vulnerable Web App:** https://dvwa.co.uk/
- **PortSwigger Academy:** https://portswigger.net/web-security

---

## ⚖️ Licencia y Disclaimer

### ⚠️ SOLO PARA FINES EDUCATIVOS

Este proyecto contiene **vulnerabilidades de seguridad INTENCIONALES** y está diseñado exclusivamente para:

✅ Educación en seguridad de aplicaciones web  
✅ Demostración de vulnerabilidades OWASP Top 10  
✅ Práctica de explotación en entorno controlado  
✅ Evaluación académica (ITI-922, UTN)

### ❌ NO USAR EN PRODUCCIÓN

❌ NUNCA desplegar en servidores públicos  
❌ NUNCA usar con datos reales  
❌ NUNCA copiar código vulnerable a proyectos reales  
❌ NUNCA explotar sin autorización explícita

### Responsabilidad

Los autores NO se hacen responsables por:
- Uso indebido del código fuente
- Explotación sin autorización
- Daños en sistemas no autorizados
- Violaciones a leyes de ciberseguridad

### Licencia

```
MIT License (con restricciones educativas)

Copyright (c) 2025 [Tu Nombre] y [Compañero]

Se concede permiso para usar, copiar y estudiar este software
únicamente con fines educativos en el contexto del curso ITI-922
de la Universidad Técnica Nacional.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO.
```

---

## 🏁 Conclusión

PicoBanco es un proyecto educativo completo que demuestra cómo las vulnerabilidades más críticas de OWASP Top 10 2021 pueden ser implementadas (y explotadas) en aplicaciones web modernas. A través de este desarrollo, hemos comprendido profundamente:

1. La diferencia entre **código funcional** y **código seguro**
2. El **impacto real** de cada vulnerabilidad en un contexto financiero
3. Las **mejores prácticas** que deben aplicarse desde el diseño
4. La importancia de **pensar en seguridad** desde el primer commit

Este conocimiento nos prepara para desarrollar aplicaciones web seguras en nuestras carreras profesionales, evitando los errores comunes que afectan a millones de aplicaciones en producción.

---