import { EntitySchema } from "typeorm";

export const ActivityEntity = new EntitySchema({
    name: "Activity",
    tableName: "activities",
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },
        name: {
            type: String,
            nullable: false
        },
        description: {
            type: String,
            nullable: false
        },
        type: {
            type: String,
            enum: ["taller", "torneo", "charla", "otro"],
            nullable: false
        },
        votesCount: {
            type: Number,
            default: 0
        },
        targetMonth: {
            type: Date,
            nullable: false
        },
        status: {
            type: String,
            enum: ["propuesta", "seleccionada", "organizada", "completada", "rechazada"],
            default: "propuesta"
        },
        createdAt: {
            type: Date,
            createDate: true
        },
        organizationDetails: {
            type: "jsonb",
            nullable: true
        },
        isAdminActivity: {
            type: "boolean",
            default: false
        }
    },
    relations: {
        createdBy: {
            type: "many-to-one",
            target: "User",
            nullable: true,  // Permitir que sea null para actividades creadas por admin
            joinColumn: {
                name: "createdById",
                referencedColumnName: "id"
            }
        },
        votes: {
            type: "many-to-many",
            target: "User",
            joinTable: {
                name: "activity_votes",
                joinColumn: {
                    name: "activity_id",
                    referencedColumnName: "id"
                },
                inverseJoinColumn: {
                    name: "user_id",
                    referencedColumnName: "id"
                }
            }
        }
    }
});
