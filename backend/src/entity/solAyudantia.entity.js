"use strict";

import { EntitySchema } from "typeorm";

export const SolicitudAyudantiaEntity = new EntitySchema({
    name: "SolicitudAyudantia",
    tableName: "solicitudes_ayudantia",
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
        ayudantiaId: {
            type: Number,
            nullable: false,
        },
        estado: {
            type: String,
            nullable: false,
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

export default SolicitudAyudantiaEntity;