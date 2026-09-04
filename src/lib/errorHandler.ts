/**
 * Error handler utility to prevent information leakage
 * Maps database/internal errors to user-friendly messages
 */
export const getErrorMessage = (error: unknown): string => {
  if (__DEV__) {
    console.error('Error details:', error);
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    // Rate limiting errors - be specific about these
    if (message.includes('rate limit exceeded')) {
      if (message.includes('orders')) {
        return 'Too many orders. Please wait before placing more orders.';
      }
      if (message.includes('messages')) {
        return 'Sending too fast. Please slow down.';
      }
      return 'Too many requests. Please wait a moment and try again.';
    }

    // Message length validation
    if (message.includes('chat_message_length_check')) {
      return 'Message is too long. Maximum 5000 characters allowed.';
    }
    
    // Map common Postgres errors to user-friendly messages
    if (message.includes('duplicate key')) {
      return 'This record already exists.';
    }
    if (message.includes('violates foreign key')) {
      return 'Cannot complete operation due to related records.';
    }
    if (message.includes('violates not-null')) {
      return 'Required information is missing.';
    }
    if (message.includes('row-level security')) {
      return 'You do not have permission to perform this action.';
    }
    if (message.includes('violates check constraint')) {
      return 'The provided data is invalid.';
    }
    if (message.includes('network') || message.includes('fetch')) {
      return 'Connection failed. Please check your internet connection.';
    }
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }
    if (message.includes('jwt') || message.includes('token')) {
      return 'Your session has expired. Please log in again.';
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Please log in to continue.';
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return 'You do not have permission to access this resource.';
    }
    if (message.includes('not found') || message.includes('404')) {
      return 'The requested resource was not found.';
    }

    // Generic fallback
    return 'An error occurred. Please try again.';
  }

  return 'An unexpected error occurred.';
};

/**
 * Validates chat message before sending
 */
export const validateChatMessage = (message: string): { valid: boolean; error?: string } => {
  const trimmed = message.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (trimmed.length > 5000) {
    return { valid: false, error: 'Message is too long. Maximum 5000 characters allowed.' };
  }
  
  return { valid: true };
};

/**
 * Validates file upload before attempting upload
 */
export const validateFileUpload = (
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } => {
  const { maxSizeMB = 10, allowedTypes } = options;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  if (allowedTypes && allowedTypes.length > 0) {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const isAllowedType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExt === type.slice(1).toLowerCase();
      }
      if (type.includes('*')) {
        const [mainType] = type.split('/');
        return file.type.startsWith(mainType);
      }
      return file.type === type;
    });

    if (!isAllowedType) {
      return { valid: false, error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
    }
  }

  return { valid: true };
};
