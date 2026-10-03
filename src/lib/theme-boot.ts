export const THEME_STORAGE_KEY = "switchboard:theme";

/**
 * Runs in <head> before the page paints, so the saved theme (or the system
 * preference when nothing is saved) is applied without a flash.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;
