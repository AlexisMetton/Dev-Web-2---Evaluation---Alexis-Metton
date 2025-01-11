const hasPermission = (currentUserRoles, targetUserRoles) => {
    if (currentUserRoles.includes('ROLE_SUPERADMIN')) {
        return true; 
    }
    if (currentUserRoles.includes('ROLE_ADMIN')) {
        return !targetUserRoles.includes('ROLE_ADMIN') && !targetUserRoles.includes('ROLE_SUPERADMIN')
    }
    return false;
};

module.exports = { hasPermission };
