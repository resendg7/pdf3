import { createClient } from '@supabase/supabase-js';
import type { Request, Response, NextFunction } from "express";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Create Supabase client for server-side operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Authentication middleware to protect routes
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized - Authentication failed" });
  }
};
