
import { setupMemberForm } from "../features/memberRegistration/memberForm.js";
import { loadMemberList } from "../features/members/memberList.js";
document.addEventListener("DOMContentLoaded", async () => {
    await setupMemberForm();
    await loadMemberList(); // (opcional) carga la lista de miembros existentes
}); 