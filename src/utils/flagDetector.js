export function detectXSS(input) {
  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<img[^>]+onerror\s*=\s*['"]/gi,
    /<svg[^>]+onload\s*=\s*['"]/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /javascript:/gi,
    /<[^>]*\s(on\w+)\s*=/gi, // cualquier evento onclick, onload, etc
    /<input[^>]+onfocus[^>]*>/gi,
    /<body[^>]+onload[^>]*>/gi,
    /<img[^>]+src\s*=\s*["']?javascript:/gi,
  ];

  const inputStr = String(input);
  return xssPatterns.some((pattern) => pattern.test(inputStr));
}

export function showXSSFlag() {
  return {
    exploited: true,
    vulnerability: "Cross-Site Scripting - XSS (A03:2021)",
    message: "🚩 ¡VULNERABILIDAD EXPLOTADA! XSS detectado",
    description: "Has logrado inyectar código JavaScript malicioso",
    severity: "HIGH",
  };
}

// Agregar estas funciones a src/utils/flagDetector.js

export function detectIDOR(tokenUserId, localStorageUserId) {
  // Si el userId del token JWT no coincide con el de localStorage
  // significa que el usuario manipuló el localStorage para acceder a otra cuenta
  return (
    tokenUserId &&
    localStorageUserId &&
    parseInt(tokenUserId) !== parseInt(localStorageUserId)
  );
}

export function showIDORFlag(realUserId, spoofedUserId) {
  return {
    exploited: true,
    vulnerability: "Broken Access Control - IDOR (A01:2021)",
    message: "🚩 ¡VULNERABILIDAD EXPLOTADA! Acceso no autorizado detectado",
    description: `Estás accediendo a la cuenta del usuario ID ${spoofedUserId} cuando tu ID real es ${realUserId}`,
    severity: "CRITICAL",
    details: {
      realUserId: realUserId,
      spoofedUserId: spoofedUserId,
      impact: "Control total de cuenta ajena",
    },
  };
}

// Función para extraer userId del token JWT
export function getUserIdFromToken(token) {
  if (!token) return null;

  try {
    // Decodificar JWT (sin verificar firma - solo para obtener el payload)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const payload = JSON.parse(jsonPayload);
    return payload.sub || payload.userId || payload.id;
  } catch (error) {
    console.error("Error decodificando token:", error);
    return null;
  }
}
export function detectAuthBypass() {
  const token = localStorage.getItem("token");

  // Detectar si no hay token
  if (!token) {
    return {
      type: "NO_TOKEN",
      message: "Acceso sin token JWT",
    };
  }

  // Detectar token inválido o expirado
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return {
        type: "EXPIRED_TOKEN",
        message: "Token JWT expirado",
      };
    }
  } catch (error) {
    return {
      type: "INVALID_TOKEN",
      message: "Token JWT malformado o inválido",
    };
  }

  return null;
}

export function showAuthBypassFlag(bypassType) {
  const messages = {
    NO_TOKEN: {
      title: "Acceso sin autenticación",
      description:
        "Has accedido a rutas protegidas sin proporcionar un token JWT válido",
      impact: "Bypass completo del sistema de autenticación",
    },
    EXPIRED_TOKEN: {
      title: "Token expirado aceptado",
      description:
        "El servidor aceptó un token JWT expirado, permitiendo acceso no autorizado",
      impact: "Tokens expirados siguen siendo válidos",
    },
    INVALID_TOKEN: {
      title: "Token inválido aceptado",
      description: "El servidor aceptó un token JWT malformado o manipulado",
      impact: "Validación de tokens inexistente o defectuosa",
    },
  };

  const info = messages[bypassType] || messages.NO_TOKEN;

  return {
    exploited: true,
    vulnerability: "Broken Authentication - Authentication Bypass (A07:2021)",
    message: `🚩 ¡VULNERABILIDAD EXPLOTADA! ${info.title}`,
    description: info.description,
    severity: "CRITICAL",
    details: {
      bypassType: bypassType,
      impact: info.impact,
      detectedAt: new Date().toISOString(),
    },
  };
}
