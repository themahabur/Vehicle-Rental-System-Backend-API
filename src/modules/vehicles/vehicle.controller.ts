import { Request, Response } from "express";
import * as VehicleService from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await VehicleService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: vehicle,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllVehicles = async (_req: Request, res: Response) => {
  const vehicles = await VehicleService.getAllVehicles();
  res.json({
    success: true,
    message: "Vehicles retrieved successfully",
    data: vehicles,
  });
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await VehicleService.getVehicleById(
      req.params.vehicleId as string
    );
    res.json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicle = await VehicleService.updateVehicle(
      req.params.vehicleId as string,
      req.body
    );
    res.json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    await VehicleService.deleteVehicle(req.params.vehicleId as string);
    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const vehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
