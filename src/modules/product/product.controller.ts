import { Request, Response, NextFunction } from "express";

const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO
  } catch (error) {
    next(error);
  }
};

export const productController = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
