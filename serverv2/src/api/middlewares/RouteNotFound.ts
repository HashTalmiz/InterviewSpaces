import { Request, Response, NextFunction } from 'express';

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
    return res.status(400).json({ "success": "false", "error": "Route not found" });
}

export default routeNotFound; 