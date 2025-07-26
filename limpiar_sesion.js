// Ejecuta esto en la consola del navegador para limpiar la sesión
localStorage.removeItem('token');
localStorage.removeItem('user');
sessionStorage.clear();

// Luego recarga la página
window.location.reload();
