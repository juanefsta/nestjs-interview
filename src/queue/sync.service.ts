import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExternalApiService } from '../external-api/external-api.service';
import { TodoListsService } from '../todo_lists/todo_lists.service';
import { TodoItem } from '../common/interfaces/todo_item.interface';
import { TodoItemsService } from '../todo_items/todo_items.service';

@Injectable()
export class SyncSchedulerService {
  private readonly logger = new Logger(SyncSchedulerService.name);
  private readonly syncDisabled = true;
  constructor(
    private readonly todoListsService: TodoListsService,
    private readonly todoItemService: TodoItemsService,
    private readonly externalApiService: ExternalApiService,
  ) { }

  // Ejecutar cada 10 segundos (300ms)
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.log('🔄 Checking for new TodoLists from external API...');

    this.syncExternalWithLocal();

    this.logger.log('✅ Sync completed');
  }

  async syncExternalWithLocal() {
    const [externalLists, localLists] = await Promise.all([
      this.externalApiService.fetchTodoLists(), // Obtener datos del API externo
      this.todoListsService.all(), // Obtener datos locales
    ]);

    try {
      if (!externalLists || !localLists) {
        this.logger.warn('No data found');
        return;
      }
      const localMap = new Map(localLists.map((list) => [list.id, list]));
      const externalMap = new Map(
        externalLists.map((list) => {
          // Cómo source_id es opcional, se considera que fue creada en la api externa
          // por lo que forzamos su creación en la base de datos local comparando luego con su id
          const id = list.source_id ?? '-1';
          const parsedId = parseInt(id, 10);
          if (isNaN(parsedId)) {
            throw new Error(`Invalid list id: ${list.source_id}`);
          }
          return [parsedId, list];
        }),
      );

      // Procesar nuevas listas en el API externo
      for (const [id, externalList] of externalMap) {
        const localList = localMap.get(id);

        // Validar si no existe un elemento en localMap con source_id ===  externalList.id
        const localMapItemWithSourceId = Array.from(localMap.values()).find(
          (list) => list.source_id === externalList.id.toString(),
        );

        const list = localList ?? localMapItemWithSourceId;

        if (!list) {
          await this.todoListsService.create(externalList, this.syncDisabled);
          continue;
        }

        // Si la lista existe en ambos, comparar y actualizar si hay cambios
        if (
          list.name !== externalList.name ||
          new Date(list.updated_at).getTime() <
          new Date(externalList.updated_at).getTime()
        ) {
          await this.todoListsService.update(
            id,
            { name: externalList.name, updated_at: externalList.updated_at },
            this.syncDisabled,
          );
        }

        // Comparar y sincronizar items dentro de la lista
        await this.syncItems(list.items, externalList.items, id);
      }
    } catch (error) {
      this.logger.error(`Error syncing external data: ${error.message}`);
    }
  }

  private async syncItems(
    localItems: TodoItem[],
    externalItems: TodoItem[],
    listId: number,
  ) {
    const localItemMap = new Map(localItems.map((item) => [item.id, item]));
    const externalItemMap = new Map(
      externalItems.map((item) => [item.id, item]),
    );

    // Agregar o actualizar items
    for (const [id, externalItem] of externalItemMap) {
      const localItem = localItemMap.get(id);
      if (!localItem) {
        this.logger.debug(`S.I 3`);
        const newItem = { ...externalItem, listId };
        await this.todoItemService.create(newItem, this.syncDisabled);
        continue;
      }

      // Si hay cambios en el item, actualizarlo
      if (
        localItem.description !== externalItem.description ||
        localItem.completed !== externalItem.completed ||
        new Date(localItem.updated_at).getTime() <
        new Date(externalItem.updated_at).getTime()
      ) {
        await this.todoItemService.update(
          id,
          { ...externalItem, updated_at: externalItem.updated_at },
          this.syncDisabled,
        );
      }
    }

    // Eliminar items locales que ya no existen en el API externo
    for (const [id] of localItemMap) {
      if (!externalItemMap.has(id)) {
        await this.todoItemService.delete(id, this.syncDisabled);
      }
    }
  }
}
