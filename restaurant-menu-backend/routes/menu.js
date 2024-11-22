const express = require("express");
const MenuItem = require("../models/MenuItem");

const router = express.Router();

// Add a menu item
router.post("/", async (req, res) => {
    const { restaurantId, name, description, price, category } = req.body;

    try {
        const newItem = new MenuItem({
            restaurantId,
            name,
            description,
            price,
            category,
        });
        await newItem.save();
        res.status(201).json({
            message: "Menu item added successfully",
            item: newItem,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all menu items for a restaurant
router.get("/:restaurantId", async (req, res) => {
    try {
        const items = await MenuItem.find({
            restaurantId: req.params.restaurantId,
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/generate/:restaurantId", async (req, res) => {
    const restaurantId = req.params.restaurantId;

    try {
        // Fetch menu items for the given restaurant
        const menuItems = await MenuItem.find({ restaurantId });

        // Generate HTML for the menu page
        let menuHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restaurant Menu</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; padding: 0; }
            h1 { text-align: center; color: #333; }
            ul { list-style: none; padding: 0; }
            li { background: #f4f4f4; margin: 10px 0; padding: 15px; border-radius: 5px; }
            .item-name { font-weight: bold; font-size: 1.2em; }
            .item-price { color: green; font-size: 1em; }
            .item-category { font-style: italic; color: gray; }
          </style>
        </head>
        <body>
          <h1>Menu</h1>
          <ul>
      `;

        // Populate menu items
        menuItems.forEach((item) => {
            menuHTML += `
          <li>
            <div class="item-name">${item.name}</div>
            <div class="item-price">$${item.price.toFixed(2)}</div>
            <div class="item-category">${item.category}</div>
            <p>${item.description || "No description provided."}</p>
          </li>
        `;
        });

        // Close HTML tags
        menuHTML += `
          </ul>
        </body>
        </html>
      `;

        // Send the generated HTML
        res.send(menuHTML);
    } catch (error) {
        res.status(500).json({
            error: "Error generating menu website: " + error.message,
        });
    }
});

module.exports = router;
