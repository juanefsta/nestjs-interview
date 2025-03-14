import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ExternalApiService } from '../external-api/external-api.service';
import { TodoListsService } from 'src/todo_lists/todo_lists.service';
import { TodoItem } from 'src/common/interfaces/todo_item.interface';
import { TodoItemsService } from 'src/todo_items/todo_items.service';

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
            this.externalApiService.fetchTodoLists(),  // Obtener datos del API externo
            this.todoListsService.all()  // Obtener datos locales
        ]);

        const localMap = new Map(localLists.map(list => [list.id, list]));
        const externalMap = new Map(externalLists.map(list => {
            const parsedId = parseInt(list.source_id, 10);
            if (isNaN(parsedId)) {
                throw new Error(`Invalid list id: ${list.source_id}`);
            }
            return [parsedId, list]
        }));

        // Procesar nuevas listas en el API externo
        for (const [id, externalList] of externalMap) {

            const localList = localMap.get(id);
            if (!localList) {
                await this.todoListsService.create(externalList, this.syncDisabled);
                continue;
            }

            // Si la lista existe en ambos, comparar y actualizar si hay cambios
            if (
                localList.name !== externalList.name ||
                new Date(localList.updated_at).getTime() < new Date(externalList.updated_at).getTime()
            ) {
                await this.todoListsService.update(id, { name: externalList.name, updated_at: externalList.updated_at }, this.syncDisabled);
            }

            // Comparar y sincronizar items dentro de la lista
            await this.syncItems(localList.items, externalList.items, id);
        }

        // Opcional: Eliminar listas locales que ya no están en el API externo
        for (const [id] of localMap) {
            if (!externalMap.has(id)) {
                await this.todoListsService.delete(id, this.syncDisabled);
            }
        }
    }

    private async syncItems(localItems: TodoItem[], externalItems: TodoItem[], listId: number) {
        const localItemMap = new Map(localItems.map(item => [item.id, item]));
        const externalItemMap = new Map(externalItems.map(item => [item.id, item]));

        // Agregar o actualizar items
        for (const [id, externalItem] of externalItemMap) {
            const localItem = localItemMap.get(id);
            if (!localItem) {
                const newItem = { ...externalItem, listId };
                await this.todoItemService.create(newItem, this.syncDisabled);
                continue;
            }

            // Si hay cambios en el item, actualizarlo
            if (
                localItem.description !== externalItem.description ||
                localItem.completed !== externalItem.completed ||
                new Date(localItem.updated_at).getTime() < new Date(externalItem.updated_at).getTime()
            ) {
                await this.todoItemService.update(id, { ...externalItem, updated_at: externalItem.updated_at }, this.syncDisabled);
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
