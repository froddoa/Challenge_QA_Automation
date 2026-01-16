import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';
import * as path from 'path';

/**
 * Suite de pruebas para escenarios obligatorios de la aplicación ToDo
 */
test.describe('Escenarios Obligatorios - Aplicación ToDo', () => {
  let todoPage: TodoPage;

  // Función helper para generar el nombre del archivo de evidencia
  function getEvidenceFileName(cpId: string, modulo: string): string {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const dateStr = `${day}-${month}-${year}`;
    return `CP-${cpId}_${modulo}_${dateStr}.png`;
  }

  // Función helper para obtener la ruta completa de evidencia
  function getEvidencePath(fileName: string): string {
    // Usar process.cwd() para obtener el directorio raíz del proyecto
    return path.join(process.cwd(), 'Documento_de_casos_de_pruebas', 'Evidencias', fileName);
  }

  // Fixture para inicializar la página antes de cada test
  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('Escenario 1: Agregar una tarea', async ({ page }) => {
    // Navegar a la aplicación (ya se hace en beforeEach)
    // Agregar una nueva tarea: "Aprender Playwright"
    const taskText = 'Aprender Playwright';
    await todoPage.addTask(taskText);

    // Verificar que la tarea aparece en la lista
    await todoPage.verifyTaskExists(taskText);
    expect(await todoPage.getTaskCount()).toBe(1);

    // Tomar captura de pantalla como evidencia
    const evidencePath = getEvidencePath(getEvidenceFileName('001', 'Gestión de Tareas'));
    await page.screenshot({ path: evidencePath, fullPage: true });
  });

  test('Escenario 2: Marcar tarea como completada', async ({ page }) => {
    // Preparar: Agregar una tarea primero
    const taskText = 'Aprender Playwright';
    await todoPage.addTask(taskText);

    // Marcar la tarea "Aprender Playwright" como completada
    await todoPage.completeTask(taskText);

    // Validar que la tarea aparece tachada o en la sección de completadas
    await todoPage.verifyTaskCompleted(taskText);
    
    // Verificación adicional: la tarea debe tener la clase 'completed'
    const task = todoPage.todoItems.filter({ hasText: taskText });
    await expect(task).toHaveClass(/completed/);

    // Tomar captura de pantalla como evidencia
    const evidencePath = getEvidencePath(getEvidenceFileName('002', 'Gestión de Tareas'));
    await page.screenshot({ path: evidencePath, fullPage: true });
  });

  test('Escenario 3: Eliminar una tarea', async ({ page }) => {
    // Preparar: Agregar una tarea primero
    const taskText = 'Aprender Playwright';
    await todoPage.addTask(taskText);
    
    // Verificar que la tarea existe antes de eliminar
    await todoPage.verifyTaskExists(taskText);
    expect(await todoPage.getTaskCount()).toBe(1);

    // Eliminar la tarea "Aprender Playwright"
    await todoPage.deleteTask(taskText);

    // Verificar que ya no aparece en la lista
    await todoPage.verifyTaskNotExists(taskText);
    expect(await todoPage.getTaskCount()).toBe(0);

    // Tomar captura de pantalla como evidencia
    const evidencePath = getEvidencePath(getEvidenceFileName('003', 'Gestión de Tareas'));
    await page.screenshot({ path: evidencePath, fullPage: true });
  });

  test('Escenario 4: Agregar múltiples tareas', async ({ page }) => {
    // Agregar tres tareas diferentes
    const tasks = [
      'Tarea número uno',
      'Tarea número dos',
      'Tarea número tres'
    ];
    
    await todoPage.addMultipleTasks(tasks);

    // Validar que las tres aparecen en la lista
    expect(await todoPage.getTaskCount()).toBe(3);
    
    // Verificar que cada tarea existe
    for (const task of tasks) {
      await todoPage.verifyTaskExists(task);
    }

    // Verificación adicional: obtener todos los textos y comparar
    const allTaskTexts = await todoPage.getAllTaskTexts();
    expect(allTaskTexts).toEqual(expect.arrayContaining(tasks));

    // Tomar captura de pantalla como evidencia
    const evidencePath = getEvidencePath(getEvidenceFileName('004', 'Gestión de Tareas'));
    await page.screenshot({ path: evidencePath, fullPage: true });
  });
});
