import { computed, Injectable, signal } from '@angular/core';
import { Todo, CreateTodoRequest } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos = signal<Todo[]>([
    {
      id: 1,
      title: 'Apprendre Angular',
      description: "Étudier les fondamentaux d'Angular 20+",
      status: 'todo',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: 'Créer un projet',
      description: 'Développer une application TodoList',
      status: 'in-progress',
      priority: 'medium',
      createdBy: 1,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: 3,
      title: "Configurer l'environnement",
      description: 'Installer Node.js, Angular CLI et configurer VS Code',
      status: 'done',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-14'),
    },
  ]);

  // Simuler un délai réseau
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  addTodo(todo: Todo) {
    this.todos.update((todos) => [...todos, todo]);
  }

  // GET - Récupérer tous les todos
  async getAllTodos(): Promise<Todo[]> {
    console.warn('🔄 Service: Récupération de tous les todos...');
    await this.delay(300); // Simuler un appel API
    console.warn('✅ Service: Todos récupérés avec succès');
    return this.todos();
  }

  // GET - Récupérer un todo par ID
  async getTodoById(id: number): Promise<Todo | undefined> {
    console.warn(`🔄 Service: Récupération du todo ${id}...`);
    await this.delay(200);
    const todo = this.todos().find((t) => t.id === id);
    console.warn(`✅ Service: Todo ${id} récupéré:`, todo);
    return todo;
  }

  // POST - Créer un nouveau todo
  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    console.warn("🔄 Service: Création d'un nouveau todo...", todoData);
    await this.delay(400);

    const newTodo: Todo = {
      id: Date.now(),
      title: todoData.title,
      description: todoData.description || '',
      status: 'todo',
      priority: todoData.priority,
      assignedTo: todoData.assignedTo,
      createdBy: 1, // TODO: Récupérer l'ID de l'utilisateur connecté
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.todos.update((todos) => [...todos, newTodo]);
    console.warn('✅ Service: Todo créé avec succès:', newTodo);
    return newTodo;
  }

  // PUT - Mettre à jour un todo
  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    console.warn(`🔄 Service: Mise à jour du todo ${id}...`, updates);
    await this.delay(300);

    let updatedTodo: Todo | undefined;
    this.todos.update((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          updatedTodo = {
            ...todo,
            ...updates,
            updatedAt: new Date(),
          };
          return updatedTodo;
        }
        return todo;
      }),
    );

    console.warn(`✅ Service: Todo ${id} mis à jour:`, updatedTodo);
    return updatedTodo;
  }

  // DELETE - Supprimer un todo
  async deleteTodo(id: number): Promise<boolean> {
    console.warn(`🔄 Service: Suppression du todo ${id}...`);
    await this.delay(250);

    let deleted = false;
    this.todos.update((todos) => {
      const initialLength = todos.length;
      const filtered = todos.filter((todo) => todo.id !== id);
      deleted = filtered.length < initialLength;
      return filtered;
    });

    console.warn(`✅ Service: Todo ${id} supprimé:`, deleted);
    return deleted;
  }

  // Méthodes utilitaires
  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter((todo) => todo.status === status);
  }

  getTodosByPriority(priority: Todo['priority']): Todo[] {
    return this.todos().filter((todo) => todo.priority === priority);
  }

  // Signal computed - se recalcule automatiquement
  public completedTodos = computed(() => this.todos().filter((todo) => todo.status === 'done'));

  public pendingTodos = computed(() => this.todos().filter((todo) => todo.status === 'todo'));

  public inProgressTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'in-progress'),
  );

  public highPriorityTodos = computed(() =>
    this.todos().filter((todo) => todo.priority === 'high'),
  );

  public todoStats = computed(() => ({
    total: this.todos().length,
    completed: this.completedTodos().length,
    inProgress: this.inProgressTodos().length,
    pending: this.pendingTodos().length,
    highPriority: this.highPriorityTodos().length,
    completionRate:
      this.todos().length > 0 ? (this.completedTodos().length / this.todos().length) * 100 : 0,
  }));
}
