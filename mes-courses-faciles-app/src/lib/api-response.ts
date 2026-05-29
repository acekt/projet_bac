import { NextResponse } from 'next/server';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
};

export const AppResponse = {
  success: <T>(data: T, status = 200) => {
    return NextResponse.json({ success: true, data }, { status });
  },

  error: (message: string, status = 400, details?: any) => {
    return NextResponse.json({ success: false, error: message, details }, { status });
  },

  unauthorized: (message = 'Non autorisé') => {
    return AppResponse.error(message, 401);
  },

  forbidden: (message = 'Accès interdit') => {
    return AppResponse.error(message, 403);
  },

  notFound: (message = 'Ressource non trouvée') => {
    return AppResponse.error(message, 404);
  },

  serverError: (message = 'Erreur interne du serveur', details?: any) => {
    console.error(`[ServerError]: ${message}`, details);
    return AppResponse.error(message, 500, process.env.NODE_ENV === 'development' ? details : undefined);
  },

  dbUnavailable: () => {
    return AppResponse.error('Service de base de données temporairement indisponible', 503);
  }
};
