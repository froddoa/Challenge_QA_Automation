import { test, expect } from '@playwright/test';
import { TodoPage } from '../pages/TodoPage';
import * as path from 'path';

/**
 * Suite de pruebas para escenarios bonus de la aplicación ToDo
 */
test.describe('Escenarios Bonus - Aplicación ToDo', () => {
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

  test('Escenario Bonus 1: Validar que al refrescar la página las tareas persisten', async ({ page }) => {
    // Preparar: Agregar múltiples tareas
    const tasks = [
      'Tarea persistente 1',
      'Tarea persistente 2',
      'Tarea persistente 3'
    ];
    
    await todoPage.addMultipleTasks(tasks);

    // Verificar que las tareas están presentes antes del refresh
    expect(await todoPage.getTaskCount()).toBe(3);

    // Recargar la página
    await todoPage.reloadPage();

    // Verificar que las tareas persisten después del refresh
    expect(await todoPage.getTaskCount()).toBe(3);
    
    for (const task of tasks) {
      await todoPage.verifyTaskExists(task);
    }

    // Verificación adicional: los textos deben coincidir
    const allTaskTexts = await todoPage.getAllTaskTexts();
    expect(allTaskTexts).toEqual(expect.arrayContaining(tasks));

    // Tomar captura de pantalla como evidencia
    const evidencePath = getEvidencePath(getEvidenceFileName('005', 'Persistencia de Datos'));
    await page.screenshot({ path: evidencePath, fullPage: true });
  });

  test('Escenario Bonus 2: Probar que el filtro "Active" muestra solo tareas pendientes', async ({ page }) => {
    // Preparar: Agregar múltiples tareas
    const activeTasks = [
      'Tarea pendiente 1',
      'Tarea pendiente 2'
    ];
    const completedTasks = [
      'Tarea completada 1',
      'Tarea completada 2'
    ];

    // Agregar tareas pendientes
    await todoPage.addMultipleTasks(activeTasks);
    
    // Agregar tareas completadas
    await todoPage.addMultipleTasks(completedTasks);

    // Completar algunas tareas
    for (const task of completedTasks) {
      await todoPage.completeTask(task);
    }

    // Verificar que hay 4 tareas en total
    expect(await todoPage.getTaskCount()).toBe(4);

    // Activar el filtro "Active"
    await todoPage.filterActiveTasks();

    // Verificar que solo se muestran tareas pendientes
    await todoPage.verifyOnlyActiveTasks();
    
    // Verificar que el número de tareas visibles es correcto
    expect(await todoPage.getTaskCount()).toBe(2);

    // Verificar que las tareas activas están visibles
    for (const task of activeTasks) {
      await todoPage.verifyTaskExists(task);
    }

    // Verificar que las tareas completadas NO están visibles
    for (const task of completedTasks) {
      await todoPage.verifyTaskNotExists(task);
    }

    // Tomar captura de pantalla como evidencia
    const evidencePath = getEvidencePath(getEvidenceFileName('006', 'Filtros'));
    await page.screenshot({ path: evidencePath, fullPage: true });
  });

  test('Escenario Bonus 3: Probar que el filtro "Completed" muestra solo tareas completadas', async ({ page }) => {
    // Preparar: Agregar múltiples tareas
    const activeTasks = [
      'Tarea pendiente A',
      'Tarea pendiente B'
    ];
    const completedTasks = [
      'Tarea completada X',
      'Tarea completada Y'
    ];

    // Agregar tareas pendientes
    await todoPage.addMultipleTasks(activeTasks);
    
    // Agregar tareas y completarlas
    await todoPage.addMultipleTasks(completedTasks);

    // Completar las tareas designadas
    for (const task of completedTasks) {
      await todoPage.completeTask(task);
    }

    // Verificar que hay 4 tareas en total
    expect(await todoPage.getTaskCount()).toBe(4);

    // Activar el filtro "Completed"
    await todoPage.filterCompletedTasks();

    // Verificar que solo se muestran tareas completadas
    await todoPage.verifyOnlyCompletedTasks();
    
    // Verificar que el número de tareas visibles es correcto
    expect(await todoPage.getTaskCount()).toBe(2);

    // Verificar que las tareas completadas están visibles
    for (const task of completedTasks) {
      await todoPage.verifyTaskExists(task);
    }

    // Verificar que las tareas pendientes NO están visibles
    for (const task of activeTasks) {
      await todoPage.verifyTaskNotExists(task);
    }

    // Tomar captura de pantalla como evidencia
    const evidencePath = getEvidencePath(getEvidenceFileName('007', 'Filtros'));
    await page.screenshot({ path: evidencePath, fullPage: true });
  });
});
