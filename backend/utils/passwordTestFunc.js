function validatePassword(password) {
    if (password.length < 8) {
        return {
            isValid: false,
            message: 'Le mot de passe doit contenir au moins 8 caractères.'
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            isValid: false,
            message: 'Le mot de passe doit contenir au moins une lettre majuscule.'
        };
    }

    if (!/[a-z]/.test(password)) {
        return {
            isValid: false,
            message: 'Le mot de passe doit contenir au moins une lettre minuscule.'
        };
    }

    if (!/\d/.test(password)) {
        return {
            isValid: false,
            message: 'Le mot de passe doit contenir au moins un chiffre.'
        };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return {
            isValid: false,
            message: 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?":{}|<>).'
        };
    }

    if (/\s/.test(password)) {
        return {
            isValid: false,
            message: 'Le mot de passe ne doit pas contenir d\'espaces.'
        };
    }

    // Si toutes les vérifications sont passées
    return {
        isValid: true,
        message: 'Mot de passe valide'
    };
}

module.exports = validatePassword;