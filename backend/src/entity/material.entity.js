"use strict";

import { EntitySchema } from "typeorm";

export const MaterialEntity = new EntitySchema({
  name: "Material",
  tableName: "materials",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    nombre: {
      type: String,
      nullable: false,
      unique: true,
    },
    tipo: {
      type: String,
      nullable: true,
    },
    cantidadTotal: {
      type: Number,
      nullable: false,
    },
    cantidadDisponible: {
      type: Number,
      nullable: false,
    },
    estado: {
      type: String,
      default: "activo", 
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updatedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: () => "CURRENT_TIMESTAMP",
    },
  },
});

export default MaterialEntity;
