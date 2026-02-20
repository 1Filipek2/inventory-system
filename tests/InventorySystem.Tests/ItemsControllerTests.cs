using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using InventorySystem.Data;
using InventorySystem.Services;
using InventorySystem.Models;

namespace InventorySystem.Tests;

public class ItemsControllerTests
{
    private readonly Mock<IItemService> _mockService;
    private readonly ItemsController _controller;

    public ItemsControllerTests()
    {
        _mockService = new Mock<IItemService>();
        _controller = new ItemsController(_mockService.Object);
    }

    [Fact]
    public async Task GetItems_ShouldReturnOk_WithListOfItems()
    {
        var mockItems = new List<Item> 
        { 
            new Item { Id = Guid.NewGuid(), Name = "Test Item" } 
        };
        _mockService.Setup(s => s.GetAllItemsAsync()).ReturnsAsync(mockItems);

        var result = await _controller.GetItems();

        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        okResult.Value.Should().BeEquivalentTo(mockItems);
    }

    [Fact]
    public async Task GetItem_ShouldReturnNotFound_WhenItemDoesNotExist()
    {
        _mockService.Setup(s => s.GetItemByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Item?)null);

        var result = await _controller.GetItem(Guid.NewGuid());

        result.Result.Should().BeOfType<NotFoundResult>();
    }
}