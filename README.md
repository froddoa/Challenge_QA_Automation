# Challenge QA Automation - Playwright + TypeScript

Proyecto de automatización de pruebas para la aplicación ToDo MVC utilizando Playwright y TypeScript.


## 📋 Descripción

Este proyecto contiene pruebas automatizadas para la aplicación web de lista de tareas (ToDo App) disponible en https://demo.playwright.dev/todomvc. Las pruebas están implementadas usando Playwright con TypeScript y siguen el patrón Page Object Model (POM) para una mejor mantenibilidad y organización del código.

## 🛠️ Instalación de Dependencias

### Requisitos previos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos para instalar

1. Clonar o descargar el proyecto en en un repositorio local
2. Abrir una terminal en la raíz del proyecto
3. Ejecutar el siguiente comando para instalar las dependencias:

```bash para instalar paquetes de software (librerías, herramientas) en proyectos de Node.js

npm install
```

4. Para descargar e instalar el motor del navegador Chromium:

```bash 
npx playwright install chromium
```

para descargar e instalar los binarios de los navegadores que Playwright

```bash
npx playwright install
```

## 🚀 Cómo Ejecutar las Pruebas


# Para ejecutar todas las pruebas en modo headless (sin interfaz grafica):

```bash
npx playwright test
```

### Ejecutar pruebas en modo headed (con interfaz gráfica)

Para ver el navegador durante la ejecución de las pruebas:

```bash
npx playwright test --headed
```

### Ejecutar pruebas con interfaz de usuario interactiva

Para una experiencia más interactiva y poder debuggear:

```bash
npx playwright test --ui
```

### Ejecutar pruebas en modo debug

Para ejecutar las pruebas paso a paso con herramientas de debugging:

```bash
npx playwright test --debug
```

### Ejecutar un archivo específico de pruebas

Para ejecutar solo los escenarios obligatorios:

```bash
npx playwright test tests/Casos_de_prueba_obligatorios.spec.ts
```

Para ejecutar solo los escenarios bonus:

```bash
npx playwright test tests/Casos_de_prueba_opcionales.spec.ts
```

### Ver el reporte HTML

Después de ejecutar las pruebas, puedes ver un reporte HTML detallado:

```bash
npx playwright show-report
```

## 📁 Estructura del Proyecto

```
Challenge_QA_Automation/
├── pages/                      # Page Object Model
│   └── TodoPage.ts            # Clase que encapsula la página ToDo
├── tests/                      # Archivos de pruebas
│   ├── Casos_de_prueba_obligatorios.spec.ts    # Escenarios obligatorios
│   └── Casos_de_prueba_opcionales.spec.ts       # Escenarios bonus
├── Documento_de_casos_de_pruebas/    # Documentación de casos de prueba
│   ├── Casos_de_Prueba.html   # Documento HTML con todos los casos de prueba
│   └── Evidencias/            # Carpeta para capturas de pantalla de pruebas
│       └── README.md          # Documentación sobre las evidencias
├── playwright.config.ts        # Configuración de Playwright
├── tsconfig.json              # Configuración de TypeScript
├── package.json               # Dependencias del proyecto
└── README.md                  # Este archivo
```

## 🧪 Escenarios de Prueba

### Escenarios Obligatorios

1. **Agregar una tarea**
   - Navega a la aplicación
   - Agrega una nueva tarea: "Aprender Playwright"
   - Verifica que la tarea aparece en la lista

2. **Marcar tarea como completada**
   - Marca la tarea "Aprender Playwright" como completada
   - Valida que la tarea aparece tachada o en la sección de completadas

3. **Eliminar una tarea**
   - Elimina la tarea "Aprender Playwright"
   - Verifica que ya no aparece en la lista

4. **Agregar múltiples tareas**
   - Agrega tres tareas diferentes
   - Valida que las tres aparecen en la lista

### Escenarios Bonus - Casos de prueba opcionales

1. **Validar persistencia al refrescar**
   - Verifica que al refrescar la página las tareas persisten

2. **Filtro "Active"**
   - Prueba que el filtro "Active" muestra solo tareas pendientes

3. **Filtro "Completed"**
   - Prueba que el filtro "Completed" muestra solo tareas completadas

## 🏗️ Estrategia de Pruebas

### Page Object Model (POM)

Se utiliza el patrón **Page Object Model** para separar la lógica de pruebas de los selectores y acciones de la página. Esto proporciona:

- **Mantenibilidad**: Los selectores están centralizados en un solo lugar
- **Reutilización**: Las acciones comunes se pueden reutilizar en múltiples tests
- **Legibilidad**: Los tests son más claros y fáciles de entender
- **Mantenimiento**: Si la UI cambia, solo se actualiza el Page Object

El archivo `pages/TodoPage.ts` contiene:
- Todos los selectores de elementos de la página
- Métodos para realizar acciones (agregar, completar, eliminar tareas)
- Métodos para realizar verificaciones y aserciones

### Fixtures y beforeEach

Se utiliza `beforeEach` en cada suite de pruebas para:
- Inicializar el Page Object antes de cada test
- Navegar a la aplicación antes de ejecutar cada prueba
- Asegurar un estado limpio y consistente al inicio de cada test

### Aserciones

Se utilizan aserciones claras con `expect` de Playwright, incluyendo:
- Mensajes descriptivos que facilitan la identificación de fallos
- Múltiples niveles de verificación (existencia, visibilidad, estado)
- Verificaciones tanto a nivel de Page Object como en los tests

### Organización del Código

- Los tests se enfocan en la lógica de negocio, mientras que el POM maneja la interacción con la UI
- Los nombres de los tests describen claramente qué se está probando
- La configuración de Playwright está en un solo archivo


El proyecto está configurado para ejecutar las pruebas en **Chromium** únicamente, como se especificó en los requisitos. La configuración se encuentra en `playwright.config.ts` y puede ser modificada si se desea ejecutar en otros navegadores.

### Características de configuración:

- **Base URL**: https://demo.playwright.dev/todomvc
- **Reporter**: HTML (genera reportes visuales)
- **Screenshots**: Se capturan automáticamente cuando un test falla
- **Traces**: Se capturan cuando un test se reintenta

## 📸 Generación Automática de Evidencias

El proyecto está configurado para generar automáticamente capturas de pantalla como evidencia de cada prueba ejecutada. Estas capturas se guardan en la carpeta `Documento_de_casos_de_pruebas/Evidencias/`.

### Formato de Nomenclatura

Cada captura de pantalla se nombra automáticamente con el siguiente formato:

```
CP-XXX_Título del Módulo_DD-MM-YYYY.png
```

**Ejemplo:**
- `CP-001_Gestión de Tareas_15-1-2026.png`
- `CP-002_Gestión de Tareas_15-1-2026.png`
- `CP-005_Persistencia de Datos_15-1-2026.png`

### Mapeo de Casos de Prueba

| ID | Título | Módulo | Nombre del Archivo |
|---|---|---|---|
| CP-001 | Agregar una tarea | Gestión de Tareas | CP-001_Gestión de Tareas_DD-MM-YYYY.png |
| CP-002 | Marcar tarea como completada | Gestión de Tareas | CP-002_Gestión de Tareas_DD-MM-YYYY.png |
| CP-003 | Eliminar una tarea | Gestión de Tareas | CP-003_Gestión de Tareas_DD-MM-YYYY.png |
| CP-004 | Agregar múltiples tareas | Gestión de Tareas | CP-004_Gestión de Tareas_DD-MM-YYYY.png |
| CP-005 | Validar persistencia al refrescar | Persistencia de Datos | CP-005_Persistencia de Datos_DD-MM-YYYY.png |
| CP-006 | Probar filtro "Active" | Filtros | CP-006_Filtros_DD-MM-YYYY.png |
| CP-007 | Probar filtro "Completed" | Filtros | CP-007_Filtros_DD-MM-YYYY.png |

### Cómo se Generan

Las capturas de pantalla se generan automáticamente al final de cada prueba exitosa:

1. **Automático**: No es necesario configurar nada adicional, las capturas se toman automáticamente al ejecutar las pruebas
2. **Estado final**: Cada captura muestra el estado final de la aplicación después de ejecutar todos los pasos de la prueba
3. **Full page**: Las capturas incluyen toda la página (modo `fullPage: true`)
4. **Fecha de ejecución**: El nombre del archivo incluye automáticamente la fecha en que se ejecutó la prueba

### Ubicación de las Evidencias

Todas las capturas de pantalla se guardan en:
```
Documento_de_casos_de_pruebas/Evidencias/
```

Para ver las evidencias generadas, simplemente ejecuta las pruebas:

```bash
npx playwright test
```

Después de la ejecución, navega a la carpeta `Documento_de_casos_de_pruebas/Evidencias/` para ver todas las capturas de pantalla generadas.

### Notas Importantes

- Las capturas solo se generan cuando las pruebas se ejecutan exitosamente
- Si una prueba falla, Playwright también capturará una screenshot en la carpeta `test-results/` para debugging
- La fecha en el nombre del archivo corresponde a la fecha de ejecución real de la prueba (formato DD-MM-YYYY)




