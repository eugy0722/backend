import * as Yup from "yup";

import User from "../models/user";
import Sector from "../models/sector";
import Sectorization from "../models/sectorization";

// Class Sectorization User Controller
class SectorizationController {
  // Register Sectorization User -- CREATE
  async store(req, res) {
    const schema = Yup.object().shape({
      id_sector: Yup.number().required(),
      id_marketman: Yup.number().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: "Validação falhou!" });
    }

    const userDesire = await User.findOne({
      attributes: ["id_user", "perfil"],
      where: {
        id_user: req.body.id_marketman,
      },
    });

    if (!userDesire) {
      return res.status(401).json({ error: "Utilizidor não encontrado" });
    }

    const sectorDesire = await Sector.findOne({
      attributes: ["id_sector"],
      where: {
        id_sector: req.body.id_sector,
      },
    });

    if (!sectorDesire) {
      return res.status(401).json({ error: "Sector não encontrado" });
    }

    const { id_user, perfil } = userDesire;
    const { id_sector } = sectorDesire;

    if (perfil === "Consumidor" || perfil === "Administrador") {
      return res.status(401).json({ erro: "Perfil de Utilizidor restrigido" });
    }

    const RelationExists = await Sectorization.findOne({
      attributes: ["id_sectorization"],
      where: {
        id_sector: id_sector,
        id_marketman: id_user,
      },
    });

    if (RelationExists) {
      return res
        .status(409)
        .json({ Mensagem: "A Relação entre os registros já existe" });
    }

    const { id_sectorization } = await Sectorization.create({
      id_sector: id_sector,
      id_marketman: id_user,
    });

    return res
      .json({
        id_sectorization,
      })
      .status(200);
  }
  // Search the Sectorization User -- READ
  async findAll(req, res) {
    const relations = await Sectorization.findAll({
      raw: true,
      where: {
        id_sector: req.params.id_sector,
      },
      attributes: ["id_sector"],
      include: [
        {
          model: User,
          required: true,
          attributes: [
            "first_name",
            "last_name",
            "username",
            "number_phone",
            "email",
            "perfil",
          ],
        },
      ],
    });

    return res.status(200).json(relations);
  }
  // Search an Sectorization -- READ
  async detailsSectorization(req, res) {}
  // Update Sectorization -- UPDATE
  async updatedSectorization(req, res) {}
  // Destroy Sectorization -- DELETE
  async destroySectorization(req, res) {
    try {
      await Sectorization.destroy({
        where: {
          id_sectorization: req.params.id_sectorization,
        },
      });

      return res.status(200).json({ message: "Deletedo com Successo" });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
}

export default new SectorizationController();
