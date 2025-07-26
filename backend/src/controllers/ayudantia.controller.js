"use strict";
import Ayudantia from "../entity/ayudantia.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createValidation, updateValidation } from "../validations/ayudantia.validation.js";

export async function getAyudantias(req, res){
    try {
      
        const ayudantiasRepository = AppDataSource.getRepository(Ayudantia);
        
        const ayudantias = await ayudantiasRepository.find();
        
        res.status(200).json({ message: "Ayudantias encontradas correctamente", data: ayudantias });

    } catch (error) {
        console.error("Error al conseguir las ayudantias:", error);
        res.status(500).json({ message: "Error al conseguir las ayudantías" });
    }
}


export async function getayudantiaById(req, res){
    try{
        const ayudantiaRepository = AppDataSource.getRepository(Ayudantia);
        const { id } = req.params;

        const ayudantia = await ayudantiaRepository.findOne({ where: { id } });

        if (!ayudantia) {
            return res.status(404).json({ message: "Ayudantía no encontrada" });
        }
        
        res.status(200).json({ message: "Ayudantía encontrada correctamente", data: ayudantia });
    } catch (error) {
        console.error("Error al conseguir la ayudantía por ID:", error);
        res.status(500).json({ message: "Error al conseguir la ayudantía por ID" });
    }
}



export async function createAyudantia(req, res){
    try{
        const ayudantiaRepository = AppDataSource.getRepository(Ayudantia);
        const { asignatura, descripcion, hayprofesor, cupo } = req.body;
        const { error } = createValidation.validate(req.body);
        if (error) return res.status(400).json({ message: "Error al crear una ayudantia", error: error});

        const newAyudantia = ayudantiaRepository.create({
            asignatura,
            descripcion,
            hayprofesor,
            cupo,
        });
        await ayudantiaRepository.save(newAyudantia);
        res.status(201).json({ 
            message: "Ayudantía creada correctamente",
            data: newAyudantia });

    } catch (error) {
        console.error("Error al crear la ayudantía:", error);
        res.status(500).json({ message: "Error al crear la ayudantía" });
    }
}

export async function updateAyudantia(req, res){
    try {
        const ayudantiaRepository = AppDataSource.getRepository(Ayudantia);
        const { id } = req.params;
        const { asignatura, descripcion, hayprofesor, cupo } = req.body;
        
        const ayudantia = await ayudantiaRepository.findOne({ where: { id } });
        if (!ayudantia) return res.status(404).json({ message: "Ayudantía no encontrada" });

        const { error } = updateValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        ayudantia.asignatura = asignatura || ayudantia.asignatura;
        ayudantia.descripcion = descripcion || ayudantia.descripcion;
        ayudantia.hayprofesor = hayprofesor || ayudantia.hayprofesor;
        ayudantia.cupo = cupo || ayudantia.cupo;

        await ayudantiaRepository.save(ayudantia);
        res.status(200).json({message: "Ayudantía actualizada correctamente", data: ayudantia});
    } catch (error) {
        console.error("Error al actualizar la ayudantía:", error);
        res.status(500).json({ message: "Error al actualizar la ayudantía" });
    }
}
export async function deleteAyudantia(req, res){
    try{
        const ayudantiaRepository = AppDataSource.getRepository(Ayudantia);
        const { id } = req.params;
        const ayudantia = await ayudantiaRepository.findOne({ where: { id } });
        if (!ayudantia) return res.status(404).json({ message: "Ayudantía no encontrada" });

        await ayudantiaRepository.remove(ayudantia);
        res.status(200).json({ message: "Ayudantía eliminada correctamente" });


    } catch (error) {
        console.error("Error al eliminar la ayudantía:", error);
        res.status(500).json({ message: "Error al eliminar la ayudantía" });    
    }
}

export async function getAyudantiasConCupos(req, res) {
    try {
        const { default: SolicitudAyudantia } = await import("../entity/solicitudAyudantia.entity.js");
        
        const ayudantiasRepository = AppDataSource.getRepository(Ayudantia);
        const solicitudRepository = AppDataSource.getRepository(SolicitudAyudantia);
        
        const ayudantias = await ayudantiasRepository.find();
        
        const ayudantiasConInfo = await Promise.all(
            ayudantias.map(async (ayudantia) => {
                const solicitudesAprobadas = await solicitudRepository.count({
                    where: {
                        ayudantiaId: ayudantia.id,
                        estado: "aprobada"
                    }
                });
                
                const cuposDisponibles = ayudantia.cupo - solicitudesAprobadas;
                
                return {
                    ...ayudantia,
                    cuposDisponibles: Math.max(0, cuposDisponibles),
                    solicitudesAprobadas: solicitudesAprobadas,
                    disponibleParaSolicitud: ayudantia.hayprofesor && cuposDisponibles > 0
                };
            })
        );
        
        res.status(200).json({ 
            message: "Ayudantías con información de cupos encontradas correctamente", 
            data: ayudantiasConInfo 
        });

    } catch (error) {
        console.error("Error al conseguir las ayudantías con cupos:", error);
        res.status(500).json({ message: "Error al conseguir las ayudantías con información de cupos" });
    }
}