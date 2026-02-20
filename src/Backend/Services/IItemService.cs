using InventorySystem.Models;

namespace InventorySystem.Services;

public interface IItemService
{
    Task<IEnumerable<Item>> GetAllItemsAsync(CancellationToken ct = default);
    Task<Item?> GetItemByIdAsync(Guid id, CancellationToken ct = default);
    Task<Item> CreateItemAsync(Item item, CancellationToken ct = default);
    Task<bool> UpdateItemAsync(Guid id, Item item, CancellationToken ct = default);
    Task<bool> DeleteItemAsync(Guid id, CancellationToken ct = default);
}