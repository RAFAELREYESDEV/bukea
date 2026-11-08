import { CRMService } from './crm.service.js';

export class CRMController {
  static async list(req, res, next) {
    try {
      const { search, vipLevel, limit, offset } = req.query;
      const data = CRMService.listCustomers({ search, vipLevel, limit, offset });
      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const customer = CRMService.getCustomerById(id);
      if (!customer) {
        return res.status(404).json({ success: false, error: `Cliente '${id}' no encontrado` });
      }
      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateVIP(req, res, next) {
    try {
      const { id } = req.params;
      const { vipLevel, notes } = req.body;
      if (!vipLevel) {
        return res.status(400).json({ success: false, error: 'El campo vipLevel es obligatorio' });
      }
      const updated = CRMService.updateVIPStatus(id, vipLevel, notes);
      res.json({
        success: true,
        message: 'Estatus de fidelización actualizado con éxito',
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }
}
