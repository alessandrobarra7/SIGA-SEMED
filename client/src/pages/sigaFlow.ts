export function validateFirstAccess(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
) {
  if (newPassword !== confirmPassword) {
    return "A confirmação precisa ser igual à nova senha.";
  }
  if (newPassword.length < 10) {
    return "A nova senha precisa ter pelo menos 10 caracteres.";
  }
  if (newPassword === currentPassword) {
    return "A nova senha deve ser diferente da senha atual.";
  }
  return "";
}
