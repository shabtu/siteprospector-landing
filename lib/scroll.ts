/**
 * Smooth-scrolls to a section of the start page. On other pages (the legal
 * pages) the section does not exist, so go to it on the start page instead.
 */
export function goToSection(id: string): void {
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: "smooth" });
  else window.location.assign(`/#${id}`);
}
