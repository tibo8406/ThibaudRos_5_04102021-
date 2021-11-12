async function loadConfig() {
    let result = await fetch("../../front/config.json");
    return result.json();
}