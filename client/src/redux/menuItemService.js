import axios from "axios";
import { logger } from "../utils/logger.js";
import { API_BASE } from "../utils/apiBase.js";

const menuItemService = {
  // Get all menu items
  menuItemGetAll: async (filters = {}) => {
    logger.debug("menuItemService.menuItemGetAll start", filters);
    const queryParams = new URLSearchParams();
    if (filters.itemType) queryParams.append("itemType", filters.itemType);
    if (filters.available !== undefined)
      queryParams.append("available", filters.available);
    if (filters.featured !== undefined)
      queryParams.append("featured", filters.featured);

    const queryString = queryParams.toString();
    const url = queryString ? `/menu-items?${queryString}` : "/menu-items";

    const response = await axios.get(`${API_BASE}${url}`);
    logger.debug(
      "menuItemService.menuItemGetAll response",
      response?.data?.count
    );
    return response;
  },

  // Get one menu item
  menuItemGetOne: async (id) => {
    logger.debug("menuItemService.menuItemGetOne start", { id });
    const response = await axios.get(`${API_BASE}/menu-items/${id}`);
    logger.debug("menuItemService.menuItemGetOne response", response);
    return response;
  },

  // Create menu item
  menuItemCreate: async (menuItemData) => {
    try {
      logger.debug("menuItemService.menuItemCreate", menuItemData?.itemName);
      const response = await axios.post(
        `${API_BASE}/menu-items`,
        menuItemData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      logger.debug(
        "menuItemService.menuItemCreate response",
        response?.data?.menuItem?.id || response?.data?.menuItem?._id
      );
      return response.data;
    } catch (error) {
      logger.error("Menu item create error", {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Update menu item
  menuItemUpdate: async (formData) => {
    logger.debug("menuItemService.menuItemUpdate start", formData);
    const response = await axios.put(
      `${API_BASE}/menu-items/${formData.id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    logger.debug("menuItemService.menuItemUpdate response", response);
    return response;
  },

  // Delete menu item
  menuItemDelete: async (id) => {
    logger.debug("menuItemService.menuItemDelete start", { id });
    const response = await axios.delete(`${API_BASE}/menu-items/${id}`);
    logger.debug("menuItemService.menuItemDelete response", response);
    return { ...response.data, id }; // Return id for optimistic updates
  },
};

export default menuItemService;
