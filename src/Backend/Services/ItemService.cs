using Microsoft.EntityFrameworkCore;
using InventorySystem.Data;
using InventorySystem.Models;

namespace InventorySystem.Services;

public class ItemService : IItemService
{
    private readonly InventoryDbContext _context;

    public ItemService(InventoryDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Item>> GetAllItemsAsync() 
        => await _context.Items.ToListAsync();

    public async Task<Item?> GetItemByIdAsync(Guid id) 
        => await _context.Items.FindAsync(id);

    public async Task<Item> CreateItemAsync(Item item)
    {
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<bool> UpdateItemAsync(Guid id, Item item)
    {
        if (id != item.Id) return false;
        
        _context.Entry(item).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }
    }

    public async Task<bool> DeleteItemAsync(Guid id)
    {
        var deleted = await _context.Items
            .Where(x => x.Id == id)
            .ExecuteDeleteAsync();
        return deleted > 0;
    }
}