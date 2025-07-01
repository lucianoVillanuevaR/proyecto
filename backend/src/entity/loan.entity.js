"use strict";

import { EntitySchema } from "typeorm";

export const LoanEntity = new EntitySchema({
  name: "Loan",
  tableName: "loans",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    estudianteEmail: {
      type: String,
      nullable: false,
    },
    materialNombre: {
      type: String,
      nullable: false,
    },
    fechaHoraPrestamo: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    fechaHoraDevolucion: {
      type: "timestamp",
      nullable: true,
    },
    estado: {
      type: String,
      default: "pendiente", // pendiente | devuelto
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
export default LoanEntity;
