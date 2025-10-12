import { setupMembershipForm } from "../features/memberships/membershipForm.js";
import { loadMembershipList } from "../features/memberships/membershipList.js";

document.addEventListener("DOMContentLoaded", async () => {
    await setupMembershipForm();
    await loadMembershipList();
});