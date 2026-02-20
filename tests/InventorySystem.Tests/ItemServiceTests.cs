using Xunit;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using InventorySystem.Data;
using InventorySystem.Models;
using InventorySystem.Services;

namespace InventorySystem.Tests;

public class ItemServiceTests
{
    private InventoryDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<InventoryDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new InventoryDbContext(options);
    }

    [Fact]
    public async Task CreateItemAsync_ShouldAddItemAndReturnIt()
    {
        var context = GetDbContext();
        var service = new ItemService(context);
        var newItem = new Item { Name = "Test Item", Quantity = 10, Price = 100 };
        var ct = TestContext.Current.CancellationToken;

        var result = await service.CreateItemAsync(newItem, ct);

        result.Id.Should().NotBeEmpty();
        context.Items.Count().Should().Be(1);
        result.Name.Should().Be("Test Item");
    }

    [Fact]
    public async Task DeleteItemAsync_ShouldReturnTrue_WhenItemExists()
    {
        var context = GetDbContext();
        var service = new ItemService(context);
        var item = new Item { Id = Guid.NewGuid(), Name = "Delete Me" };
        var ct = TestContext.Current.CancellationToken;
        
        context.Items.Add(item);
        await context.SaveChangesAsync(ct);

        var result = await service.DeleteItemAsync(item.Id, ct);

        result.Should().BeTrue();
        context.Items.Should().BeEmpty();
    }

    [Fact]
    public async Task GetItemByIdAsync_ShouldReturnNull_WhenItemDoesNotExist()
    {
        var context = GetDbContext();
        var service = new ItemService(context);
        var ct = TestContext.Current.CancellationToken;

        var result = await service.GetItemByIdAsync(Guid.NewGuid(), ct);

        result.Should().BeNull();
    }
}