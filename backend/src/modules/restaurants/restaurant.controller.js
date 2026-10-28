import { RestaurantService } from './restaurant.service.js';

export class RestaurantController {
  static async getAll(req, res, next) {
    try {
      const { tier, category, status } = req.query;
      const restaurants = RestaurantService.listAll({ tier, category, status });
      res.json({
        success: true,
        count: restaurants.length,
        data: restaurants
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { idOrSlug } = req.params;
      const restaurant = RestaurantService.getByIdOrSlug(idOrSlug);
      if (!restaurant) {
        return res.status(404).json({
          success: false,
          error: `Restaurante '${idOrSlug}' no encontrado`
        });
      }
      res.json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTables(req, res, next) {
    try {
      const { id } = req.params;
      const { areaId } = req.query;
      const tables = RestaurantService.getTables(id, areaId);
      res.json({
        success: true,
        count: tables.length,
        data: tables
      });
    } catch (error) {
      next(error);
    }
  }
}
