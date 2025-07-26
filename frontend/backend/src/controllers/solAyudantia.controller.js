"use strict";
import SolAyudantia from "../entity/solAyudantia.entity.js";
import Ayudantia from "../entity/ayudantia.entity.js";
import User from "../entity/user.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { solicitudValidation } from "../validations/solAyudantia.validation.js";

const solAyudantiaRepository = AppDataSource.getRepository(SolAyudantia);
const ayudantiaRepository = AppDataSource.getRepository(Ayudantia);
const userRepository = AppDataSource.getRepository(User);

export async function solicitarAyudantia(req, res) {
    try {
        const { ayudantiaId } = req.body;
        const usuarioEmail = req.user.email;

        const { error } = solicitudValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const usuario = await userRepository.findOne({ where: { email: usuarioEmail } });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const solicitudExistente = await solAyudantiaRepository.findOne({
            where: { 
                estudianteEmail: usuarioEmail,
                ayudantiaId: ayudantiaId
            }
        });

        if (solicitudExistente) {
            return res.status(409).json({ 
                message: "Ya tienes una solicitud para esta ayudantía",
                solicitudExistente: {
                    estado: solicitudExistente.estado,
                    fechaSolicitud: solicitudExistente.fechaSolicitud,
                    motivoRechazo: solicitudExistente.motivoRechazo
                }
            });
        }

        const ayudantia = await ayudantiaRepository.findOne({ where: { id: ayudantiaId } });
        if (!ayudantia) {
            return res.status(404).json({ message: "Ayudantía no encontrada" });
        }

        if (!ayudantia.hayprofesor) {
            const solicitudRechazada = solAyudantiaRepository.create({
                estudianteEmail: usuarioEmail,
                ayudantiaId: ayudantiaId,
                ayudantiaAsignatura: ayudantia.asignatura,
                estado: "rechazada"
            });

            await solAyudantiaRepository.save(solicitudRechazada);

            return res.status(400).json({ 
                message: "Solicitud rechazada: La ayudantía no tiene profesor asignado",
                data: solicitudRechazada
            });
        }

        const solicitudesAprobadas = await solAyudantiaRepository.count({
            where: { 
                ayudantiaId: ayudantiaId,
                estado: "aprobada"
            }
        });

        const cuposDisponibles = ayudantia.cupo - solicitudesAprobadas;

        if (cuposDisponibles <= 0) {
            const solicitudRechazada = solAyudantiaRepository.create({
                estudianteEmail: usuarioEmail,
                ayudantiaId: ayudantiaId,
                ayudantiaAsignatura: ayudantia.asignatura,
                estado: "rechazada"
            });

            await solAyudantiaRepository.save(solicitudRechazada);

            return res.status(400).json({ 
                message: "Solicitud rechazada: No hay cupos disponibles",
                data: solicitudRechazada
            });
        }

        const solicitudAprobada = solAyudantiaRepository.create({
            estudianteEmail: usuarioEmail,
            ayudantiaId: ayudantiaId,
            ayudantiaAsignatura: ayudantia.asignatura,
            estado: "aprobada"
        });

        await solAyudantiaRepository.save(solicitudAprobada);

        res.status(201).json({ 
            message: "¡Solicitud aprobada automáticamente!",
            data: {
                ...solicitudAprobada,
                cuposDisponiblesRestantes: cuposDisponibles - 1
            }
        });

    } catch (error) {
        console.error("Error al solicitar ayudantía:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function misSolicitudes(req, res) {
    try {
        const usuarioEmail = req.user.email;

        const solicitudes = await solAyudantiaRepository.find({
            where: { estudianteEmail: usuarioEmail },
            order: { createdAt: "DESC" }
        });

        res.status(200).json({ 
            message: "Solicitudes encontradas",
            data: solicitudes
        });

    } catch (error) {
        console.error("Error al obtener solicitudes:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}

export async function getSolicitudById(req, res) {
    try {
        const { id } = req.params;
        const usuarioEmail = req.user.email;

        const solicitud = await solAyudantiaRepository.findOne({
            where: { 
                id: id,
                estudianteEmail: usuarioEmail 
            }
        });

        if (!solicitud) {
            return res.status(404).json({ message: "Solicitud no encontrada" });
        }

        res.status(200).json({ 
            message: "Solicitud encontrada",
            data: solicitud
        });

    } catch (error) {
        console.error("Error al obtener solicitud:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
}