export function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "block";
}
export function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = "none";
}
export function setupModalCloseHandlers(id) {
    const modal = document.getElementById(id);
    const span = modal.querySelector(".close");
    span.onclick = () => closeModal(id);
    window.onclick = (event) => {
        if (event.target === modal) closeModal(id);
    };
}