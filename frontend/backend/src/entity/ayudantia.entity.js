"use strict";
import { EntitySchema } from "typeorm";

export const AyudantiaEntity = new EntitySchema({
    name: "Ayudantia",
    tableName: "ayudantias",
    columns: {
        id: {
        type: Number,
        primary: true,
        generated: true,
        },
        asignatura: {
        type: String,
        unique: true,
        nullable: false,
        },
        descripcion: {
        type: String,
        nullable: false,
        },
        hayprofesor: {
        type: Boolean,
        nullable: false,
        default: false,
        },
        cupo:{
        type: Number,
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

export default AyudantiaEntity;