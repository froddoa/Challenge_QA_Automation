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
    this.newTodoInput = page.locator('.new-todo');
    this.todoList = page.locator('.todo-list');
    this.todoItems = page.locator('.todo-list li');
    this.todoCount = page.locator('.todo-count');
    this.filterAll = page.locator('a[href="#/"]');
    this.filterActive = page.locator('a[href="#/active"]');
    this.filterCompleted = page.locator('a[href="#/completed"]');
    this.clearCompleted = page.locator('.clear-completed');
    this.toggleAll = page.locator('.toggle-all');
  }

  /**
   * Navega a la aplicación ToDo
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Agrega una nueva tarea
   * @param taskText - Texto de la tarea a agregar
   */
  async addTask(taskText: string): Promise<void> {
    await this.newTodoInput.fill(taskText);
    await this.newTodoInput.press('Enter');
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
    return await this.todoItems.count();
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
    await expect(task).not.toBeVisible();
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
  }

  /**
   * Habilita el filtro "Active"
   */
  async filterActiveTasks(): Promise<void> {
    await this.filterActive.click();
  }

  /**
   * Habilita el filtro "Completed"
   */
  async filterCompletedTasks(): Promise<void> {
    await this.filterCompleted.click();
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
