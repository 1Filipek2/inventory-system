using InventorySystem.Models;

namespace InventorySystem.Services;

public interface IItemService
{
    Task<IEnumerable<Item>> GetAllItemsAsync();
    Task<Item?> GetItemByIdAsync(Guid id);
    Task<Item> CreateItemAsync(Item item);
    Task<bool> UpdateItemAsync(Guid id, Item item);
    Task<bool> DeleteItemAsync(Guid id);
}