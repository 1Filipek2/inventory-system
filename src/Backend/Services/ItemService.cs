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

    public async Task<IEnumerable<Item>> GetAllItemsAsync(CancellationToken ct = default) 
        => await _context.Items.ToListAsync(ct);

    public async Task<Item?> GetItemByIdAsync(Guid id, CancellationToken ct = default) 
        => await _context.Items.FindAsync([id], ct);

    public async Task<Item> CreateItemAsync(Item item, CancellationToken ct = default)
    {
        _context.Items.Add(item);
        await _context.SaveChangesAsync(ct);
        return item;
    }

    public async Task<bool> UpdateItemAsync(Guid id, Item item, CancellationToken ct = default)
    {
        if (id != item.Id) return false;
        
        _context.Entry(item).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync(ct);
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }
    }

    public async Task<bool> DeleteItemAsync(Guid id, CancellationToken ct = default)
    {
        var item = await _context.Items.FindAsync([id], ct);
        if (item == null) return false;

        _context.Items.Remove(item);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}