import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model para la aplicación ToDo MVC
 * Encapsula todos los selectores y acciones de la página
 */
export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoList: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;
  readonly clearCompleted: Locator;
  readonly toggleAll: Locator;

  constructor(page: Page) {
    this.page = page;
    // Probar múltiples selectores comunes de TodoMVC
    this.newTodoInput = page.locator('input.new-todo, input[placeholder*="todo" i], input[placeholder*="What needs" i], input[class*="new"]').first();
    this.todoList = page.locator('.todo-list, ul.todo-list, section.todo-list').first();
    this.todoItems = page.locator('.todo-list li, ul.todo-list li, section.todo-list li');
    this.todoCount = page.locator('.todo-count, span.todo-count, .todo-count strong').first();
    this.filterAll = page.locator('a[href="#/"], a[href="/"], .filters a').first();
    this.filterActive = page.locator('a[href="#/active"], .filters a[href*="active"]').first();
    this.filterCompleted = page.locator('a[href="#/completed"], .filters a[href*="completed"]').first();
    this.clearCompleted = page.locator('.clear-completed, button.clear-completed').first();
    this.toggleAll = page.locator('.toggle-all, input.toggle-all, label[for="toggle-all"]').first();
  }

  /**
   * Navega a la aplicación ToDo
   */
  async goto(): Promise<void> {
    // Usar la URL completa en lugar de confiar solo en baseURL
    await this.page.goto('https://demo.playwright.dev/todomvc/', { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    // Esperar a que el body esté presente
    await this.page.waitForSelector('body', { state: 'visible' });
    // Esperar un momento para que la aplicación se inicialice
    await this.page.waitForTimeout(2000);
  }

  /**
   * Agrega una nueva tarea
   * @param taskText - Texto de la tarea a agregar
   */
  async addTask(taskText: string): Promise<void> {
    // Esperar a que el input esté visible antes de interactuar
    await this.newTodoInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.newTodoInput.fill(taskText);
    await this.newTodoInput.press('Enter');
    // Esperar un momento para que la tarea se agregue
    await this.page.waitForTimeout(500);
  }

  /**
   * Agrega múltiples tareas
   * @param tasks - Array de textos de tareas
   */
  async addMultipleTasks(tasks: string[]): Promise<void> {
    for (const task of tasks) {
      await this.addTask(task);
    }
  }

  /**
   * Obtiene el número de tareas en la lista
   * @returns Número de tareas visibles
   */
  async getTaskCount(): Promise<number> {
    // Contar solo las tareas visibles (no las ocultas por filtros)
    const allItems = this.todoItems;
    const count = await allItems.count();
    let visibleCount = 0;
    for (let i = 0; i < count; i++) {
      const item = allItems.nth(i);
      if (await item.isVisible()) {
        visibleCount++;
      }
    }
    return visibleCount;
  }

  /**
   * Verifica que una tarea existe en la lista
   * @param taskText - Texto de la tarea a verificar
   */
  async verifyTaskExists(taskText: string): Promise<void> {
    const task = this.todoItems.filter({ hasText: taskText });
    await expect(task).toBeVisible();
  }

  /**
   * Verifica que una tarea no existe en la lista
   * @param taskText - Texto de la tarea a verificar
   */
  async verifyTaskNotExists(taskText: string): Promise<void> {
    const task = this.todoItems.filter({ hasText: taskText });
    // Verificar que la tarea no está visible (puede estar oculta por filtros)
    // o que el conteo es 0 si buscamos por texto exacto
    const count = await task.count();
    if (count > 0) {
      // Si existe en el DOM, debe estar oculta
      await expect(task.first()).not.toBeVisible();
    }
  }

  /**
   * Marca una tarea como completada
   * @param taskText - Texto de la tarea a completar
   */
  async completeTask(taskText: string): Promise<void> {
    const task = this.todoItems.filter({ hasText: taskText });
    const toggle = task.locator('.toggle');
    await toggle.click();
  }

  /**
   * Verifica que una tarea está completada (tachada)
   * @param taskText - Texto de la tarea a verificar
   */
  async verifyTaskCompleted(taskText: string): Promise<void> {
    const task = this.todoItems.filter({ hasText: taskText });
    await expect(task).toHaveClass(/completed/);
  }

  /**
   * Elimina una tarea
   * @param taskText - Texto de la tarea a eliminar
   */
  async deleteTask(taskText: string): Promise<void> {
    const task = this.todoItems.filter({ hasText: taskText });
    await task.hover();
    const deleteButton = task.locator('.destroy');
    await deleteButton.click();
  }

  /**
   * Obtiene el texto de todas las tareas visibles
   * @returns Array de textos de tareas
   */
  async getAllTaskTexts(): Promise<string[]> {
    const count = await this.getTaskCount();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.todoItems.nth(i).locator('label').textContent();
      if (text) {
        texts.push(text.trim());
      }
    }
    return texts;
  }

  /**
   * Habilita el filtro "All"
   */
  async filterAllTasks(): Promise<void> {
    await this.filterAll.click();
    // Esperar a que el filtro se aplique
    await this.page.waitForTimeout(500);
  }

  /**
   * Habilita el filtro "Active"
   */
  async filterActiveTasks(): Promise<void> {
    await this.filterActive.click();
    // Esperar a que el filtro se aplique y la vista se actualice
    await this.page.waitForTimeout(500);
    // Esperar a que el DOM se actualice después del filtro
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Habilita el filtro "Completed"
   */
  async filterCompletedTasks(): Promise<void> {
    await this.filterCompleted.click();
    // Esperar a que el filtro se aplique y la vista se actualice
    await this.page.waitForTimeout(500);
    // Esperar a que el DOM se actualice después del filtro
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verifica que solo se muestran tareas pendientes (no completadas)
   */
  async verifyOnlyActiveTasks(): Promise<void> {
    const count = await this.getTaskCount();
    for (let i = 0; i < count; i++) {
      const task = this.todoItems.nth(i);
      await expect(task).not.toHaveClass(/completed/);
    }
  }

  /**
   * Verifica que solo se muestran tareas completadas
   */
  async verifyOnlyCompletedTasks(): Promise<void> {
    const count = await this.getTaskCount();
    for (let i = 0; i < count; i++) {
      const task = this.todoItems.nth(i);
      await expect(task).toHaveClass(/completed/);
    }
  }

  /**
   * Recarga la página para verificar persistencia
   */
  async reloadPage(): Promise<void> {
    await this.page.reload();
  }
}
