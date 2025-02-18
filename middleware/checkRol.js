
const checkRol = (req, res, next) => {
    const rolesPermitidos = 'ADMTlN';
    const usuario = req.usuario;  // Se asume que el usuario ya fue autenticado y su información está en req.usuario

    if (!usuario) {
        return res.status(401).json({ msg: 'Usuario no autenticado' });
    }

    // Verificar si el rol del usuario está dentro de los roles permitidos
    if (!rolesPermitidos.includes(usuario.rol)) {
        return res.status(403).json({ msg: 'Acceso denegado, no tienes los permisos necesarios' });
    }

    next();  // Permite el acceso si el rol coincide
};

export default checkRol;
